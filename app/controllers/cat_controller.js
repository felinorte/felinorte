var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');

/* Modelo de la base de datos */
var Cat = mongoose.model('Cat');

module.exports = function(app) {
  app.use('/', router);
};

/* Ver todos los gatos */
router.get('/gatos', function(req, res) {
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
    // Si sucede algún error
    if (err) {
      req.flash('error', '¡No se ha podido agregar el gato!'); // Enviar un mensaje de error
      res.redirect('/admin/gatos/nuevo')
      return console.log(err); // Escribir en consola el error
    }

    req.flash('info', 'Gato agregado exitosamente...');
    res.redirect('/admin/gatos/nuevo');
  });
});