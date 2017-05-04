/**Modelo de Usuario*/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;// Creando object Schema
var UserSchema= new Schema({
  mail: String,
  pass: String,
  first_name: String,
  last_name: String,
  cargo: String,
});

mongoose.model('User', UserSchema);


