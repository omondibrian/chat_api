"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _auth = require("../controller/auth.controller");

var _verfyToken = _interopRequireDefault(require("../middleware/verfyToken.middleware"));

var _multer = _interopRequireWildcard(require("multer"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @fileOverview this is the authorisation routes
 * @author brian omondi
 * @version 0.0.1
 */
var router = require("express").Router();

var storage = _multer["default"].memoryStorage();

var filefilter = function filefilter(req, file, cb) {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
/**@constant */


var upload = (0, _multer["default"])({
  storage: storage,
  fileFilter: filefilter
});
/**registration route
 * @param req this passes the requests from the user to the server
 * @param res this is the response given back to the client side
 * @example
 * this is accessed via this end point
 * https:localhost/api/user/register
 */

router.post("/register", upload.single("profileImage"), _auth.register_user);
/**login route
 * @param req
 * @param res
 * this is how the routes param are used
 * @example
 * https:localhost/api/user/login
 * to acess your login authorization token -> AUTH_TOKEN
 */

router.post("/login", _auth.log_in_user); // router.post("/verify", activateAccount);

router.post("/users", _verfyToken["default"], _auth.getUsers);
router.get("/:id", _verfyToken["default"], _auth.getUser);
router.put("/", upload.single("profileImage"), _verfyToken["default"], _auth.changeUserProfile);
router.post("/forgotpass", _auth.forgotPass);
router.post("/", _verfyToken["default"], _auth.searchFriends);
router.put("/addContact", _verfyToken["default"], _auth.addContact);
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=auth.routes.js.map