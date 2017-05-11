var express = require('express'),
    router = express.Router();

module.exports = function(app, passport){
    app.use('/', router);
};

router.get('/salir', function(req, res){
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next){
    // si la sesión está autenticada, continuar
    if (req.isAuthenticated())
        return next();

    // si no, ir a la página de login
    res.redirect('/entrar');
}
