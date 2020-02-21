"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registrationValidation = registrationValidation;
exports.loginValidation = loginValidation;

var _joi = _interopRequireDefault(require("@hapi/joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @fileOverview it contains all the functions needed to validate the users data
 * @author brian omondi
 * @version 0.0.1
 */
//validation

/**validate registration data */
function registrationValidation(data) {
  //create a Joi validation object
  var UserValidationSchema = _joi["default"].object().keys({
    name: _joi["default"].string().min(3).max(30).required(),
    password: _joi["default"].string().pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
    email: _joi["default"].string().email().required()
  });

  return UserValidationSchema.validate(data);
}
/**validate login data */


function loginValidation(data) {
  var UserValidationSchema = _joi["default"].object().keys({
    email: _joi["default"].string().email().required(),
    password: _joi["default"].string().pattern(/^[a-zA-Z0-9]{3,30}$/)
  });

  return UserValidationSchema.validate(data);
}
//# sourceMappingURL=validation.js.map