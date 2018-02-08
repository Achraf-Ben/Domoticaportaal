/*
    In dit bestand staan de TCP en Socket.IO server.
    Deze twee servers regelen de communicatie tussen 
    het webportaal, de smartphone app en de domoticamodules .
*/

var net = require('net')
var socketio = require('socket.io');
var modules = {};
var mysql = require('mysql');
var async = require('async');
var moment = require('moment');
var config = require('./config');
var pool  = mysql.createPool(config.databaseSettings);


function socketIOHandler(socket){
    /*
        Binnen deze functie worden binnenkomende berichten over de websocket afgehandeld
    */

    socket.on('alarm_off', function(data){
    // Bericht om alarm op de domoticamodule uit te zetten.

        // Haal de TCP socket naar de correcte module op met het meegstuurde id.
        tcpSocket = modules[data.id];
        if(tcpSocket){
            tcpSocket.write('alarm_off'); // Stuur bericht door naar de module.
            io.local.emit('alarm_off', data); // Laat andere webportaal clients weten dat het alarm is uitgezet.
        }  
    });

    socket.on('light_on', function(data){
        // Bericht om de verlichting die op de module is aangesloten aan te zetten.

        // Haal de TCP socket naar de correcte module op met het meegstuurde id.
        tcpSocket = modules[data.id];
        if(tcpSocket){
            tcpSocket.write('light_on'); // Stuur bericht door naar de module.
        }
    });

    socket.on('light_off', function(data){
        // Bericht om de verlichting die op de module is aangesloten uit te zetten.

        // Haal de TCP socket naar de correcte module op met het meegstuurde id.
        tcpSocket = modules[data.id];
        if(tcpSocket){
            tcpSocket.write('light_off'); // Stuur bericht door naar de module.
        }
    });

    socket.on('camera_on', function(data){
        // Bericht om de camera die op de module is aangesloten aan te zetten.
        
        // Haal de TCP socket naar de correcte module op met het meegstuurde id.
        tcpSocket = modules[data.id];
        if(tcpSocket){
            tcpSocket.write('camera_on'); // Stuur bericht door naar de module.
        }
    });

    socket.on('camera_off', function(data){
        // Bericht om de camera die op de module is aangesloten uit te zetten.
        
        // Haal de TCP socket naar de correcte module op met het meegstuurde id.
        tcpSocket = modules[data.id];
        if(tcpSocket){
            tcpSocket.write('camera_off'); // Stuur bericht door naar de module.
        }
    });
}

function serverHandler(socket){
    /*
        Binnen deze functie worden inkomende berichten over de TCP socket afgehandeld.
    */

    socket.setTimeout(6000, socket.destroy);
    socket.on('data', function(data){
        // Wordt uitgevoerd als er data over de TCP socket binnenkomt

        data = JSON.parse(data);
    
        if(data.msg == 'register'){
            // bericht om een module te registreren

            registerModule(socket.remoteAddress, data.mac_address, function(id){
                // Wanneer de module geregistreerd is sla dan de socket naar de module
                // op in het geheugen onder het id van de module.
                socket.module_id = id;
                modules[id] = socket;
                
                response = JSON.stringify({
                    'msg': 'registered',
                    'id': id
                });

                // Laat de module weten dat het registreren gelukt is.
                socket.write(response); 

                // Stuur een bericht naar de webportaal clients dat er een nieuwe module in het systeem staat.
                io.local.emit('new_module', {id:id}); 
            });
        }

        if(data.msg == 'camera_on'){
            // Bericht om aan te geven dat de module zijn camera heeft aangezet.

            // Wijzig de status van de module in de database.
            updateStatus(socket.module_id, 'camera_status', 1, function(){
                io.local.emit('camera_on') // laat websocket clients weten dat een module zijn camera heeft aangezet.
            });
        }

        if(data.msg == 'camera_off'){
            // Bericht om aan te geven dat de module zijn camera heeft aangezet.

            updateStatus(socket.module_id, 'camera_status', 0, function(){
                io.local.emit('camera_off')
            });
        }

        if(data.msg == 'alarm'){
            // Bericht om aan te geven het alarm van de module afgaat.

            // sla de alarmmelding op in de database
            createAlarm(socket.module_id, function(err, module){ 
                io.local.emit('alarm', module); // laat websocket clients weten dat het alarm afgaat.
            });
        }
    }); 

    socket.on('timeout', function(){
        // Zet de module op offline als deze langer dan 6 seconden niet reageert

        console.log('Socket: '+socket.module_id+" has disconnected");

        // Wijzig de status van de module naar offline
        updateStatus(socket.module_id, 'status', 0, function(){
            io.local.emit('module_disconnect'); // Laat websocket clients weten dat er een module offline is gegaan
        });
    });
}  

function createAlarm(id, callback){
    /*
        Maakt een nieuwe regel aan in de alarm tabel in de database, update de status van de module
        en haalt de module op om mee te sturen met het bericht naar de websocket clients
    */

    /* Het volgende gebeurt tegelijkertijd:
        - Het aanmaken van een alarm in de database
        - Het updaten van de status van de module
        - De module ophalen uit de database*/
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
        // stuure de module terug en eventuele foutmeldingen mee terug
        callback(err, results.getModule);
    });
}

function updateStatus(id, col, status, callback){
    /*  
        Wijzigt de status van een module in de database
    */

    pool.query('UPDATE module SET '+col+'=? WHERE id=?', [status, id], function(err, results){
        callback();
    });
}

function registerModule(ip, mac_address, cb){

    /*
        Registreerd een module binnen het systeem
        Er wordt gekeken of de module al in de database staat op basis van het mac adres van de module
        Als dat niet zo is wordt er een nieuwe module aangemaakt in de database.
        Als er wel een module in de database staat wordt de id daarvan opgehaald en teruggegeven
    */

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
                updateStatus(id, 'status', 1, function(){
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
        cb(results.register);
    });
}

module.exports = function(server){
    var io = socketio(server);
    io.on('connection', socketIOHandler);

    var tcpServer = new net.createServer(serverHandler);
    tcpServer.listen(4040);
}    
