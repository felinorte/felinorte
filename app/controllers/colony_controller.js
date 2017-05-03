/**
 * @description Controlador - Colonias
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* Modelo de la base de datos */
var Cat = mongoose.model('Cat');

module.exports = function(app) {
    app.use('/', router);
};

/* ADMIN - Ver todas las colonias */
// TODO: Implementar
router.get('/admin/colonies', function(req, res, next) {
    console.log('Método sin implementar...');
    res.end();
});


/* ADMIN POST Crear colonia */
// TODO: Implementar
router.post('/admin/colonies/new', function(req, res) {
    console.log('Método sin implementar...');
    res.end();
});