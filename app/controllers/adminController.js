/*
  Controlador de todo lo relacionado con los administradores.
*/

var mongoose = require('mongoose');
var express = require('express');
var fs = require('fs');
var multer = require('multer');
var router = express.Router();

/* Obtener modelos */
var Cat = mongoose.model('Cat');
var Colony = mongoose.model('Colony');
var User = mongoose.model('User');
var Adopcion = mongoose.model('Adopcion');

// copias el storage y el  upload cambias el destino y el input que no se te olvido que en el form a donde envias los datos al server necesita un enctype
var destino = './uploads/img/';
var input = 'foto';
var foto = "";
var fotoname = "";
// se establece la ruta donde se guardara la imagen 

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function(req, file, cb) {
        cb(null, destino)
    },
    filename: function(req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.originalname)
    }
});

// objeto que permite validaciones 
var upload = multer({ //multer settings
    storage: storage,
    fileFilter: function(req, file, callback) {
        var ext = "." + file.originalname.split(".").pop();
        foto = ext;
        fotoname = file.originalname;
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            req.flash('error', '¡Formato no valido!');

        }
        callback(null, true)
    },
    limits: {
        fileSize: 1024 * 1024
    }
    // nombre del input type file de donde proviene la imagen
}).single(input);

module.exports = function(app, passport) {
    app.use('/', router);
}

// GET

/* GET Ver todos los usuarios registrados */
router.get('/admin/usuarios', isLoggedIn, isAdmin, function(req, res) {
    User.find({}, function(err, users) {
        if (err) {
            req.flash('error', 'Ha ocurrido un problema, por favor, intentelo de nuevo.');
            res.redirect('/admin');
        }

        res.render('', {
            title: 'Administrar usuarios - felinorte',
            users: users
        });
    });
});

/* GET Login del panel de administración */
router.get('/admin/login', isLoggedIn, isAdmin, function(req, res) {
    res.render('admin/login', {
        title: 'Entrar - Panel de administración'
    });
});

/* GET Dashboard de administración */
router.get('/admin', isLoggedIn, isAdmin, function(req, res) {
    Cat.count({}, function(err, cats) {
        if (err) res.redirect('/');

        Colony.count({}, function(err, colonies) {
            if (err) res.redirect('/');

            User.count({}, function(err, users) {
                if (err) res.redirect('/');

                res.render('admin/index', {
                    title: 'Panel de administración - felinorte',
                    cats: cats,
                    colonies: colonies,
                    user: req.user,
                    users: users
                });
            });
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
                    colonies: colonies,
                    user: req.user
                });
            });

        });
    });

});

/* GET Ver todas las colonias */
router.get('/admin/colonias', function(req, res) {
    Colony.find({}, function(err, colonies) {
        if (err) {
            req.flash('error', 'Hubo un error al obtener las colonias. Por favor, intentelo más tarde.');
            res.redirect('/admin');
        }

        var cats = new Array(colonies.length);
        for (var i = 0; i < colonies.length; i++) {
            cats[i] = colonies[i].cats.length
        }

        res.render('admin/colonias', {
            colonies: colonies,
            title: 'Administrar colonias - felinorte',
            cats: cats
        });
    });


});


// POST

/* POST Crear gato */
router.post('/gato/new', function(req, res) {
    var nombref = "";
    //funcion que activa el upload 
    upload(req, res, function(err) {
        if (err) {
            // An error occurred when uploading
            res.render('error', {
                error: err
            });
        }
    });

    Cat.count({
        nombre: req.body.nombre.trim()
    }, function(err, c) {
        if (err) {
            req.flash('error', 'Hubo un error al crear el gato, por favor, inténtelo más tarde.');
            res.redirect('/admin/gatos');
        }

        if (c > 0) {
            req.flash('error', 'Ya existe un gato con el mismo nombre.');
            res.redirect('/admin/gatos');
        }

        Colony.findOne({
            name: req.body.colony.trim()
        }, function(err, colony) {
            if (err) {
                req.flash('error', 'Hubo un error al crear el gato, por favor, inténtelo más tarde.');
                res.redirect('/admin/gatos');
            }

            var newCat = new Cat({
                foto: foto,
                nombre: req.body.nombre,
                fecha_nacimiento: req.body.fecha_nacimiento,
                colony: colony._id
            });

            newCat.save(function(err, cat) {
                if (err) {
                    req.flash('error', 'Hubo un error al crear el gato, por favor, inténtelo más tarde.');
                    res.redirect('/admin');
                }

                Colony.update({
                        name: req.body.colony
                    }, {
                        $push: {
                            cats: cat._id
                        }
                    },
                    function(err) {
                        if (err) return res.redirect('/admin/gatos');

                        fs.rename('uploads/img/' + fotoname, 'uploads/img/' + req.body.nombre + foto);
                        req.flash('info', '¡Gato agregado correctamente!');
                        res.redirect('/admin/gatos');
                    }
                );
            });
        });
    });

});

/* POST Crear colonias */
router.post('/colony/new', function(req, res) {
    // Busco las colonias con el mismo nombre
    Colony.count({
        name: req.body.nombre.trim()
    }, function(err, c) {

        // Si hay algún error
        if (err) {
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
                req.flash('error', '¡No se ha podido crear la colonia! Por favor, intentelo más tarde.'); // Enviar un mensaje de error
                return res.redirect('/admin/colonias/');
            }

            req.flash('info', 'Colonia agregada exitosamente...');
            res.redirect('/admin/colonias/');
        });
    });
});

/* POST Crear nuevo proceso de adopción */
// TODO Completar
router.post('/adoptar/:id', isLoggedIn, function(req, res) {
    Cat.findOne({
        _id: req.param('id')
    }, function(err, cat) {
        if (err) res.redirect('/');

        if (cat && cat.adoptable == 'Y - Yes') {
            Adopcion.create({
                gato: cat
            }, function(err) {
                if (err) res.redirect('/');

                res.redirect('/profile');
            });
        }
    });
});

/* POST Agregar comentario a proceso de adopción */
// TODO Completar
router.post('/comentar/:id', isLoggedIn, isAdmin, function(req, res) {
    Adopcion.findOne({
        _id: req.param('id')
    }, function(err, proceso) {
        if (err) res.redirect('/admin');

        if (proceso) {
            Comment.create({
                admin: req.user,
                fecha_creacion: Date.now,
                contenido: req.body.comentario
            }, function(err, comment) {
                if (err) res.redirect('/admin');
                
                proceso.comentarios.push(comment._id);
                proceso.save(function(err) {
                    res.redirect('/admin');
                });
            });
        }
    });
});


// DELETE

router.delete('/gato/delete', function(req, res) {
    Cat.remove({
        _id: req.param.id
    }, function(err) {
        if (err) res.redirect('/admin/gatos');

        Colony.update({
                _id: req.cat.id
            }, {
                $pull: {
                    cats: req.param.id
                }
            },
            function(err) {
                if (err) res.redirect('/admin/gatos');

                req.flash('info', '¡Gato eliminado exitosamente!');
                res.redirect('/admin/gatos');
            }
        );
    });
});

router.delete('/colony/delete', function(req, res) {
    Colony.remove({
        _id: req.param.id
    }, function(err) {
        if (err) res.redirect('/admin/colonias');

        req.flash('info', '¡Colonia eliminada correctamente!');
        res.redirect('/admin/colonias');
    });
});

// FUNCIONES

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}

function isAdmin(req, res, next) {
    if (req.user.local.userType == "admin") return next();
    res.redirect('/home');
}