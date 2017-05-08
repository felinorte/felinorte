var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');

/* Modelo de la base de datos */
var Cat = mongoose.model('Cat');

module.exports = function(app) {
  app.use('/', router);
};

/* GET Ver todos los gatos */
router.get('/gatos', function(req, res) {
  Cat.find({}, function(err, cats) {
    if (err) return next(err);

    res.render('cats_index', {
      title: 'Ver todos los gatos - felinorte',
      cats: cats
    });
  });
});

/* POST Adoptar gato */
router.post('/adoptar/:id', function(req, res){
  
});