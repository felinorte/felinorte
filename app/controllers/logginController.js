var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var passport = require('passport');

module.exports = function(app) {
  app.use('/', router);
   
  //Ensambla la autenticación y el signUp
  app.post('/signup', passport.authenticate('local-signup',{
    succesRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));
  
  //Ensambla la autenticaión y el login
  app.post('/login', passport.authenticate('local-login',{
    succesRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));
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
router.get('/profile', function(req, res) {
  res.render('everyBody/profile', {
    message: req.flash('info', 'WhatEver')
  }, {
    user: req.User
  }); // Obtiene el usuario de la seción
});

/* GET Fin */
router.get('/fin', function(req, res) {
  res.render('everyBody/advice');
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