var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next){
	res.send('create user route');
});

router.get('/', function(req, res, next) {
  res.send('get user route');
});

router.put('/:id', function(req, res, next){
	res.send('editing user with id: '+req.params.id);
});

router.delete('/:id', function(req, res, next){
	res.send('removing user with id: '+req.params.id)
});

module.exports = router;
