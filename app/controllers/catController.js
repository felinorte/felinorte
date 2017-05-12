// TUTORIALES DE FOTOS
/*
  https://dinosaurscode.xyz/nodejs/2016/04/12/how-to-upload-images-to-mongodb-using-express/
  https://www.terlici.com/2015/05/16/uploading-files-locally.html
  http://stackoverflow.com/questions/7141720/node-package-for-file-attachments-and-image-resizing
*/

var express = require('express'),
  mongoose = require('mongoose');

/* Modelo de la base de datos */
var Cat = mongoose.model('Cat');

module.exports = function(app) {
  /* GET Ver todos los gatos */
  app.get('/gatos', function(req, res) {
    Cat.find({}, function(err, cats) {
      if (err) return next(err);

      res.render('cats_index', {
        title: 'Ver todos los gatos - felinorte',
        cats: cats
      });
    });
  });

  /* POST Adoptar gato */
  app.post('/adoptar/:id', function(req, res) {

  });
};