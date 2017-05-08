var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

module.exports = function(app) {
  app.use('/', router);
};

//SignUpInPanel --Panel del SignUp-In
router.get('/home/portales', function(req, res, next){
  res.render('everyBody/signUpInPanel');
});

//Login --Iniciar Seción
router.get('/home/login', function(req, res, next) {
  res.render('everyBody/login', {message: req.flash('info', 'WhatEver')});
});

//SingUp --Registrarse
router.get('/home/signup', function(req, res, next) {
  res.render('everyBody/signup', {message: req.flash('info', 'WhatEver')});
});

//Profile --Perfil del usuario de la seción
router.get('/home/profile',isLoggedIn, function(req,res,next){
  res.render('everyBody/profile', {message: req.flash('info', 'WhatEver')},{
    user: req.User}); // Obtiene el usuario de la seción
});

//LogOut --Cerrar seción
router.get('/home/logout', function(req, res, next){
  req.logout();
  res.redirect('/home');
});

//Ver si el usuario está loggeado
function isLoggedIn(res, req, next){
  //Si está autenticado inicia seción
  if(req.isAuthenticated())
    return next();
  
  //Sino
  res.redirect('/home');
}