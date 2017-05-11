module.exports = function(app, passport) {

    /* GET Entrar */
    app.get('/login', function(req, res) {
        res.render('login');
    });

    /* POST Entrar a la cuenta */
    // app.post('/login', do all our passport stuff here);

    /* GET Registro */
    app.get('/signup', function(req, res) {
        res.render('registro');
    });

    /* POST Registrar una nueva cuenta */
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/perfil',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    /* GET Perfil del usuario */
    app.get('/perfil', isLoggedIn, function(req, res) {
        res.render('profile', {
            user : req.user // obtener el usuario de la sesión y pasarlo a la vista
        });
    });

    /* Cerrar sesión */
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

/* Saber si un usuario ya está logueado */
function isLoggedIn(req, res, next) {

    // si la sesión está autenticada, continuar
    if (req.isAuthenticated())
        return next();

    // si no, ir a la página de logueo
    res.redirect('/entrar');
}

