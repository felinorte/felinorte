var express = require('express'),
    router = express.Router();
    
module.exports = function(app, passport){
    app.use('/', router);
};
