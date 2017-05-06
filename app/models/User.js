var mongoose = require('mongoose');
var util = require('util');

/* Modelo base */
function baseEntitySchema() {

  mongoose.Schema.apply(this, arguments);

  this.add({
    mail: {
      type: String,
      trim: true
    },
    pass: String,
    name: {
      nombres: String,
      apellidos: String,
    },
    empleo: String,
    age: {
      type: Number,
      trim: true,
      min: 0
    },
  });
}

util.inherits(baseEntitySchema, mongoose.Schema);

/* Modelo del usuario */
var UserSchema = baseEntitySchema();
/* Modelo del administrador */
var AdminSchema = baseEntitySchema();
AdminSchema.add({
  lastAcces: Date,
  solicitudesPendientes: int,
});


mongoose.model('User', UserSchema);
mongoose.model('Admin', AdminSchema);