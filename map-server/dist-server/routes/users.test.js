"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _app = _interopRequireDefault(require("../app"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var expect = _chai["default"].expect;

var should = _chai["default"].should();

_chai["default"].use(_chaiHttp["default"]);

describe('Users test', function () {
  it('test index msg', function (done) {
    _chai["default"].request(_app["default"]).get('/users').end(function (err, res) {
      if (err) done(err);
      res.should.have.status(200);
      res.body.should.be.a('object');
      var message = res.body.message;
      expect(message).to.be.a('string');
      var actual = message;
      expect(actual).to.be.equal('No users at the moment!');
      done();
    });
  });
});