/*
	Hier staat de api naar de gebruikers in de database.

	Een client kan:
		- inloggen 						(GET: /api/login)
		- nieuwe gebruikers aanmaken	(POST: /api/users/:id)
		- gebruikers ophalen 			(GET: /api/users)
		- gebruikers aanpassen			(PUT: /api/users/:id)
		- gebruikers verwijderen		(DELETE: /api/users/:id)
*/

var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var async = require('async');
var config = require('../config');
var pool  = mysql.createPool(config.databaseSettings);

// Route om in te loggen
// POST: /api/users/login
router.post('/login', function(req, res, next){
	/*
		Een client stuurt een email en een wachtwoord op.
		De gebruiker wordt opgehaald uit de database op met het email adres en vervolgens
		wordt er gekeken of er een regel terugkomt. Als er een regel terugkomt wordt 
		het opgestuurde wachtwoord vergeleken met het versleutelde wachtwoord in de database.
		Als de twee matchen wordt er een succescode teruggestuurd.
		Als er geen regel uit de database wordt opgehaald of de wachtwoorden niet matchen wordt 
		er een 403 (unauthorized) code teruggestuurd. Als er een fout optreed tijdens het proces
		wordt er een 500 (server error) code teruggestuurd om aan te geven dat er iets mis is met de server.
	*/

	var email = req.body.email;
	var password = req.body.password;
	var session = req.session;

	// Ik gebruik async.auto zodat ik geen hele diepe callbacks heb.
	// Hier kunnen ook promises voor gebruikt worden maar ik vind dit leesbaarder.
	// https://github.com/caolan/async - Async Docs
	async.auto({
		get_user: function(callback){
			// Haal de gebruiker uit de database met het email adres.
			pool.query("SELECT id, email, password from user WHERE email=?",[email], 
				function(err, result){
					callback(err, result);
				});
		},
		authenticate: ['get_user', function(results, callback){
			// Wanneer get_user klaar is, kijk of er een gebruiker is opgehaald
			if(!results.get_user.length){
				// Stuur unauthorized terug als error als er geen gebruiker wordt opgehaald.
				callback('unauthorized');
			} else {
				// Als er een gebruiker is opgehaald match dan het opgestuurde wachtwoord
				// met het versleutelde wachtwoord uit de database.
				var user = results.get_user[0];
				bcrypt.compare(password, user.password, function(err, res) {
					if(res) {
						callback(null, {user:user}); // Als ze matchen stuur dan de gebruiker door zonder error.
					} else {
						callback('unauthorized'); // Als ze niet matchen stuur stuur unauthorized terug als error.
					} 
				});
			}
		}]
	}, function(err, results){
		/* Als er een error is stuur die dan door naar de client.
		Als er geen error is sla de gebruiker op in de sessie
		en stuur de gebruiker terug naar de client. */
		if(err && err == 'unauthorized'){
			res.status(403).json({error:err});
		} else if(err){
			console.log(err);
			res.status(500).json({error:'server_error'});
		} else {
			var user = results.authenticate.user;
			session.user_id = user.id;
			res.json({
				id: user.id,
				email:user.email
			});
		}
	});
});

// Route om een nieuwe gebruiker in de database te zetten
// POST: /api/users/
router.post('/', function(req, res, next){
	/*
		Er wordt gekeken of de client is ingelogt
		Als dit niet zo is wordt er een 403 (unauthorized) code teruggestuurd.
		Als de client is ingelogt wordt het opgestuurde wachtwoord versleuteld.
		Wanneer er geen error optreed wordt het opgestuurde email adres en versleutelde wachtwoord
		opgeslagen in de database in de gebruikers tabel en wordt er een successmelding teruggestuurd. 
		Als er een error optreed wordt er een 500 (server error) code teruggestuurd 
		om aan te geven dat er iets mis is met de server.
	*/

	var sess_user_id = req.session.user_id;
	if(!sess_user_id){
		res.status(403).send("unauthorized");
		return
	}

	// Ik gebruik async.auto zodat ik geen diepe callbacks heb.
	// Hier kunnen ook promises voor gebruikt worden maar ik vind dit leesbaarder.
	// https://github.com/caolan/async - Async Docs
	async.auto({
		hashPassword: function(callback){

			// Versleutel het wachtwoord van de nieuwe gebruiker
			var password = req.body.password;
			bcrypt.hash(password, 10, function(err, hash) {
				callback(err, hash);  
			});
		},
		saveUser: ['hashPassword', function(results, callback){
			var password = results.hashPassword;
			var values = [[req.body.email, password]];

			// Sla de email en het versleutelde wachtwoord op in de database
			pool.query("INSERT INTO user (email, password) VALUES ?", [values], function(err, result){
				callback(err);
			});
		}]
	}, function(err, results){
		if(err){
			console.log(err);
			res.status(500).json({error:'server_error'});
		} else {
			res.json({success:true});
		}		
	});
});

