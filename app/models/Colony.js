/*
  Modelo de Colonia 
*/

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ColonySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  cats: [{
    type: Schema.ObjectId,
    ref: 'Cat'
  }]
},  { autoIndex: false });

ColonySchema.virtual('date')
  .get(function() {
    return this._id.getTimestamp();
  });

ColonySchema.index({ name: 1, type: -1 }); // schema level

mongoose.model('Colony', ColonySchema);