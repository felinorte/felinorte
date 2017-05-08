// Tutorial con Local: https://scotch.io/tutorials/easy-node-authentication-setup-and-local
// Tutorial con Google: https://scotch.io/tutorials/easy-node-authentication-google

/* Configuraciones de passport */

var mongoose = require('mongoose'),
  passport = require('passport'),
  configAuth = require('./auth');

/* Estrategias */
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

/* Modelos */
var User = mongoose.model('User');
var Admin = mongoose.model('Admin');

module.exports = function(passport) {

};