var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');

var UserSchema = new mongoose.Schema({
    local: {
        email: {
            type: String,
            trim: true
        },
        password: String, // Contraseña, si se registró localmente en la página
        name: {
            nombre: String,
            apellidos: String
        },
        empleo: String,
        age: {
            type: Number,
            trim: true
        },
        fechaNacimiento: Date,
        ocupacion: {
          type: String,
          default: ''
        },
        userType: {
            type: String,
            enum: ['admin', 'user']
        }
    },

    google: {
        id: String,
        token: String,
        name: String,
        email: String
    },
});

/* Generar el hash de la contraseña */
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/* Validar si la contraseña es válida */
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

mongoose.model('User', UserSchema);