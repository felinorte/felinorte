var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Article = mongoose.model('Article');

module.exports = function(app) {
    app.use('/', router);
};

router.get('/', function(req, res, next) {
    Article.find({ _id: '59095005c17952595e28cdf5' }, function(err, articles) {
        if (err) return next(err);
        console.log(articles.title);
        res.render('index', {
            title: 'Generator-Express MVC',
            articles: articles
        });
    });
});