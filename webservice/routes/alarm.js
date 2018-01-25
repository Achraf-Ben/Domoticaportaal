var express = require('express');
var router = require('router');

router.put('/api/alarm/:id', function(req,res,next){
	res.send('turning of alarm with id: '+req.params.id)
});