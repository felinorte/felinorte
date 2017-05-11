var mongoose = require('mongoose');

/* Estrategias */
var LocalStrategy = require('passport-local').Strategy;

/* Modelos */
var User = mongoose.model('User');
var Admin = mongoose.model('Admin')

module.exports = function(passport) {

    // "Serializar" el usuario para la sesión
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // "Des-serializar" el usuario
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // "Serializar" admin
    passport.serializeAdmin(function(admin, done){
        done(null, admin.id);
    });

    // "Des-serializar" el admin
    passport.deserializeAdmin(function(id, done){
        Admin.findById(id, function(err, admin){
            done(err, admin);
        });
    });

    /* REGISTRO LOCAL */
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {

        process.nextTick(function() {

            // buscamos un usuario con el mismo correo
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // si hay algún error, escribirlo y retornarlo
                if (err) {
                    console.log(err);
                    return done(err);
                }

                // revisar si existe un usuario con ese correo
                if (user) {
                    return done(null, false, req.flash('error', 'Ya existe una cuenta con el mismo correo.'));
                } else {

                    // si no existe, crear un nuevo usuario
                    var newUser = new User();

                    // asignar las credenciales locales al usuario
                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password);

                    // guardar el usuario
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }

            });

        });

    }));


    /* LOGIN LOCAL */
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err) return done(err);

            // si no existe el usuario
            if (!user)
                return done(null, false, req.flash('error', 'No existe usuario.'));

            // si el usuario existe, pero la contraseña es incorrecta
            if (!user.validPassword(password))
                return done(null, false, req.flash('error', '¡Contraseña incorrecta!'));

            // si todo sale bien, retornal el usuario
            return done(null, user);
        });

    }));

};

