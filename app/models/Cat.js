/* Modelo de Gato */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CatSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  fecha_nacimiento: {
    type: Date,
    required: true
  },
  colony_id: {
    
  },
  sexo: String,
  raza: String,
  peso: Number
});

mongoose.model('Cat', CatSchema);
