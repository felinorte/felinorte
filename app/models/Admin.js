/* 
  Modelo del usuario administrador 
*/

var mongoose = require('mongoose');

var AdminSchema = new mongoose.Schema({
  mail: {
    type: String,
    trim: true
  },
  pass: String,
  name: {
    nombres: String,
    apellidos: String
  },
  empleo: String,
  age: {
    type: Number,
    trim: true,
    min: 0
  },
  lastAcces: {
    type: Date,
    default: Date.now
  },
});

mongoose.model('Admin', AdminSchema);