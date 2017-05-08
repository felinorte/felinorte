var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

/* Modelo del usuario */
var UserSchema = new mongoose.Schema({
  provider: String, // Facebook, Google o local
  id: String, // ID, si se registró con Facebook o Google
  token: String, // Token, si se registró con Facebook o Google
  mail: {
    type: String,
    trim: true
  },
  pass: String, // Contraseña, si se registró localmente en la página
  name: {
    nombre: String,
    apellidos: String
  },
  empleo: String,
  age: {
    type: Number,
    trim: true,
    min: 10
  },
  fechaNacimiento: Date
});

/* Generar el hash de la contraseña */
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/* Validar si la contraseña es válida */
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

mongoose.model('User', UserSchema);