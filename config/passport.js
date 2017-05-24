// Tutorial con Local: https://scotch.io/tutorials/easy-node-authentication-setup-and-local
// Tutorial con Google: https://scotch.io/tutorials/easy-node-authentication-google

/* Estrategias */
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

/* Modelos */
var User = mongoose.model('User');

var configAuth = require('./auth');

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
            return done(null, false, req.flash('error', '¡Oops! Este correo electrónico ya está registrado.'));
          } else {
            //Si no hay usuario con ese email
            var newUser = new User();
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);
            newUser.local.name.nombre = req.body.firstname;
            newUser.local.name.apellidos = req.body.lastname;
            newUser.local.userType = "user";
            
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
          return done(null, false, req.flash('error', 'Este usuario no existe.'));

        if (!user.validPassword(password))
          return done(null, false, req.flash('error', '¡Oops! La contraseña que escribiste es incorrecta.'));

        return done(null, user);
      });

    }));
    
    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
    }, 
    function(token, refreshToken, profile, done){
        //El proceso no iniciará hasta que se obtengan datos de regreso de google
        process.nextTick(function(){
            User.findOne({'google.id': profile.id}, function(err, user){
                if(err)
                    return done(err);
                
                if(user){
                    //inicia Sesión si un usuario es encontrado;
                    return done(null, user);
                }else{
                    //Crea el usuario si no lo encontró
                    var newUser = new User();
                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.name = profile.displayName;
                    newUser.local.name.nombre = profile.displayName;
                    newUser.google.email = profile.emails[0].value; //Extrae el primer email
                    newUser.local.userType = "user";
                    newUser.save(function(err){
                        if(err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
};
