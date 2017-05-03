var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Cat = mongoose.model('Cat');


module.exports = function(app) {
    app.use('/', router);
};

router.get('/', function(req, res, next) {
    res.render('index', {
        title: '¡Bienvenido! - felinorte'
    });
});

router.get('/contacto', function(req, res, next) {
    res.render('contact', {
        title: '¡Contáctanos! - felinorte'
    })
});

router.get('/gatos', function(req, res, next) {

});