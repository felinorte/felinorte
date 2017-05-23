/*
  Modelo de Colonia 
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ColonySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    cats: [{
        type: Schema.ObjectId,
        ref: 'Cat'
    }]
});

ColonySchema.virtual('date')
    .get(function() {
        return this._id.getTimestamp();
    });

mongoose.model('Colony', ColonySchema);