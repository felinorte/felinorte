var mongoose = require('mongoose');

/* Modelo del usuario */
var UserSchema = new mongoose.Schema({
  id: String,
  token :String,
  mail: {
    type: String,
    trim: true
  },
  pass: String,
  name: {
    nombre: String,
    apellidos: String
  },
  empleo: String,
  age: {
    type: Number,
    trim: true,
    min: 0
  }
});

mongoose.model('User', UserSchema);