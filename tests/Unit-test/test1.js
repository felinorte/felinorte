let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let mongoose = require("mongoose");
chai.use(chaiHttp);
var Cat = mongoose.model('Cat');
var Colony = mongoose.model('Colony');
var User = mongoose.model('User');
var Adopcion = mongoose.model('Adopcion');