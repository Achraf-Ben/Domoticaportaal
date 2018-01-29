var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var async = require('async');
var config = require('../config');

router.get('/', function(req, res, next) {
	var user_id = req.session.user_id;
	console.log(user_id);
	if(!user_id){
		res.status(403).json({msg:"unauthorized"});
		return
	} 

	conn = mysql.createConnection(config.databaseSettings);
	conn.connect(function(err){
		if(err){
			console.log(err);
			res.status(500).send("database_error");
		}

		conn.query("SELECT * FROM module", function(err, result){
			if(err){
				console.log(err);
				res.status(500).send("database_error");
			}
			res.json(result);
		});
	});
	
});

module.exports = router;
