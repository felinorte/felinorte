var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
<<<<<<< HEAD
var passport = require('passport');
=======
>>>>>>> 873f93ddcbe855f04afb69f952bc29637181210f

/* Modelo del usuario */
var UserSchema = new mongoose.Schema({
  local:{
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
      min: 18,
    },
    fechaNacimiento: Date
  },  
  
  google: {
    id: String,
    token: String,
    name: String,
    email: String   
  },
  
  facebook: {
    id: String,
    token: String,
    name: String,
    email: String    
  } 
<<<<<<< HEAD
  
});


=======
});

>>>>>>> 873f93ddcbe855f04afb69f952bc29637181210f
/* Generar el hash de la contraseña */
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/* Validar si la contraseña es válida */
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

mongoose.model('User', UserSchema);