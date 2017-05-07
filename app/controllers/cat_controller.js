var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose');

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
router.post('/gato/new', function(req, res) {
  Cat.create({
    colony_id: req.body.colonia,
    fecha_nacimiento: req.body.fecha_nacimiento
  }, function(err) {
    if (err) return console.log(err);
  });
});