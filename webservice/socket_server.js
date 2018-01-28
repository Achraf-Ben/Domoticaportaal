var net = require('net')
var socketio = require('socket.io');
var modules = {};
var mysql = require('mysql');
var async = require('async');
var databaseSettings = {
  host: "localhost",
  user: "root",
  password: "NiA12309",
  database: "domotica_portaal"
};




module.exports = function(server){
    var io = socketio(server);
    var tcpServer = new net.createServer(serverHandler);
    tcpServer.listen(4040);

    // Socket.io verbinding voor website en app
    io.on('connection', function (socket) { 
        socket.on('alarm_off', function(data){
            tcpSocket = modules[data.id];
            tcpSocket.write('alarm_off');
        });

        socket.on('light_on', function(data){
            tcpSocket = modules[data.id];
            tcpSocket.write('light_on');
        });

        socket.on('light_off', function(data){
            tcpSocket = modules[data.id];
            tcpSocket.write('light_off');

        });

        socket.on('camera_on', function(data){
            tcpSocket = modules[data.id];

        });

        socket.on('camera_off', function(data){
            tcpSocket = modules[data.id];

        });
    });

    // tcp socket server voor modules
    function serverHandler(socket){
        console.log('CONNECTED: ' + socket.remoteAddress +':'+ socket.remotePort);

        socket.on('data', function(data){
            console.log('DATA: '+data)
            data = JSON.parse(data);
        
            if(data.msg == 'register'){
                
                registerModule(socket.remoteAddress, data.mac_address, function(id){
                    console.log(id);
                    modules[id] = socket;
                    
                    response = JSON.stringify({
                        'msg': 'registered',
                        'id': id
                    });

                    console.log(response);

                    socket.write(response)
                    io.local.emit('new_module', {id:id});
                });
            }

            if(data.msg == 'alarm'){
                io.local.emit('alarm', {id:socketData.id});
            }
        }); 

        socket.on('end', function(){

        });
    }
}    

function registerModule(ip, mac_address, cb){
    var con = mysql.createConnection(databaseSettings);
    ip = ip.replace('::ffff:','');
    con.connect(function(err){

        if(err){
            console.log(err);
        }

        async.auto({
            getId: function(callback){
                con.query("SELECT id from module WHERE mac_address=?", [mac_address], function (err, dbResult) {
                    if (err) console.log(err);
                    callback(null, dbResult);                    
                });
            },
            register: ['getId', function(results, callback){
                
                if(results.getId.length){
                    var id = results.getId[0].id;
                    callback(null, id);
                } else {
                    var values = [['',ip,mac_address,0,0,1]];
                    con.query("INSERT INTO module (hostname, ip, mac_address, camera_status, light_status, status) VALUES ?",
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
    });
}

