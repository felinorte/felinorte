var express = require('express');
var router = express.Router();

module.exports = function(app) {
  app.use('/', router);
};

/* GET Login del panel de administración */
// TODO: Verificar que el admin no esté logueado
router.get('/admin/login', function(req, res, next) {
  res.render('admin/login', {
    title: 'Entrar - Panel de administración'
  });
});

/* GET Dashboard de administración */
router.get('/admin', function(req, res, next) {
  res.render('admin/index', {
    title: 'Panel de administración - felinorte'
  });
});

/* GET Ver todos los gatos */
router.get('/admin/gatos', function(req, res, next) {
  res.render('admin/gatos', {
    title: 'Administrar gatos - felinorte'
  });
});

/* GET Crear nuevo gato */
router.get('/admin/gatos/nuevo', function(req, res, next){
  res.render('admin/gato', {
    title: 'Agregar nuevo gato - felinorte'
  });
});

/* POST Login admin */
router.post('/admin/login', function(req, res, next){
});