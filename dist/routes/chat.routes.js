"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require("core-js/modules/es.date.now");

require("core-js/modules/es.date.to-string");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _blocked = _interopRequireDefault(require("../middleware/blocked.middleware"));

var _multer = _interopRequireWildcard(require("multer"));

var _chats = require("../controller/chats.controller");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @fileOverview it contains all the post routes for the application
 * @author brian omondi
 * @version 0.0.1
 */
var router = (0, _express.Router)();
var storage = (0, _multer.diskStorage)({
  destination: function destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function filename(req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

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
/**
 * get chats route
 * calls the getChat route handler
 */

router.get("/", _chats.getChats); // router.get('/',getNewChats);

/**make chats route
 * calls the makeNewChat route handler
 */

router.post("/", upload.single("imageUrl"), _blocked["default"], _chats.makeNewChat);
router["delete"]("/conv", _chats.deleteSingleConversation);
router.get("/:id", _chats.getSingleChat);
router["delete"]("/:id", _chats.deleteSingleChat);
router.put("/likeChat", _chats.likeChat);
router.put("/markAsRead", _chats.markAsRead); //todo:add the isLiked and isRead route

var _default = router;
exports["default"] = _default;
//# sourceMappingURL=chat.routes.js.map