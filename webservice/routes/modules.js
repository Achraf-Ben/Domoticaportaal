/*
	Hier staat de api naar de modules in de database
	Modules kunnen door de client niet worden aangemaakt, aangepast of verwijderd.

	Een client kan:
		- Modules ophalen (GET: /api/modules)
*/

var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var async = require('async');
var config = require('../config');
var pool  = mysql.createPool(config.databaseSettings);

// Route om modules uit de database op te vragen
// GET: /api/modules/
router.get('/', function(req, res, next) {
	/*
		Er wordt gekeken of de client is ingelogt
		Als dit niet zo is wordt er een 403 (unauthorized) code teruggestuurd.
		Als de client is ingelogt worden de modules opgehaald uit de database.
		Als er geen error optreed worden de modules teruggestuurd naar de client.
		Als er een error optreed wordt er een 500 (server error) code teruggestuurd 
		om aan te geven dat er iets mis is met de server.	
	*/


	var user_id = req.session.user_id;
	
	// controlleer of de client is ingelogd
	if(!user_id){
		res.status(403).json({msg:"unauthorized"});
		return
	} 

	// Haal een verbinding uit de pool met verbindingen naar de database
	pool.query("SELECT * FROM module", function(err, result){

		// in geval van een error, stuur een 500 code terug
		// om aan te geven dat er iets mis is met de server.
		if(err){
			console.log(err);
			res.status(500).send("database_error");
		}
		
		// stuur het resultaat terug naar de client
		res.json(result);
	});
	
});

module.exports = router;
