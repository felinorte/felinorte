var express = require('express');
var router = express.Router();

module.exports = function(app) {
    app.use('/', router);
};

/* GET Login del panel de administración */
// TODO: Verificar que el admin no esté logueado
router.get('/admin/login', function(req, res, next) {
  res.render('admin/login');
});