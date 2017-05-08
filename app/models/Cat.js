/* Modelo de Gato */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Colony = require('./Colony');

var CatSchema = new Schema({
  fecha_nacimiento: {
    type: Date,
    required: true
  },
  colony: String, // Nombre de la colonia
  colony_id: { // ID de la colonia
    type: Schema.ObjectId,
    ref: 'Colony'
  },
  sexo: String,
  raza: String,
  peso: Number
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