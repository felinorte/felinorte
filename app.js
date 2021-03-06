var express = require('express');
var config = require('./config/config');
var glob = require('glob');
var mongoose = require('mongoose');
var formidable = require('express-form-data');
/* Conexión a la base de datos */
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function() {
  throw new Error('unable to connect to database at ' + config.db);
});

/* Obtener todos los modelos. */
var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function(model) {
  require(model);
});

/* Iniciar Express */
var app = express();

/* Configuraciones */
module.exports = require('./config/express')(app, config);
app.use(formidable.parse({keepExtensions: true}));
var port = process.env.PORT || config.port;

/* Servidor */
app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});
