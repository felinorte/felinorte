var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Cat = mongoose.model('Cat');

module.exports = function(app) {
    app.use('/', router);
};

router.get('/', function(req, res, next) {
    res.render('preload', {
        title: 'Cargando... - felinorte'
    });
});

router.get('/home', function(req, res){
  res.render('index', {
    title: '¡Bienvenido! - felinorte'
  });
});

// Página de contacto
router.get('/contacto', function(req, res, next) {
    res.render('contact', {
        title: '¡Contáctanos! - felinorte'
    });
});