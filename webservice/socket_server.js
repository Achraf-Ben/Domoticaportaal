var net = require('net')
var socketio = require('socket.io');
var modules = {};
var mysql = require('mysql');
var async = require('async');
var config = require('./config');
var moment = require('moment');
var pool  = mysql.createPool(config.databaseSettings);



module.exports = function(server){
    var io = socketio(server);
    var tcpServer = new net.createServer(serverHandler);
    tcpServer.listen(4040);

    // Socket.io verbinding voor website en app
    io.on('connection', function (socket) { 
        socket.on('alarm_off', function(data){
            tcpSocket = modules[data.id];
            if(tcpSocket){
                tcpSocket.write('alarm_off');
                io.local.emit('new_module');
            }  
        });

        socket.on('light_on', function(data){
            tcpSocket = modules[data.id];
            if(tcpSocket){
                tcpSocket.write('light_on');
            }
        });

        socket.on('light_off', function(data){
            tcpSocket = modules[data.id];
            if(tcpSocket){
                tcpSocket.write('light_off');
            }
        });

        socket.on('camera_on', function(data){
            tcpSocket = modules[data.id];
            if(tcpSocket){
                tcpSocket.write('camera_on');
            }
        });

        socket.on('camera_off', function(data){
            tcpSocket = modules[data.id];
            if(tcpSocket){
                tcpSocket.write('camera_on')
            }
        });
    });

    // tcp socket server voor modules
    function serverHandler(socket){
        console.log('CONNECTED: ' + socket.remoteAddress +':'+ socket.remotePort);
        socket.setTimeout(6000, socket.destroy);
        socket.on('data', function(data){
            data = JSON.parse(data);
        
            if(data.msg == 'register'){
                registerModule(socket.remoteAddress, data.mac_address, function(id){
                    socket.module_id = id;
                    modules[id] = socket;
                    
                    response = JSON.stringify({
                        'msg': 'registered',
                        'id': id
                    });

                    socket.write(response)
                    io.local.emit('new_module', {id:id});
                });
            }

            if(data.msg == 'camera_on'){
                updateStatus(socket.id, 'camera_status', 1, function(){
                    io.local.emit('camera_on')
                });
            }

            if(data.msg == 'camera_off'){
                updateStatus(socket.id, 'camera_status', 0 function(){
                    io.local.emit('camera_off')
                });
            }

            if(data.msg == 'alarm'){
                createAlarm(socket.module_id, function(err, module){
                    io.local.emit('alarm', module);
                });
            }
        }); 

        socket.on('timeout', function(){
            console.log('Socket: '+socket.module_id+" has disconnected");
            updateStatus(socket.module_id, 0, function(){
                io.local.emit('module_disconnect');
            });
        });
    }
}    

function createAlarm(id, callback){
    async.auto({
        createAlarm: function(cb){
            var timestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var values = [[id, 1, timestamp]];
            pool.query("INSERT INTO alarm (module_id, status, alarm_time) VALUES ?", 
                [values], function(err, results){
                    cb(err);
                });
        },
        updateModule: function(cb){
            pool.query("UPDATE module SET camera_status=1 WHERE id=?", [id], function(err, results){
                cb()
            });
        },
        getModule: function(cb){
            pool.query("SELECT * FROM module WHERE id=? LIMIT 1", [id], function(err, results){
                cb(err, results[0]);
            });
        }
    }, function(err, results){
        callback(err, results.getModule);
    });
}

function updateStatus(id, col, status, callback){
    pool.query('UPDATE module SET ? = ? WHERE id=?', [col, status, id], function(err, results){
        callback();
    });
}

function registerModule(ip, mac_address, cb){
    var con = mysql.createConnection(config.databaseSettings);
    ip = ip.replace('::ffff:','');

    async.auto({
        getId: function(callback){
            pool.query("SELECT id from module WHERE mac_address=?", [mac_address], function (err, dbResult) {
                if (err) console.log(err);
                callback(null, dbResult);                    
            });
        },
        register: ['getId', function(results, callback){
            if(results.getId.length){
                var id = results.getId[0].id;
                updateStatus(id, 1, function(){
                    callback(null, id);
                });
            } else {
                var values = [['',ip,mac_address,0,0,1]];
                pool.query("INSERT INTO module (hostname, ip, mac_address, camera_status, light_status, status) VALUES ?",
                    [values],function(err, dbResult){
                        if(err) console.log(err);
                        callback(null, dbResult.insertId);
                    });
            }
        }]
    }, function(err, results){
        con.end();
        cb(results.register);
    });
}

