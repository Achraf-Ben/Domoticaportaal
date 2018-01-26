var net = require('net')
var socketio = require('socket.io');
var modules = {};

module.exports = function(server){
    var io = socketio(server);
    var tcpServer = new net.createServer(serverHandler);
    tcpServer.listen(4040);

    io.on('connection', function (socket) { 
        socket.on('alarm_off', function(data){
            module = tcpSockets[data.id];
            tcpSocket.write('alarm_off');
        });
    });

    function serverHandler(socket){
        console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

        socket.on('data', function(data){
            data = JSON.parse(data);
            switch(data){
                case 'register':
                    modules[data.id] = socket;
                    io.broadcast.emit('new_module', {id:data.id});
                case 'alarm':
                    io.broadcast.emit('alarm', {id:socketData.id})
            }
        }); 

        socket.on('end', function(){

        });
    }
}    