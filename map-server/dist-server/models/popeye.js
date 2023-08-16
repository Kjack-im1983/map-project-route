"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _routedata = _interopRequireDefault(require("../config/routedata"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _mongoose["default"].Schema;
var PopeyeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name field is required'],
    unique: true,
    trim: true,
    maxLength: [10, 'Store ID must be less than 10 chars']
  },
  route: {
    type: {
      type: String,
      "default": "Feature"
    },
    properties: {
      type: Schema.Types.Mixed,
      "default": {}
    },
    geometry: {
      type: {
        type: String,
        required: [true, 'Coordinates are required'],
        "default": 'LineString'
      },
      coordinates: Array
    }
  }
}, {
  retainKeyOrder: true,
  minimize: false
}); // Sets the created_at parameter equal to the current time

PopeyeSchema.index({
  geometry: '2dsphere'
});

var PopeyeRoutes = _mongoose["default"].model('popeye', PopeyeSchema);

var importData = function importData() {
  PopeyeRoutes.create(_routedata["default"], function (err, routes) {
    if (err) return console.error(err);
    console.log('%c%s', 'color: #1d5673', 'Data was successfully inported', routes);
  });
};

PopeyeRoutes.find({}).then(function (data, error) {
  if (error) return console.log(error);

  if (data.length) {
    PopeyeRoutes.deleteMany({}).then(function (dataDeleted, deleteErr) {
      if (deleteErr) console.log(deleteErr);
      console.log('data was successfully deleted >> ', dataDeleted);
      importData();
    });
  } // insert when not data found


  if (!data.length) {
    importData();
  }
});
var _default = PopeyeRoutes;
exports["default"] = _default;