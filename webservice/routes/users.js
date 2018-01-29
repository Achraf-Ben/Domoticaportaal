var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var async = require('async');
var config = require('../config');

router.post('/login', function(req, res, next){
	var conn = mysql.createConnection(config.databaseSettings)
	var email = req.body.email;
	var password = req.body.password;
	var session = req.session;

	console.log(req.body);

	conn.connect(function(err){
		if(err){
			console.log(err);
			res.status(500).json({error:'server_error'});
			return
		}

		async.auto({
			get_user: function(callback){
				conn.query("SELECT id, email, password from user WHERE email=?",[email], 
					function(err, result){
						callback(err, result);
					});
			},
			authenticate: ['get_user', function(results, callback){
				if(!results.get_user.length){
					console.log('no user');
					callback('unauthorized');
				} else {
					var user = results.get_user[0];
					bcrypt.compare(password, user.password, function(err, res) {
						if(res) {
							callback(null, {user:user})
						} else {
							callback('unauthorized');
						} 
					});
				}
			}]
		}, function(err, results){
			conn.end();
			if(err && err == 'unauthorized'){
				res.status(403).json({error:err});
			} else if(err){
				console.log(err);
				res.status(500).json({error:'server_error'});
			} else {
				var user = results.authenticate.user
				session.user_id = user.id;
				res.json({
					id: user.id,
					email:user.email
				})
			}
		});
	});	
});

router.post('/', function(req, res, next){
	var sess_user_id = req.session.user_id;
	
	if(!sess_user_id){
		res.status(403).send("unauthorized");
		return
	}

	async.auto({
		hashPassword: function(callback){
			var password = req.body.password;
			bcrypt.hash(password, 10, function(err, hash) {
				callback(null, password);  
			});
		},
	}, function(err, results){
		var password = results.hashPassword;

		var conn = mysql.createConnection(config.databaseSettings);
		var values = [[email, password]];
		conn.connect(function(err){
			conn.query("INSERT INTO user (email, password) VALUES ?", [values], function(err, result){
				conn.end();
				res.json({success:true});
			});
		});
	});
});

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

		conn.query("SELECT id, email FROM user", function(err, result){
			conn.end();
			if(err){
				console.log(err);
				res.status(500).send("database_error");
			}

			res.json(result);
		});
	});
	
});

router.put('/:id', function(req, res, next){
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
					callback(null, password);  
				});
			} else {
				callback();
			}
		},
		makeQuery: ['checkPassword', function(results, callback){
			params_list = [req.body.email];
			var password = results.checkPassword;
			var sql = "UPDATE user SET email=? ";
			
			if(password){
				sql+="SET password=? ";
				params_list.push(password);
			}

			sql+="WHERE id=?";
			params_list.push(req.params.id;)
			callback(null, {sql:sql, params_list:params_list});
		}]
	}, function(err, results){
		var sql = results.sql;
		var params_list = results.params_list;

		var conn = mysql.createConnection(config.databaseSettings);
		conn.connect(function(err){
			conn.query(sql,params_list, function(err, result){
				conn.end();
				res.json({success:true});
			});
		});
	});
});

router.delete('/:id', function(req, res, next){
	res.send('removing user with id: '+req.params.id)
});

module.exports = router;
