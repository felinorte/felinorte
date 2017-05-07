/* Modelo de Gato */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CatSchema = new Schema({
  fecha_nacimiento: {
    type: Date,
    required: true
  },
  colony_id: String,
  sexo: String,
  raza: String,
  peso: Number
});

mongoose.model('Cat', CatSchema);