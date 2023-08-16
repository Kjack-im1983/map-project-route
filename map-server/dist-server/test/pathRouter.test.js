"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _supertest = _interopRequireDefault(require("supertest"));

var _popeye = _interopRequireDefault(require("../models/popeye"));

var _app = _interopRequireDefault(require("../app"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

require("babel-polyfill");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var expect = _chai["default"].expect;

var should = _chai["default"].should();

_chai["default"].use(_chaiHttp["default"]);

var routeId = '';

var checkReponseObj = function checkReponseObj(res, done) {
  res.should.have.status(200);
  expect(res.body).should.be.a('object');
  var _res$body = res.body,
      _id = _res$body._id,
      name = _res$body.name,
      route = _res$body.route;
  routeId = _id;
  var type = route.type,
      properties = route.properties,
      geometry = route.geometry;
  var _route$geometry = route.geometry,
      coordinateType = _route$geometry.type,
      coordinates = _route$geometry.coordinates;
  var actualCorninatesResult = [[14.495279788970945, 35.915087047076575], [14.495869874954222, 35.91489588560945]]; // Assertetions.

  expect(res.body).to.have.property('name');
  expect(name).to.be.a('string');
  expect(res.body).to.have.property('route');
  expect(route).should.be.a('object');
  expect(route).to.have.property('type');
  expect(type).to.be.a('string');
  expect(route).to.have.property('properties');
  expect(properties).should.be.a('object');
  expect(route).to.have.property('geometry');
  expect(geometry).should.be.a('object');
  expect(geometry).to.have.property('type');
  expect(coordinateType).to.be.a('string');
  expect(geometry).to.have.property('coordinates');
  expect(coordinates).to.be.a('array');
  expect(actualCorninatesResult).to.deep.equal(coordinates);
  done();
}; //Our parent block


describe('TEST POPEYE ROUTES', function () {
  // Remove this block of code if we want to remove routes from db.
  // off course then we need to check the length of the response eql(0)
  // res.body.length.should.be.eql(0);

  /* beforeEach((done) => {
  	Popeye.remove({}, (err) => {
  	   done();
  	});
  }); */

  /*
  * Test the /GET/ routes
  */
  describe('/GET popeyes routes', function () {
    it('it should GET all the routes', function (done) {
      _chai["default"].request(_app["default"]).get('/api/popeye').end(function (err, res) {
        if (err) done(err);
        res.should.have.status(200);
        res.should.to.be.json;
        expect(res.body).to.be.a('array');
        done();
      });
    });
  });
  /*
  * Test the /POST/:id route
  */

  describe('/POST popeyes routes', function () {
    it('it should POST a route ', function (done) {
      var Route = {
        "name": "somename",
        "route": {
          "type": "Feature",
          "properties": {
            "color": "#33C9EB"
          },
          "geometry": {
            "type": "LineString",
            "coordinates": [[14.495279788970945, 35.915087047076575], [14.495869874954222, 35.91489588560945]]
          }
        }
      };

      _chai["default"].request(_app["default"]).post('/api/popeye').send(Route).end(function (err, res) {
        if (err) done(err);
        checkReponseObj(res, done);
      });
    });
  });
  /*
  * Test the /GET/:id route
  */

  describe('/GET/:id route', function () {
    it('it should GET a route by the given id', function (done) {
      _chai["default"].request(_app["default"]).get("/api/popeye/".concat(routeId)).end(function (err, res) {
        if (err) done(err);
        checkReponseObj(res, done);
      });
    });
  });
  /*
  * Test the /PUT/:id route
  */

  describe('/UPDATE/:id route', function () {
    it('it should UPDATE a route by the given id', function (done) {
      var updatePopeyeRoute = {
        "name": "newName",
        "route": {
          "type": "Feature",
          "properties": {
            "color": "#33C9EB"
          },
          "geometry": {
            "type": "LineString",
            "coordinates": [[14.495279788970945, 35.915087047076575], [14.495869874954222, 35.91489588560945]]
          }
        }
      };

      _popeye["default"].findByIdAndUpdate({
        _id: routeId
      }, updatePopeyeRoute).then(function (route) {
        _popeye["default"].findOne({
          _id: route._id
        }).then(function (nestedRoute) {
          _chai["default"].request(_app["default"]).put("/api/popeye/".concat(nestedRoute._id)).end(function (err, res) {
            if (err) done(err);
            checkReponseObj(res, done);
          });
        });
      });
    });
  });
  /*
  * Test the /DELETE/:id route
  */

  describe('/DELETE/:id route', function () {
    it('it should DELETE a route by the given id', function (done) {
      _chai["default"].request(_app["default"])["delete"]("/api/popeye/".concat(routeId)).end(function (err, res) {
        if (err) done(err);
        res.should.have.status(200);
        res.should.to.be.json;
      });

      done();
    });
  });
});