var net = require('net')
var socketio = require('socket.io');
var modules = {};
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
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
            data = JSON.parse(data);
            switch(data.msg){
                case 'register':
                    
                    con.createConnection(function(err){

                        if(err){
                            console.log(err);
                        }

                         con.query("SELECT id from module WHERE mac_address=?", [data.mac_address], function (err, result) {
                            if (err) throw err;
                            var id = result;
                            modules[id] = socket;

                            response = JSON.stringify({
                                'msg': 'registered',
                                'id': id
                            });

                            socket.write(response)
                            io.broadcast.emit('new_module', {id:data.id});
                        });
                    });

                    
                case 'alarm':
                    io.broadcast.emit('alarm', {id:socketData.id})
            }
        }); 

        socket.on('end', function(){

        });
    }
}    



