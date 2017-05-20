/*
  Controlador de todo lo relacionado con los administradores.
*/

var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var fs =require('fs');
/* Obtener modelos */
var Cat = mongoose.model('Cat');
var Colony = mongoose.model('Colony');
var User = mongoose.model('User');
var formidable=require('express-formidable');
module.exports = function(app) {
  app.use('/', router);
};

/* GET Login del panel de administración */
router.get('/admin/login', function(req, res) {
  // req.flash('info', 'Mensaje de logueo');
  res.render('admin/login', {
    title: 'Entrar - Panel de administración'
  });
});

/* GET Dashboard de administración */
router.get('/admin', function(req, res) {
  Cat.find({}, function(err, cats) {
    if (err) return res.redirect('/admin');

    res.render('admin/index', {
      title: 'Panel de administración - felinorte',
      cats: cats,
      ncats: contarElementos(cats),
    });
  });
});
express.use(formidable.parse({keepExtensions:true}));

/* GET Ver todos los gatos */
router.get('/admin/gatos', function(req, res) {
  Cat.find({}, function(err, cats) {
    if (err) {
      console.log(err);

      req.flash('error', 'Hubo un error, por favor, intente más tarde.');
      return res.redirect('/admin');
    }

    Colony.populate(cats, {
      path: "colony"
    }, function(err, cats) {
      if (err) {
        console.log(err);

        req.flash('error', 'Hubo un error, por favor, intente más tarde.');
        return res.redirect('/admin');
      }

      Colony.find({}, function(err, colonies) {
        res.render('admin/gatos', {
          title: 'Administrar gatos - felinorte',
          cats: cats,
          colonies: colonies
        });
      });

    });
  });

});

/* GET Crear nuevo gato */
router.get('/admin/gatos/nuevo', function(req, res) {
  res.render('admin/gatoNew', {
    title: 'Agregar nuevo gato - felinorte'
  });
});

/* POST Crear gato */
router.post('/gato/new', function(req, res) {
var ext=req.body.fotito.extension.split(".").pop();
  var cat = new Cat({
    foto:ext,
    nombre: req.body.nombre,
    fecha_nacimiento: req.body.fecha_nacimiento
  });

  cat.save(function(err) {
    if (err) {
      req.flash('error', '¡No se ha podido agregar el gato!'); // Enviar un mensaje de error
      res.redirect('/admin/gatos/')
      return console.log(err); // Escribir en consola el error
    }
    fs.rename(req.body.fotito.path,"uploads/img/"+cat.nombre+"."+ext)
    req.flash('info', 'Gato agregado exitosamente...');
    res.redirect('/admin/gatos/');
  });

  /*
  Cat.create({
    nombre: req.body.nombre,
    fecha_nacimiento: req.body.fecha_nacimiento
  }, function(err) {
    // Si sucede algún error
    if (err) {
      req.flash('error', '¡No se ha podido agregar el gato!'); // Enviar un mensaje de error
      res.redirect('/admin/gatos/')
      return console.log(err); // Escribir en consola el error
    }

    req.flash('info', 'Gato agregado exitosamente...');
    res.redirect('/admin/gatos/');
  }); */
});

/* GET Ver todas las colonias */
router.get('/admin/colonias', function(req, res) {
  Colony.find({}, function(err, colonies) {
    if (err) {
      console.log(err);

      req.flash('error', 'Hubo un error al obtener las colonias. Por favor, intentelo más tarde.');
      res.redirect('/admin');
    }

    res.render('admin/colonias', {
      colonies: colonies,
      title: 'Administrar colonias - felinorte'
    });
  });


});

/* POST Crear colonias */
router.post('/colony/new', function(req, res) {
  // Busco las colonias con el mismo nombre
  Colony.count({
    name: req.body.nombre
  }, function(err, c) {
    // Si hay algún error
    if (err) {
      console.log(err);
      req.flash('error', '¡No se ha podido crear la colonia! Por favor, intentelo más tarde.'); // Enviar un mensaje de error
      return res.redirect('/admin/colonias');
    }

    // Si ya hay una colonia con ese nombre
    if (c > 0) {
      req.flash('error', '¡La colonia que está intentando crear ya existe!'); // Enviar un mensaje de error
      return res.redirect('/admin/colonias');
    }

    // Creo la nueva colonia
    Colony.create({
      name: req.body.nombre
    }, function(err) {
      // Si hay algún error
      if (err) {
        console.log(err); // Escribir en consola el error
        req.flash('error', '¡No se ha podido crear la colonia! Por favor, intentelo más tarde.'); // Enviar un mensaje de error
        return res.redirect('/admin/colonias/');
      }

      req.flash('info', 'Colonia agregada exitosamente...');
      res.redirect('/admin/colonias/');
    });
  });

});

/* GET Ver todos los usuarios regisignoutstrados */
// TODO Terminar
router.get('/admin/usuarios', function(req, res) {
  User.find({}, function(err, users){
    if (err) {
      console.log(err);
      
      req.flash('error', 'Ha ocurrido un problema, por favor, intentelo de nuevo.');
      res.redirect('/admin');
    }
    
    res.end()
  });
});

/* Funciones */
// Contar los elementos de una colección
function contarElementos(lista) {
  var i = 0;
  lista.forEach(function(elem) {
    i = i + 1;
  });

  return i;
}