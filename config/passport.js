// Tutorial con Local: https://scotch.io/tutorials/easy-node-authentication-setup-and-local
// Tutorial con Google: https://scotch.io/tutorials/easy-node-authentication-google

/* Configuraciones de passport */

var passport = require('passport');

/* Estrategias */
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

/* Modelos */
var User = mongoose.model('User', User);
var config = require('../config/config');

module.exports = function(passport) {

    // Crear sesión
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Eliminar sesión
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
            //findOne iniciará a menos que se encíen datos
            process.nextTick(function() {
                User.findOne({
                    'local.email': email
                }, function(err, user) {

                    if (err)
                        return done(err);

                    //Revisa si hay un usuario con ese email          
                    if (user)
                        return done(null, false, req.flash('signupMessage', 'El correo electrónico ya está en uso.'));

                    //Si no hay usuario con ese email
                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    //Guarda el usuaio
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        return done(null, newUser);
                    });
                });
            });
        }));

    /* LOCAL LOGIN */
    passport.use('local-login', new LocalStrategy({ // Estrategia para el login
            userNameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // Permite pasar de regreso la solicitod de callBack
        },
        function(req, email, password, done) {
            console.log("Bien");
            User.findOne({
                'local.email': email
            }, function(err, user) {
                // Si hay error retorna el error
                if (err)
                    return done(err);

                // Si no encuentra el usuario
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'Usuario no registrado.'));

                // Si la contraseña está errada
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Correo electrónico o contraseña inválidos.'));

                // Si todo está bien
                return done(null, user);
            });
        }));
};