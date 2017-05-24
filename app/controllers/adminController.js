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

var storage = multer.diskStorage({ // multers disk storage settings
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

        callback(null, true);
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

/* GET Login del panel de administración */ // TERMINADA
router.get('/admin/login', isLoggedIn, isAdmin, function(req, res) {
    res.render('admin/login', {
        title: 'Entrar - Panel de administración'
    });
});

/* GET Dashboard de administración */ // TERMINADA
router.get('/admin', isLoggedIn, isAdmin, function(req, res) {
    Cat.count({}, function(err, cats) {
        if (err) res.redirect('/');

        Colony.count({}, function(err, colonies) {
            if (err) res.redirect('/');

            User.count({}, function(err, users) {
                if (err) res.redirect('/');

                Adopcion.find({}, function(err, procesos) {
                    if (err) res.redirect('/');
                    
                    Cat.populate(procesos, { path: 'gato' }, function(err, procesos){
                        if (err) res.redirect('/');
                        
                        User.populate(procesos, { path: 'usuario' }, function(err, procesos){
                            if (err) res.redirect('/');
                            
                            res.render('admin/index', {
                                title: 'Panel de administración - felinorte',
                                cats: cats,
                                colonies: colonies,
                                user: req.user,
                                users: users,
                                procesos: procesos.length,
                                adopciones: procesos
                            });
                        });
                    })
                });
            });
        });
    });
});

/* GET Ver todos los usuarios registrados */ // TERMINADA
router.get('/admin/usuarios', isLoggedIn, isAdmin, function(req, res) {
    User.find({}, function(err, users) {
        if (err) {
            req.flash('error', 'Ha ocurrido un problema, por favor, intentelo de nuevo.');
            res.redirect('/admin');
        }

        res.render('admin/users', {
            title: 'Administrar usuarios - felinorte',
            users: users,
            user: req.user
        });
    });
});

/* GET Ver todos los gatos */ // TERMINADA
router.get('/admin/gatos', isLoggedIn, isAdmin, function(req, res) {
    Colony.count({}, function(err, colonies) {
        if (err) res.redirect('/admin');

        if (colonies > 0) {
            Cat.find({}, function(err, cats) {
                if (err) {
                    req.flash('error', 'Hubo un error, por favor, intente más tarde.');
                    res.redirect('/admin');
                }

                Colony.populate(cats, {
                    path: "colony"
                }, function(err, cats) {
                    if (err) {
                        req.flash('error', 'Hubo un error, por favor, intente más tarde.');
                        res.redirect('/admin');
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
        } else {
            req.flash('error', '¡Primero debes agregar colonias a la plataforma.');
            res.redirect('/admin/colonias');
        }
    });


});

/* GET Ver todas las colonias */ // TERMINADA
router.get('/admin/colonias', isLoggedIn, isAdmin, function(req, res) {
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
            cats: cats,
            user: req.user
        });
    });


});

/* GET Ver procesos de adopción */
router.get('/admin/procesos', isLoggedIn, isAdmin, function(req, res) {
    Adopcion.find({}, function(err, procesos) {
        if (err) {
            req.flash('error', 'Ha ocurrido un error. Por favor, inténtelo de nuevo.');
            req.redirect('/admin');
        }

        User.populate(procesos, {
            path: "user"
        }, function(err, procesos) {
            if (err) {
                req.flash('error', 'Ha ocurrido un error. Por favor, inténtelo de nuevo.');
                req.redirect('/admin');
            }

            Cat.populate(procesos, {
                path: 'cat'
            }, function(err, procesos) {
                if (err) {
                    req.flash('error', 'Ha ocurrido un error. Por favor, inténtelo de nuevo.');
                    req.redirect('/admin');
                }

                res.render('admin/procesos', {
                    title: 'Administrar procesos de adopción - felinorte',
                    procesos: procesos,
                    user: req.user
                });
            });
        });


    });
});

/* GET Ver gato */
router.get('/admin/gato/:id', isLoggedIn, isAdmin, function(req, res) {
    Cat.findOne({
        id: req.param('id')
    }, function(err, cat) {
        if (err) {
            req.flash('error', 'Hubo un error al tratar de mostrar a #' + req.param('id'));
            res.redirect('/admin/gatos');
        }

        if (!cat) { // Si no se encontraron gatos con el id
            res.redirect('/admin/gatos');
        }

        res.render('admin/gato', {
            title: 'Ver gato - Panel de administración',
            cat: cat,
            user: req.user
        });
    });
});

/* GET Ver colonia */
router.get('/admin/colonia/:id', isLoggedIn, isAdmin, function(req, res) {
    res.end();
});

/* GET Ver proceso de adopción */
router.get('/admin/proceso:id', isLoggedIn, isAdmin, function(req, res) {
    var idProceso = req.params.id;
    Adopcion.count({
        _id: idProceso
    }, function(err, n) {
        if (err) return res.redirect('/admin/procesos');

        if (n > 0) {
            Adopcion.findOne({
                _id: idProceso
            }, function(err, proceso) {
                if (err) res.redirect('/admin/procesos');

                res.render('admin/proceso', {
                    title: 'Ver proceso - felinorte',
                    proceso: proceso
                });
            });
        } else {
            res.redirect('/admin/procesos');
        }
    });
});


// POST

/* POST Crear gato */
router.post('/gato/new', isLoggedIn, isAdmin, function(req, res) {
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


    Cat.count({ // Contar que no hayan más gatos con el mismo nombre
        nombre: req.body.nombre
    }, function(err, cat) {
        if (err) {
            req.flash('error', 'Hubo un error al crear el gato, por favor, inténtelo más tarde.');
            res.redirect('/admin/gatos');
        }

        if (cat > 0) { // Si ya existe el gato, ir a admin/gatos
            req.flash('error', 'Ya existe un gato con el mismo nombre.');
            res.redirect('/admin/gatos');
        }

        Colony.findOne({ // Buscar la colonia que se seleccionó
            name: req.body.colony.trim()
        }, function(err, colony) {
            if (err) {
                req.flash('error', 'Hubo un error al crear el gato, por favor, inténtelo más tarde.');
                res.redirect('/admin/gatos');
            }

            var newCat = new Cat({ // Crear nuevo gato
                foto: foto,
                nombre: req.body.nombre.trim(),
                fecha_nacimiento: req.body.fecha_nacimiento,
                colony: colony._id,
                sexo: req.body.sexo,
                edad: req.body.edad,
                felinealities: req.body.feline_cualities,
                sterilization: req.body.sterilization,
                vacc: req.body.vacc,
                desp: req.body.desp,
                adoptable: req.body.adoptable
            });

            newCat.save(function(err, cat) { // Guardar gato creado
                if (err) {
                    req.flash('error', 'Hubo un error al crear el gato, por favor, inténtelo más tarde.');
                    res.redirect('/admin');
                }

                Colony.update({ // Agregar el nuevo gato a la colonia
                    _id: colony._id
                }, {
                    $push: {
                        cats: cat._id
                    }
                }, function(err) {
                    if (err) return redirect('/admin/gatos');

                    fs.rename('uploads/img/' + fotoname, 'uploads/img/' + req.body.nombre + foto);
                    req.flash('info', '¡Gato agregado correctamente!');
                    res.redirect('/admin/gato/' + cat._id);
                });
            });
        });
    });
});

router.post('/admin/colony', isLoggedIn, isAdmin, function(req, res) {
    Colony.count({ // Contar las conolonias con el mismo nombre
        name: req.body.nombre.trim()
    }, function(err, c) {

        if (err) {
            req.flash('error', '¡No se ha podido crear la colonia! Por favor, intentelo más tarde.'); // Enviar un mensaje de error
            return res.redirect('/admin/colonias');
        }

        if (c > 0) { // Si ya existe, ir a colonias
            req.flash('error', '¡La colonia que está intentando crear ya existe!'); // Enviar un mensaje de error
            return res.redirect('/admin/colonias');
        }

        Colony.create({ // Crear nueva colonia (se guarda automáticamente)
            name: req.body.nombre
        }, function(err) {
            if (err) {
                req.flash('error', '¡No se ha podido crear la colonia! Por favor, intentelo más tarde.'); // Enviar un mensaje de error
                return res.redirect('/admin/colonias/');
            }

            req.flash('info', 'Colonia agregada exitosamente...');
            res.redirect('/admin/colonias/');
        });
    });
});

/* POST Crear nuevo proceso de adopción */ // TERMINADO
router.post('/adoptar/:id', isLoggedIn, isAdmin, function(req, res) {
    Cat.count({ // Verificar que ya existan colonias
        _id: req.param('id')
    }, function(err, n) {
        if (err) return res.redirect('/profile');

        if (n > 0) { // Si hay por lo menos una colonia
            Cat.findOne({ // Verificar que no exista un gato con el mismo nombre
                _id: req.param('id')
            }, function(err, cat) {
                if (err) return res.redirect('/profile');

                Adopcion.find({ // Verificar que no haya un proceso de adopción con el mismo usuario y gato
                    $and: [{
                        gato: req.param('id'),
                        usuario: req.user._id
                    }]
                }, function(err, adopciones) {
                    if (err) return res.redirect('/profile');

                    if (adopciones.length > 0) {
                        req.flash('error', '¡Ya tiene un proceso de adopción con ' + cat.nombre);
                        res.redirect('/profile/adopciones');
                    } else {
                        Adopcion.create({ // Crear proceso de adopción
                            gato: cat._id,
                            usuario: req.user._id
                        }, function(err) {
                            if (err) res.redirect('/');

                            req.flash('info', '¡Felicitaciones! El proceso de adopción para ' + cat.nombre + ' ha iniciado.');
                            res.redirect('/profile/adopciones');
                        });
                    }
                });
            });
        }
    });
});

/* POST Agregar comentario a proceso de adopción */ // TERMINADO
router.post('/comentar/:id', isLoggedIn, isAdmin, function(req, res) {
    Adopcion.findOne({ // Encontrar el proceso de adopción
        _id: req.params.id
    }, function(err, proceso) {
        if (err) res.redirect('/admin');

        if (proceso.length == 1) {
            Comment.create({ // Crear comentario
                admin: req.user._id,
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

router.delete('/gato/delete', isLoggedIn, isAdmin, function(req, res) {
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

router.delete('/admin/colony/:id', isLoggedIn, isAdmin, function(req, res) {
    Colony.findOne({
        _id: req.id
    }, function(err, colony) {
        if (err) res.redirect('/admin/colonias');

        for (var i = 0; i < colony.cats.length; i++) {
            colony.cats[i].colony = '';
        }

        Colony.remove({
            _id: req.id
        }, function(err) {
            if (err) res.redirect('/admin/colonias');

            req.flash('info', '¡Colonia eliminada correctamente!');
            res.redirect('/admin/colonias');
        });
    });

});


// FUNCIONES

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

function isAdmin(req, res, next) {
    if (req.user.local.userType == "admin") return next();
    res.redirect('/login');
}