var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
// Modelo de la base de datos
var Cat = mongoose.model('Cat');


module.exports = function(app) {
    app.use('/', router);
};

// Ver todos los gatos
router.get('/gatos', function(req, res, next) {
    Cat.find({}, function(err, cats) {
        if (err) return next(err);

        res.render('cats_index', {
            title: 'Ver todos los gatos - felinorte',
            cats: cats
        });
    });
});

// Ver información de gato
// TODO - errores
// @TODO Buscar por id
router.get('/gato/:id', function(req, res, next) {
    Cat.find({}, function(err, cat) {
        if (err) return next(err);

        res.render('cats_detail', {
            title: 'Ver gato - felinorte',
            cat: cat
        });
    });
});

// Añadir nuevo gato
// TODO: Implementar
router.get('/admin/gatos/new', function(req, res, next) {
    res.end();
});

// Editar gato
// TODO: Implementar
router.get('/admin/gatos/:id/edit', function(req, res, next) {
    res.end();
});

// POST Editar gato
// TODO: Implementar
router.post('/admin/gatos/:id/edit', function(req, res, next) {
    res.end();
});

// POST Eliminar gato
// TODO: Implementar
router.delete('/admin/gatos/:id/delete', function(req, res, next) {
    res.end();
});