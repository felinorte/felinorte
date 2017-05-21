/*
  Controlador de la página "genéricas" de la plataforma.
*/

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* Colección de gatos */
var Cat = mongoose.model('Cat');

module.exports = function(app) {
    app.use('/', router);
};

/* GET Preloader de la página */
router.get('/', function(req, res, next) {
    res.render('preload', {
        title: 'Cargando... - felinorte'
    });
});

/* GET Página de inicio */
router.get('/home', function(req, res){
  res.render('index');
});
router.get('/sobregatos', function(req, res){
  res.render('sobregatos');
});
router.get('/nosotros', function(req, res){
  res.render('sobrenosotros');
});
/* GET Página de contacto */
router.get('/contacto', function(req, res, next) {
    res.render('contact', {
        title: '¡Contáctanos! - felinorte'
    });
});

/* Redirecciones */
router.get('/entrar', function(req, res){ res.redirect('/login'); });
router.get('/registro', function(req, res){ res.redirect('/signup'); });
router.get('/perfil', function(req, res){ res.redirect('/profile'); });
router.get('/salir', function(req, res){ res.redirect('/logout'); });
router.get('/uploads', function(req, res){ res.redirect('/') });
router.get('/uploads/img', function(req, res){ res.redirect('/') });

router.get('/favicon.ico', function(req, res){
  res.end();
});