/**
 * @description Controlador - Colonias
 * @author Wilson Tovar
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* Modelo de la base de datos */
var Cat = mongoose.model('Cat');

module.exports = function(app) {
    app.use('/', router);
};

router.get('/colonias', function(req, res){
  console.log('Ruta no implementada');
  res.end();
});