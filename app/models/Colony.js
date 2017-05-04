/** Modelo de Colonia */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ColonySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  }
});

ColonySchema.virtual('date')
  .get(function() {
    return this._id.getTimestamp();
  });

mongoose.model('Colony', ColonySchema);