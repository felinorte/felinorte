var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

module.exports = function(app) {
  app.use('/', router);
};

/* GET */
router.get('/portales', function(req, res) {
  res.render('everyBody/signUpInPanel');
});

/* GET Iniciar sesión */
router.get('/login', function(req, res) {
  res.render('everyBody/login', {
    message: req.flash('info', 'WhatEver')
  });
});

/* GET Página de registro */
router.get('/signup', function(req, res) {
  res.render('everyBody/signup', {
    message: req.flash('info', 'WhatEver')
  });
});

/* GET Perfil de usuario de la sesión */
router.get('/profile', isLoggedIn, function(req, res) {
  res.render('everyBody/profile', {
    message: req.flash('info', 'WhatEver')
  }, {
    user: req.User
  }); // Obtiene el usuario de la seción
});

/* GET Cerrar sesión */
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/home');
});

/* Ver si hay un usuario logueado */
function isLoggedIn(res, req, next) {
  if (req.isAuthenticated())
    return next();

  // Si no lo está, redirigir a la página inicio de sesión
  res.redirect('/login');
}