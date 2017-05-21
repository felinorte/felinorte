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
        console.log(file)
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
router.get('/admin/usuarios',isLoggedIn,isAdmin, function(req, res) {
    User.find({}, function(err, users) {
        if (err) {
            req.flash('error', 'Ha ocurrido un problema, por favor, intentelo de nuevo.');
            res.redirect('/admin');
        }

        res.end()
    });
});

/* GET Login del panel de administración */
router.get('/admin/login',isLoggedIn,isAdmin, function(req, res) {
    res.render('admin/login', {
        title: 'Entrar - Panel de administración'
    });
});

/* GET Dashboard de administración */
router.get('/admin',isLoggedIn,isAdmin, function(req, res) {
    Cat.count({}, function(err, cats) {
        if (err) res.redirect('/');

        Colony.count({}, function(err, colonies){
            if (err) res.redirect('/');
            
            User.count({}, function(err, users){
                if (err) res.redirect('/');
                
                res.render('admin/index', {
                    title: 'Panel de administración - felinorte',
                    cats: cats,
                    colonies: colonies,
                    users: users
                });
            });
        });
    });
});

/* GET Ver todos los gatos */
router.get('/admin/gatos',isLoggedIn,isAdmin, function(req, res) {
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
router.get('/admin/gatos/nuevo',isLoggedIn,isAdmin, function(req, res) {
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
router.post('/gato/new',isLoggedIn,isAdmin, function(req, res) {
    var nombref = "";
    //funcion que activa el upload 
    upload(req, res, function(err) {
        if (err) {
            // An error occurred when uploading
            res.render('error', {
                error: err
            });

        }
        console.log("exito");
        // Everything went fine
    });



    Colony.findOne({
        name: req.body.colony
    }, function(err, colony) {
        if (err) {
            req.flash('error', 'Hubo un error al crear el gato, por favor, inténtelo más tarde.');
            res.redirect('/admin/gatos');
        }


        var newCat = new Cat({
            foto: foto,
            nombre: req.body.nombre,
            fecha_nacimiento: req.body.fecha_nacimiento,
            /*colony: colony._id*/
        });

        newCat.save(function(err, cat) {
            if (err) {
                req.flash('error', 'Hubo un error al crear el gato, por favor, inténtelo más tarde.');
                res.redirect('/admin');
            }
            console.log(fotoname + "Extension" + foto)
            fs.rename('uploads/img/' + fotoname, 'uploads/img/' + req.body.nombre + foto);
            req.flash('info', '¡Gato agregado correctamente!');
            res.redirect('/admin/gatos');
        });
    });
});

/* POST Crear colonias */
router.post('/colony/new',isLoggedIn,isAdmin, function(req, res) {
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

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

function isAdmin(req, res , next){
    if(req.user.local.userType == "admin")
        return next();
    res.redirect('/home');
}