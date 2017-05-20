/*
  Controlador de todo lo relacionado con los administradores.
*/

var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var fs = require('fs.extra');
/* Obtener modelos */
var Cat = mongoose.model('Cat');
var Colony = mongoose.model('Colony');
var User = mongoose.model('User');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/img/' })

module.exports = function(app, passport) {
	app.use('/', router);
}

// GET

/* GET Ver todos los usuarios regisignoutstrados */
// TODO Terminar
router.get('/admin/usuarios', function(req, res) {
	User.find({}, function(err, users) {
		if (err) {
			console.log(err);

			req.flash('error', 'Ha ocurrido un problema, por favor, intentelo de nuevo.');
			res.redirect('/admin');
		}

		res.end()
	});
});

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

/* GET Ver todos los gatos */
router.get('/admin/gatos', function(req, res) {
	Cat.find({}, function(err, cats) {
		if (err) {
			req.flash('error', 'Hubo un error, por favor, intente más tarde.');
			return res.redirect('/admin');
		}

		Colony.populate(cats, {
			path: "colony"
		}, function(err, cats) {
			if (err) {
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

/* GET Ver todas las colonias */
router.get('/admin/colonias', function(req, res) {
	Colony.find({}, function(err, colonies) {
		if (err) {
			req.flash('error', 'Hubo un error al obtener las colonias. Por favor, intentelo más tarde.');
			res.redirect('/admin');
		}

		res.render('admin/colonias', {
			colonies: colonies,
			title: 'Administrar colonias - felinorte'
		});
	});


});


// POST

/* POST Crear gato */
router.post('/gato/new',upload.single('fotito'), function(req, res) {
	Colony.findOne({
		name: req.body.colony
	}, function(err, colony) {		
		if (err) {
			req.flash('error', 'Hubo un error al crear el gato, por favor, inténtelo más tarde.');
			res.redirect('/admin/gatos');
		}
console.log(+"hola imagen:"+req.files.originalname);
		var newCat = new Cat({
			nombre: req.body.nombre,
			fecha_nacimiento: req.body.fecha_nacimiento,
			colony: colony._id
		});

		newCat.save(function(err, cat) {			
			if (err) {
				req.flash('error', 'Hubo un error al crear el gato, por favor, inténtelo más tarde.');
				res.redirect('/admin');
			}
			
			req.flash('info', '¡Gato agregado correctamente!');
			res.redirect('/admin/gatos');
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


// FUNCIONES

/* Contar los elementos de una colección */
function contarElementos(lista) {
	var i = 0;
	lista.forEach(function(elem) {
		i = i + 1;
	});

	return i;
}