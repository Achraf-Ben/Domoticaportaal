var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var async = require('async');
var config = require('../config');
var pool  = mysql.createPool(config.databaseSettings);

router.get('/', function(req, res, next) {
	var user_id = req.session.user_id;
	console.log(user_id);
	if(!user_id){
		res.status(403).json({msg:"unauthorized"});
		return
	} 


		pool.query("SELECT * FROM module", function(err, result){
			if(err){
				console.log(err);
				res.status(500).send("database_error");
			}
			
			res.json(result);
		});
	
});

module.exports = router;
