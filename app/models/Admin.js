/* 
  Modelo del usuario administrador 
*/

var mongoose = require('mongoose');

var AdminSchema = new mongoose.Schema({
  id: String,
  token: String,
  mail: {
    type: String,
    trim: true
  },
  name: {
    nombre: String,
    apellido: String
  },
  lastAcces: {
    type: Date,
    default: Date.now
  },
  adminType: {
    type: Boolean,
    default: false
  }
});

mongoose.model('Admin', AdminSchema);