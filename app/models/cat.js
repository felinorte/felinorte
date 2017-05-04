/** Modelo de Gato */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CatSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  fecha_nacimiento: {
    type: Date,
    default: Date.now()
  },
  peso: Number,
  raza: String,
  color: String,
  sexo: String
});

CatSchema.virtual('date')
  .get(function() {
    return this._id.getTimestamp();
  });

mongoose.model('Cat', CatSchema);