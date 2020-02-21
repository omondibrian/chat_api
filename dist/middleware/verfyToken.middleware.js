"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = require("jsonwebtoken");

/**
 * @fileOverview contains all the custom middleware used in the application
 * @author Eucossa
 * @version 0.0.1
 */
var _default = function _default(req, res, next) {
  var token = req.header("AUTH_TOKEN");
  if (!token) return res.status(401).send("ACCESS DENIED");

  try {
    var verifiedToken = (0, _jsonwebtoken.verify)(token, process.env.SECREATE_TOKEN);
    req.user = verifiedToken;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

exports["default"] = _default;
//# sourceMappingURL=verfyToken.middleware.js.map