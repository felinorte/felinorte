// Tutorial con Local: https://scotch.io/tutorials/easy-node-authentication-setup-and-local
// Tutorial con Google: https://scotch.io/tutorials/easy-node-authentication-google

/* Estrategias */
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;

/* Modelos */
var User = mongoose.model('User');

module.exports = function(passport) {

  //Requerido para hacer persistenctes las sesiones
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  /* REGISTRO LOCAL */
  passport.use('local-signup', new LocalStrategy({ //Estrategia para el signup
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true //Permite pasar de regreso la solicitod de callBack
    },
    function(req, email, password, done) {
      //Asincrono
      //findOne iniciará a menos quese encíen datos
      process.nextTick(function() {
        User.findOne({
          'local.email': email
        }, function(err, user) {
          if (err) {
            console.log(err);
            return done(err);
          }

          //Revisa si hay un usuario con ese email          
          if (user) {
            return done(null, false, req.flash('error', 'Ese email ya esá registrado.'));
          } else {
            //Si no hay usuario con ese email
            var newUser = new User();
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);

            //Guarda el usuaio
            newUser.save(function(err) {
              if (err) {
                throw err;
              }
              return done(null, newUser);
            });
          }
        });
      });
    }));

  /* LOCAL LOGIN */
  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done) {

      User.findOne({
        'local.email': email
      }, function(err, user) {
        if (err)
          return done(err);

        if (!user)
          return done(null, false, req.flash('error', 'No user found.'));

        if (!user.validPassword(password))
          return done(null, false, req.flash('error', 'Oops! Wrong password.'));

        return done(null, user);
      });

    }));
};