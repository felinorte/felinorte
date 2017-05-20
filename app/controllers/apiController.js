var express = require('express'),
  mongoose = require('mongoose');

var Cat = mongoose.model('Cat');
var Colony = mongoose.model('Colony');
var User = mongoose.model('User');

module.exports = function(app) {
  app.get('/api/1/cats', function(req, res){
    Cat.find({}, function(err, cats){
      res.send(cats);
    });
  });
  
  app.get('/api/1/colonies', function(req, res){
    Colony.find({}, function(err, colonies){
      res.send(colonies);
    });
  });
  
  
  // Redirecciones
  app.get('/api/1/colonias', function(req, res){
    res.redirect('/api/1/colonies');
  });
  app.get('/api/1/gatos', function(req, res){
    res.redirect('/api/1/cats');
  });
}