var uri = 'mongodb://root:lilofa98@cluster0-shard-00-00-bz6ai.mongodb.net:27017,cluster0-shard-00-01-bz6ai.mongodb.net:27017,cluster0-shard-00-02-bz6ai.mongodb.net:27017/felinorte?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

var path = require('path');
var rootPath = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';

var config = {
    development: {
        root: rootPath,
        app: {
            name: 'felinorte'
        },
        port: process.env.PORT || 3000,
        db: uri
    },

    test: {
        root: rootPath,
        app: {
            name: 'felinorte'
        },
        port: process.env.PORT || 3000,
        db: uri
    },

    production: {
        root: rootPath,
        app: {
            name: 'felinorte'
        },
        port: process.env.PORT || 3000,
        db: uri
    }
};

module.exports = config[env];