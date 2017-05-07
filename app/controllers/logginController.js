var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

module.exports = function(app) {
  app.use('/', router);
};

router.get('/home/login', function(req, res, next) {
  res.render('everyBody/login', {message: req.flash('info', 'WhatEver')});
});

router.get('/home/singup', function(req, res, next) {
  res.render('everyBody/singup', {message: req.flash('info', 'WhatEver')});
});

router.get('/home/profile', function(req,res,next){
  res.render('everyBody/profile', {message: req.flash('info', 'WhatEver')});
});