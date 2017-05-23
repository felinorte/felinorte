var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CommentSchema = new Schema({
  admin: {
    type: Schema.ObjectId,
    ref: "User"
  },
  contenido: String,
  fecha_creacion: Date
});

mongoose.model('Comment', CommentSchema);