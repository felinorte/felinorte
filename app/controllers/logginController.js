var mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router();

module.exports = function(app){
  app.use('/', router);
};