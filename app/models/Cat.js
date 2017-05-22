/* Modelo de Gato */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Colony = require('./Colony');

var CatSchema = new Schema({
  foto: String,
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  colony: {
    type: Schema.ObjectId,
    ref: "Colony"
  },
  fecha_nacimiento: {
    type: Date,
    default: Date.now
  },
  edad: String,
  colores_patrones: String,
  sterilization: String,
  vacc: String,
  desp: Boolean,
  adopted: Boolean,
  adoptable: String,
  socializacion: String,
  felinealities: String,
  sexo: String,
  observaciones: {
    type: String,
    default: "No comments."
  }
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
