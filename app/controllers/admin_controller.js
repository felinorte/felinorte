/*
  Controlador de todo lo relacionado con los administradores.
*/

var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

/* Obtener gatos */
var Cat = mongoose.model('Cat');

module.exports = function(app) {
  app.use('/', router);
};

/* GET Login del panel de administración */
router.get('/admin/login', function(req, res, next) {
  // req.flash('info', 'Mensaje de logueo');
  res.render('admin/login', {
    title: 'Entrar - Panel de administración'
  });
});

/* GET Dashboard de administración */
router.get('/admin', function(req, res) {
  Cat.find({}, function(err, cats) {
    if (err) return res.redirect('/admin');

    res.render('admin/index', {
      title: 'Panel de administración - felinorte',
      cats: cats
    });
  });
});

/* GET Ver todos los gatos */
router.get('/admin/gatos', function(req, res, next) {
  res.render('admin/gatos', {
    title: 'Administrar gatos - felinorte'
  });
});

/* GET Crear nuevo gato */
router.get('/admin/gatos/nuevo', function(req, res, next) {
  res.render('admin/gatonew', {
    title: 'Agregar nuevo gato - felinorte'
  });
});