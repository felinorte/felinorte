/**Modelo de Usuario*/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;// Creando object Schema
var UserSchema= new Schema({
  mail: String,
  pass: string,
  first_name: String,
  last_name: String,
});

mongoose.model('User', UserSchema);


