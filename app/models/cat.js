/** Modelo de Gato */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CatSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        default: Date.now()
    }
});

CatSchema.virtual('date')
    .get(function() {
        return this._id.getTimestamp();
    });

mongoose.model('Cat', CatSchema);