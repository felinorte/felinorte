var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');

var passport = require('passport'); // Sistema de usuarios
var session = require('express-session');
var flash = require('express-flash'); // Mensajes de información / error

module.exports = function(app, config) {

  

  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  var path = require('path');

  app.set('views', path.join(process.cwd() + '/views'));
  app.use(express.static(path.join(process.cwd() + '/public')));
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'pug');

  require('../config/passport')(passport); // pass passport for configuration
  
  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(cookieParser());
  app.use(compress());
  // app.use(express.static(config.root + '/public'));
  app.use(methodOverride());
  
  app.use(session({
    secret: '7eb60f0a6acc337a7e3423b05adcba3528cd7462',
    resave: false,
    saveUninitialized: true,
  })); // session secret
  // required for passport
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  /* Controladores (Rutas) */
  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function(controller) {
    require(controller)(app, passport);
  });

  app.use(function(req, res, next) {
    var err = new Error('Not Found' + req.user);
    err.status = 404;
    next(err);
  });

  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
      title: 'error'
    });
  });

  return app;
};