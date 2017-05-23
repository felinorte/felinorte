var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Cat = require('./Cat');
var User = require('./User');
var Comment = require('./Comment');

var AdopcionSchema = new Schema({
    usuario: {
        type: Schema.ObjectId,
        ref: "User",
    },
    gato: {
        type: Schema.ObjectId,
        ref: "Cat"
    },
    // Información
    fecha_inicio: {
        type: Date,
        Default: Date.now
    },
    en_proceso: {
        type: Boolean,
        default: true
    },
    aprobado: {
        type: Boolean,
        default: false
    },
    comentarios: [{
        type: Schema.ObjectId,
        ref: 'Comment'
    }]
});

mongoose.model('Adopcion', AdopcionSchema);