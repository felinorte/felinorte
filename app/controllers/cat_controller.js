var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* Modelo de la base de datos */
var Cat = mongoose.model('Cat');

module.exports = function(app) {
    app.use('/', router);
};

/* Ver todos los gatos */
router.get('/gatos', function(req, res, next) {
    Cat.find({}, function(err, cats) {
        if (err) return next(err);

        res.render('cats_index', {
            title: 'Ver todos los gatos - felinorte',
            cats: cats
        });
    });
});


// POST Crear gato
// TODO: Implementar
router.post('/admin/gatos/new', function(req, res) {
    Cat.create({ nombre: req.body.name }, function(err) {
        if (err) return console.log(err);
        
        console.log('Gato correctamente creado: ');
        console.log('Nombre: ' + req.body.name);
        
        res.redirect('/admin/gatos');
    });
});