/* Modelo de Gato */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Colony = require('./Colony');

var CatSchema = new Schema({
  foto: String,
  nombre: {
    type: String,
    required: true
  },
  fecha_nacimiento: {
    type: Date,
    required: true
  },
  colony: {
    type: Schema.ObjectId,
    ref: "Colony"
  },
  sexo: String,
  raza: String,
  peso: Number,
  tipo_personalidad: String,
  sociable: Boolean,
  observaciones: String
});

mongoose.model('Cat', CatSchema);