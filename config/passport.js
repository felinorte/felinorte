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

<<<<<<< HEAD
  // Requerido para hacer persistenctes las sesiones
=======
  //Requerido para hacer persistenctes las sesiones
>>>>>>> 873f93ddcbe855f04afb69f952bc29637181210f
  passport.serializeUser(function(user, done) {
      done(null, user.id);
    }),

<<<<<<< HEAD
    passport.deserializeUser(function(id, done) {
=======
  passport.deserializeUser(function(id, done) {
>>>>>>> 873f93ddcbe855f04afb69f952bc29637181210f
      User.findById(id, function(err, user) {
        done(err, user.id)
      });
    }),

    passport.use('local-signup', new LocalStrategy({ //Estrategia para el signup
        userNameField: 'email',
        passwordField: 'passwprd',
        passReqToCallback: true, //Permite pasar de regreso la solicitod de callBack
      },
      function(res, mail, password, done) {
        //Asincrono
        //findOne iniciará a menos que se encíen datos
        process.nextTick(function() {
          User.findOne({ //Revisa si hay un usuario con ese email          
            'local.email': email
          }, function(err, user) {
            if (err) {
              return done(err);
            }
<<<<<<< HEAD

=======
            
>>>>>>> 873f93ddcbe855f04afb69f952bc29637181210f
            if (user) {
              return done(null, false, req.flash('signupMessage', 'Ese email ya esá registrado.'));
            } else {
              //Si no hay usuario con ese email
              var newUser = new User();
              newUser.local.email = email;
              newUser.local.pass = newUser.generateHash(password);

              //Guarda el usuaio
              newUser.save(function(err) {
                if (err)
                  throw err;
                return done(null, newUser);
              });
            }
          });
        });
      })),
    passport.use('local-login', new LocalStrategy({ //Estrategia para el login
        userNameField: 'email',
        passwordField: 'passwprd',
        passReqToCallback: true, //Permite pasar de regreso la solicitod de callBack
      },
      function(req, mail, password, done) {
        User.findOne({
          'local.email': email
        }, function(err, user) {
<<<<<<< HEAD
          // Si hay error retorna el error
          if (err)
            return done(err);

          // Si no encuentra el usuario
=======
          //Si hay error retorna el error
          if (err)
            return done(err);

          //Si no encuentra el usuario
>>>>>>> 873f93ddcbe855f04afb69f952bc29637181210f
          if (!user) {
            return done(null, false, req.flash('loginMessage', 'Usuario no registrado.'));
          }

<<<<<<< HEAD
          // Si la contraseña está errada
=======
          //Si la contraseña está errada
>>>>>>> 873f93ddcbe855f04afb69f952bc29637181210f
          if (!user.validPassword(password)) {
            return done(null, false, req.flash('loginMessage', 'Email o contraseña invalidos.'));
          }

<<<<<<< HEAD
          // Si todo está bien
          return done(null, user);
        });
      }));
  
  return module.exports.passport;
=======
          //Si todo está bien
          return done(null, user);
        });
      }));
>>>>>>> 873f93ddcbe855f04afb69f952bc29637181210f
};