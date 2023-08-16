"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePopeye = exports.getPaths = exports.getPath = exports.deletePopeye = exports.addPopeye = void 0;

var _popeye = _interopRequireDefault(require("../models/popeye"));

var _routedata = _interopRequireDefault(require("../config/routedata"));

var _path = _interopRequireDefault(require("path"));

require("babel-polyfill");

var _www = require("../bin/www");

var _fs = _interopRequireDefault(require("fs"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ObjectID = require('mongodb').ObjectID;

var objectId = new ObjectID();

var pathToFile = __dirname.replace('/dist-server/controllers', '/server/config/routedata.js');

var updatedRouteData = _routedata["default"];
var interval;
var delay = 3000;
var timeOut;
var coordinateRoutes = [];
var currentTime;
var tripTime;
var additionTime;
/**
 * Set timer for Routes algorithm third of
 * delay interval for each route.
 *
 * @param {object} socket 
 * @param {object} routes
 * @return {void}
 */

var getApiRouteAndEmit = function getApiRouteAndEmit() {
  var socket = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var routes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  coordinateRoutes.forEach(function (items, index) {
    timeOut = setTimeout(function () {
      currentTime = (0, _moment["default"])(new Date()).valueOf();
      index === 2 ? socket.emit('geo', routes[index - 2]) : socket.emit('geo', routes[index]); // Send remainder from tripTimer % current todo. last route to village. 

      if (index === 2) {
        tripTime = (0, _moment["default"])(new Date()).valueOf();
        var duration = (0, _moment["default"])(tripTime).diff((0, _moment["default"])(currentTime));

        var timediff = _moment["default"].utc(duration * 1000).format('HH:mm:ss');

        additionTime = (0, _moment["default"])().add(timediff, 'seconds').format('HH:mm:ss'); // this will add the seconds as long as the timer is set.

        socket.emit('tripTime', additionTime);
      }

      socket.emit('distanceTime', ((index + 1) * (delay / 3) / 1000).toFixed(1));
    }, (index + 1) * (delay / 3));
  });
};
/**
 * Set interval for instant real time data through socket
 * 
 * @param {object} socket
 * @param {object} popeyes
 * @return {void}
 */


var setRouteInterval = function setRouteInterval() {
  var socket = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var popeyes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  interval = setInterval(function () {
    getApiRouteAndEmit(socket, popeyes);
  }, delay);
};
/**
 * Process paths to create timer algorithm based.
 * 
 * @param {object} routes 
 * @param {object} socket
 * @return {void}
 */


var processRoutes = function processRoutes() {
  var routes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var socket = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  coordinateRoutes = routes.reduce(function (acc, curr, index) {
    var coordinates = curr.route.geometry.coordinates;
    acc.push(coordinates[0], coordinates[coordinates.length - 1]);
    return acc;
  }, []); // emit for markers.

  socket.emit('coordinates', coordinateRoutes);
  coordinateRoutes = coordinateRoutes.slice(1);
};
/**
 * Stream data to the client.
 * 
 * @param {array} routes
 * @return {void}
 */


var streamData = function streamData() {
  var routes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  _www.io.once('connection', function (socket) {
    // process routes.
    processRoutes(routes, socket);
    socket.on('removeTimer', function (data) {
      clearInterval(interval);
      clearTimeout(timeOut);
    });
    socket.on('setTimer', function (data) {
      clearInterval(interval);
      clearTimeout(timeOut);

      if (data) {
        setRouteInterval(socket, routes);
      }
    });
    socket.on('milliseconds', function (milliseconds) {
      console.log("Changed the milliseconds for the delay ".concat(milliseconds));
      delay = milliseconds; // Clear interval and reset it.

      clearInterval(interval);
      clearTimeout(timeOut);
      setRouteInterval(socket, routes);
    });
    socket.on('disconnect', function () {
      clearInterval(interval);
      clearTimeout(timeOut);
    });
  });
};
/**
 * Fecth all entities.
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */


var getPaths = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var popeyes;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _popeye["default"].find({});

          case 3:
            popeyes = _context.sent;

            if (!(Array.isArray(popeyes) && popeyes.length)) {
              _context.next = 12;
              break;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            streamData(popeyes);
            res.status(200).json(popeyes);
            next();
            _context.next = 21;
            break;

          case 12:
            if (!updatedRouteData.length) {
              _context.next = 20;
              break;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            streamData(updatedRouteData);
            res.status(200).json(updatedRouteData);
            next();
            _context.next = 21;
            break;

          case 20:
            throw new Error('No routes were found');

          case 21:
            _context.next = 26;
            break;

          case 23:
            _context.prev = 23;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 23]]);
  }));

  return function getPaths(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Fetch entity route by id.
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */


exports.getPaths = getPaths;

var getPath = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    var id, popeyeRoute, route;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = req.params.id;
            _context2.prev = 1;
            _context2.next = 4;
            return _popeye["default"].findById({
              _id: id
            });

          case 4:
            popeyeRoute = _context2.sent;
            route = updatedRouteData.find(function (data) {
              return data._id === id;
            });

            if (!Object.keys(popeyeRoute).length) {
              _context2.next = 13;
              break;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(popeyeRoute);
            next();
            _context2.next = 21;
            break;

          case 13:
            if (!Object.keys(route).length) {
              _context2.next = 20;
              break;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(route);
            next();
            _context2.next = 21;
            break;

          case 20:
            throw new Error('No route was found');

          case 21:
            _context2.next = 26;
            break;

          case 23:
            _context2.prev = 23;
            _context2.t0 = _context2["catch"](1);
            next(_context2.t0);

          case 26:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 23]]);
  }));

  return function getPath(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Add popeye entity
 * eg:
 * {
 *     "route": {
 *       "geometry": {
 *         "type": "LineString",
 *         "coordinates": [
 *           [
 *             14.495279788970945,
 *             35.915087047076575
 *           ]
 *         ]
 *       },
 *       "type": "Feature",
 *       "properties": {
 *         "color": "#33C9EB"
 *       }
 *     },
 *     "_id": "61a65867d324d055d49d5611",
 *     "name": "new",
 *     "__v": 0
 *   }
 *
 *
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */


exports.getPath = getPath;

var addPopeye = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
    var body, popeye, updatedBody, fileObj;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            body = req.body;
            _context3.prev = 1;
            _context3.next = 4;
            return _popeye["default"].create(body);

          case 4:
            popeye = _context3.sent;

            if (updatedRouteData.find(function (route) {
              return route._id === popeye._id;
            })) {
              console.warn('FOUND no need to write into file');
            } else {
              updatedBody = _objectSpread(_objectSpread({}, body), {}, {
                _id: popeye._id
              });
              updatedRouteData = [].concat(_toConsumableArray(updatedRouteData), [updatedBody]);
              fileObj = 'export default ' + JSON.stringify(updatedRouteData);

              _fs["default"].chmod(pathToFile, 420, function (error) {
                _fs["default"].writeFile(pathToFile, fileObj, function (err, routeFile) {
                  if (err) return console.err(err);
                  console.log(routeFile);
                  console.log('Changed file permissions');
                });
              });
            }

            if (!Object.keys(popeye).length) {
              _context3.next = 13;
              break;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(popeye);
            next();
            _context3.next = 14;
            break;

          case 13:
            throw new Error('Post not successfull');

          case 14:
            _context3.next = 19;
            break;

          case 16:
            _context3.prev = 16;
            _context3.t0 = _context3["catch"](1);
            next(_context3.t0);

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 16]]);
  }));

  return function addPopeye(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.addPopeye = addPopeye;

var deletePopeye = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
    var id, fileObj, popeye;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = req.params.id;
            _context4.prev = 1;
            updatedRouteData = updatedRouteData.filter(function (route) {
              return route._id !== id;
            });
            fileObj = 'export default ' + JSON.stringify(updatedRouteData);

            _fs["default"].chmod(pathToFile, 420, function (error) {
              if (error) return console.warn(error);

              _fs["default"].writeFile(pathToFile, fileObj, function (err, routeFile) {
                if (err) return console.err(err);
                console.log('File was successfully stored');
              });

              console.log('Changed file permissions');
            }); // Find By id and remove.


            _context4.next = 7;
            return _popeye["default"].findByIdAndRemove({
              _id: id
            });

          case 7:
            popeye = _context4.sent;

            if (!popeye) {
              _context4.next = 15;
              break;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
              success: true,
              message: "Route was successufully deleted popeye ".concat(id)
            });
            next();
            _context4.next = 16;
            break;

          case 15:
            throw new Error('Not found');

          case 16:
            _context4.next = 21;
            break;

          case 18:
            _context4.prev = 18;
            _context4.t0 = _context4["catch"](1);
            next(_context4.t0);

          case 21:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 18]]);
  }));

  return function deletePopeye(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * Update Route.
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */


exports.deletePopeye = deletePopeye;

var updatePopeye = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res, next) {
    var id, body, popeye, foundRoute, bodyGeometry, bodyType, bodyProperties, bodyName, fileObj;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            id = req.params.id, body = req.body;
            _context5.prev = 1;
            _context5.next = 4;
            return _popeye["default"].findByIdAndUpdate({
              _id: id
            }, body);

          case 4:
            _context5.next = 6;
            return _popeye["default"].findOne({
              _id: id
            });

          case 6:
            popeye = _context5.sent;

            if (!popeye) {
              _context5.next = 25;
              break;
            }

            // find the route to be updated.
            foundRoute = updatedRouteData.find(function (route) {
              return route._id === id;
            }); // Add id to the body.

            body = _objectSpread(_objectSpread({}, body), {}, {
              _id: popeye._id
            });
            bodyGeometry = typeof body.route.geometry !== 'undefined' && Object.keys(body.route.geometry).length ? body.route.geometry : foundRoute.route.geometry;
            bodyType = typeof body.route.type !== 'undefined' && typeof body.route.type !== '' ? body.route.type : foundRoute.route.type;
            bodyProperties = typeof body.route.properties !== 'undefined' && Object.keys(body.route.properties).length ? body.route.properties : foundRoute.route.properties;
            bodyName = typeof body.name !== 'undefined' && typeof body.name !== '' ? body.name : foundRoute.name; // Replace old values with new for the found route.

            foundRoute = _objectSpread(_objectSpread({}, foundRoute), {}, {
              route: {
                geometry: bodyGeometry,
                type: bodyType,
                properties: bodyProperties
              },
              name: bodyName,
              __v: 0,
              _id: body._id
            }); // remove the old route

            updatedRouteData = updatedRouteData.filter(function (route) {
              return route._id !== id;
            }); // merge the foundRoute.

            updatedRouteData = [].concat(_toConsumableArray(updatedRouteData), [foundRoute]); // Update properties.

            fileObj = 'export default ' + JSON.stringify(updatedRouteData);

            _fs["default"].chmod(pathToFile, 420, function (error) {
              if (error) return console.warn(error);

              _fs["default"].writeFile(pathToFile, fileObj, function (err, routeFile) {
                if (err) return console.err(err);
                console.log('Changed file permissions');
              });
            });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(popeye);
            next();
            _context5.next = 26;
            break;

          case 25:
            throw new Error('Not found');

          case 26:
            _context5.next = 31;
            break;

          case 28:
            _context5.prev = 28;
            _context5.t0 = _context5["catch"](1);
            next(_context5.t0);

          case 31:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[1, 28]]);
  }));

  return function updatePopeye(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();

exports.updatePopeye = updatePopeye;