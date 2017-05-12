module.exports = function (app, passport) {

  app.get('/login', function (req, res) {
    res.render('everyBody/login');
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  app.get('/signup', function (req, res) {
    res.render('everyBody/signup');
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  app.get('/profile', isLoggedIn, function (req, res) {
    res.render('everyBody/profile', {
      user: req.user
    });
  });

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}
