"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _paths = require("../controllers/paths");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var pathRouter = _express["default"].Router();

pathRouter.route('/popeye').get(_paths.getPaths).post(_paths.addPopeye);
pathRouter.route('/popeye/:id').get(_paths.getPath)["delete"](_paths.deletePopeye).put(_paths.updatePopeye);
var _default = pathRouter;
exports["default"] = _default;