// Route om gebruikers op te halen uit de database
// GET: /api/users/
router.get('/', function(req, res, next) {
	/*
		Er wordt gekeken of de client is ingelogt
		Als dit niet zo is wordt er een 403 (unauthorized) code teruggestuurd.
		Als de client is ingelogt worden de gebruikers opgehaald uit de database.
		Als er geen error optreed worden de gebruikers teruggestuurd naar de client.
		Als er een error optreed wordt er een 500 (server error) code teruggestuurd 
		om aan te geven dat er iets mis is met de server.	
	*/


	var user_id = req.session.user_id;
	if(!user_id){
		res.status(403).json({msg:"unauthorized"});
		return
	} 

	// Haal de gebruikers op uit de database
	pool.query("SELECT id, email FROM user", function(err, result){	
		if(err){
			console.log(err);
			res.status(500).send("database_error");
		} else {
			res.json(result);
		}
	});
	
});

// Route om een gebruiker in de database aan te passen
// PUT: /api/users/:id
router.put('/:id', function(req, res, next){
	/*
		Er wordt gekeken of de client is ingelogt
		Als dit niet zo is wordt er een 403 (unauthorized) code teruggestuurd.
		Als de client is ingelogt wordt er gekeken of er een wachtwoord is meegestuurd.
		Als er een wachtwoord is meegestuurd wordt deze versleuteld en wordt de query naar de database
		aangepast om ook het wachtwoord te wijzigen. Als er geen wachtwoord is meegestuurd wordt 
		het wacthwoord ook niet aangepast in de database. Daarna worden het email adres en 
		eventueel het versleutelde wachtwoord opgeslagen in de database 
		waar user.id het id uit de route is. Als er geen error optreed wordt er een successmelding teruggestuurd
		Als er een error optreed wordt er een 500 (server error) code teruggestuurd 
		om aan te geven dat er iets mis is met de server.	
	*/


	var sess_user_id = req.session.user_id;
	
	if(!sess_user_id){
		res.status(403).send("unauthorized");
		return
	}

	async.auto({
		checkPassword: function(callback){
			var password = req.body.password;
			if(password){
				bcrypt.hash(password, 10, function(err, hash) {
					callback(null, hash);  
				});
			} else {
				callback();
			}
		},
		makeQuery: ['checkPassword', function(results, callback){
			params_list = [req.body.email];
			var password = results.checkPassword;
			var sql = "UPDATE user SET email=?";
			
			// Als er een wachtwoord is meegestuurd, pas dan de query aan om ook het wachtwoord op te slaan
			if(password){
				sql+=", password=?";
				params_list.push(password);
			}

			sql+=" WHERE id=?";
			params_list.push(req.params.id);
			callback(null, {sql:sql, params_list:params_list});
		}],
		saveUser: ['makeQuery', function(results, callback){
			var sql = results.makeQuery.sql;
			var params_list = results.makeQuery.params_list;

			pool.query(sql,params_list, function(err, result){
				callback(err, results);
			});
		}]
	}, function(err, results){
		if(err){
			console.log(err);
			res.status(500).json({error:'server_error'});
		} else {
			res.json({success:true});
		}
	});
});

// Route om een gebruiker in de database aan te passen
// PUT: /api/users/:id
router.delete('/:id', function(req, res, next){
	/*
		Er wordt gekeken of de client is ingelogt
		Als dit niet zo is wordt er een 403 (unauthorized) code teruggestuurd.
		Als de client is ingelogt wordt er een gebruiker uit de database verwijderd
		waar het id van de gebruiker het id uit de route is.
		Als er geen error optreed wordt er een succesmelding teruggesetuurd.
		Als er een error optreed wordt er een 500 (server error) code teruggestuurd 
		om aan te geven dat er iets mis is met de server.	
	*/

	var sess_user_id = req.session.user_id;
	
	if(!sess_user_id){
		res.status(403).send("unauthorized");
		return
	}

	pool.query("DELETE FROM user WHERE id=?",[req.params.id], function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("database_error");
		} else {
			res.json(result);
		}
	});
});

module.exports = router;
