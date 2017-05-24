var express = require('express'),
    mongoose = require('mongoose');

/* Modelo de la base de datos */
var Cat = mongoose.model('Cat');
var Colony = mongoose.model('Colony');
var ruta = "./uploads/img/";

module.exports = function(app) {

    /* GET Ver todos los gatos */
    app.get('/gatos', function(req, res) {
        Cat.find({}, function(err, cats) {
            if (err) return next(err);

            res.render('cats_index', {
                title: 'Ver todos los gatos - felinorte',
                cats: cats,
                rutas: ruta
            });
        });
    });

    /* GET Ver gato */
    app.get('/gatos/:id', function(req, res) {
        Cat.count({
            _id: req.params.id
        }, function(err, cat) {
            if (err) res.redirect('/gatos');

            Cat.findOne({
                _id: req.params.id
            }).populate('colony').exec(function(err, cat) {
                if (err) res.redirect('/gatos');
                
                console.log(cat);
                if (typeof cat != 'undefined') {
                    res.render('gato', {
                        title: cat.nombre + ' - felinorte',
                        cat: cat
                    });
                } else {
                    res.redirect('/gatos');
                }
            })
        });
    });
};