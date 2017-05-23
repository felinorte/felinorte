let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let mongoose = require("mongoose");
var express = require('express');
var Cat = mongoose.model('Cat');
var Colony = mongoose.model('Colony');
var User = mongoose.model('User');
var Adopcion = mongoose.model('Adopcion');
chai.use(chaiHttp);
var router = express.Router();
 
  describe('/GET gatos', () => {
      it('Devuelve los gatos en la base de datos ', (done) => {
        chai.request(router)
            .get('/book')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });

 