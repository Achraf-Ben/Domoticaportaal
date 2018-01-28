var net = require('net')
var socketio = require('socket.io');
var modules = {};
var mysql = require('mysql');
var async = require('async');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "NiA12309",
  database: "domotica_portaal"
});

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
            switch(data.msg){
                case 'register':
                    
                    var id = registerModule(socket.remoteAddress, data.mac_address);

                    modules[id] = socket;
                    
                    response = JSON.stringify({
                        'msg': 'registered',
                        'id': id
                    });

                    socket.write(response)
                    io.local.emit('new_module', {id:data.id});
                    break;
                    
                case 'alarm':
                    io.local.emit('alarm', {id:socketData.id});
                    break;
            }
        }); 

        socket.on('end', function(){

        });
    }
}    

function registerModule(ip, mac_address){
    con.connect(function(err){

        if(err){
            console.log(err);
        }

        async.auto({
            getId: function(callback){
                con.query("SELECT id from module WHERE mac_address=?", [data.mac_address], function (err, result) {
                    if (err) console.log(err);

                    if(!result){
                        
                    }

                    var id = result;
                    
                });
            },
            register: ['getId', function(callback, results){
                if(result.getId){
                    callback(null, result.getId.id);
                } else {
                    con.query("INSERT INTO module (hostname, ip, mac_address, camera_status, light_status, status)",
                        ['',socket.remoteAddress,data.mac_address,0,0,1],function(err, result){
                            if(err) console.log(err);
                            callback(null, result.insertId);
                        });
                }
            }]
        }, function(err, results){
            con.end();
            return results.register;
        });
    });
}

