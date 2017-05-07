var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();


module.exports = function(app){
  app.use('/',router);  
};

router.get('/index/singup', function(res, req,next){
  res.render('/index/singup');
});