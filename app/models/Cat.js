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

/* Método para buscar la colonia a la que pertenece el gato */
CatSchema.methods.findColony = function (){
  return Colony.findOne({ name: this.colony }, function(err, colonies){
    if (err) {
      console.log(err);
      return err;
    }
    
    console.log(colonies);
    return colonies;
  });
};

mongoose.model('Cat', CatSchema);