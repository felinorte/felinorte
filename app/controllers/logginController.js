var mongoose = require('mongoose');
var Cat = mongoose.model('Cat');
var User = mongoose.model('User');
var Colony = mongoose.model('Colony');

module.exports = function(app, passport) {

  app.get('/login', isntLoggedIn, function(req, res) {
    res.render('everyBody/login');
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  app.get('/signup', isntLoggedIn, function(req, res) {
    res.render('everyBody/signup')
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  app.get('/profile', isLoggedIn, function(req, res) {
    Cat.find({}, function(err, cats) {
      if (err) {
        req.flash('error', 'Hubo un error al cargar los gatos, por favor, intente más tarde.');
        return render('/home');
      } else {

        Colony.populate(cats, {
          path: "colony"
        }, function(err, cats) {
          if (err) {
            req.flash('error', 'Hubo un error al cargar los gatos, por favor, intente más tarde.');
            return render('/home');
          }

          Colony.find({}, function(err, colonies) {
            res.render('everyBody/profile', {
              title: 'Perfil',
              user: req.user,
              cats: cats,
              colonies: colonies
            });
          });

        });
      }
    });
  });

  app.get('/profile/update', isLoggedIn, function(req, res) {
    res.render('everyBody/update', {
      title: 'Actualizar datos',
      user: req.user
    });
  });

  app.post('/profile/update', isLoggedIn, function(req, res) {
    User.findById(req.user.id, function(err, user) {
      if (err) {
        req.flash('error', 'No ha sido posible actualizar la información.');
        res.redirect('/profile/update');
      }

      if (req.body.firstname !== "")
        user.local.name.nombre = req.body.firstname;
      if (req.body.lastname !== "")
        user.local.name.apellidos = req.body.lastname;
      if (req.body.fechaNacimiento !== "")
        user.local.fechaNacimiento = req.body.birthdate;
      if (req.body.ocupacion !== "")
        user.local.ocupacion = req.body.ocupacion;
      if (req.body.email !== "")
        user.local.email = req.body.email;
      if (req.body.password !== "")
        user.local.password = user.generateHash(req.body.password);

      user.save(function(err) {
        if (err) throw err;

        req.flash('info', 'Información actualizada');
        res.redirect('/profile/update');
      });
    });
  });

  // Cerrar sesión
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });
  
  app.get('/profile/adopciones', isLoggedIn, function(req, res) {
    res.render('everyBody/userAdopciones', {
      title: 'Adopciones',
      user: req.user
    });
  });
  
  /**
   * Envia a google para hacer la autenticación 
   * profile obtiene su información básica
   * email obtiene su email
   */
  app.get('/login/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  //Recibe el callback de la autenticación de google
  app.get('/login/google/callback', passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

function isntLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    res.redirect('/profile');
  return next();
}

function isAdmin(req, res, next) {
  if (req.user.userType.equals("Admin"))
    return next();
  res.redirect('/home')
}