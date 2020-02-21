"use strict";

require("core-js/modules/es.date.now");

require("core-js/modules/es.date.to-string");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

/**
 * @fileOverview  it describes the users schema i.e how data will be structured in
 * the mongoose database
 * @author brian omondi
 * @version 0.0.1
 */
// const contactSchema = new Schema({
//     userId:{
//         type:String,
//         required:true,
//         max:255
//     },
// })
var userSchema = new _mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6
  },
  dateOfRegistration: {
    type: Date,
    "default": Date.now
  },
  profileImage: {
    type: String
  },
  contacts: {
    type: [String]
  },
  blockedContacts: {
    type: [String]
  }
});

var _default = (0, _mongoose.model)("User", userSchema);

exports["default"] = _default;
//# sourceMappingURL=user.model.js.map