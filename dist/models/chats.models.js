"use strict";

require("core-js/modules/es.date.now");

require("core-js/modules/es.date.to-string");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

/**
 * @fileOverview It describes the basic structure/schema of the chats collection
 * @author brian omondi
 * @version 0.0.1
 */
var Schema = _mongoose.Schema; //Todo:add isLiked to the chats model

var chatSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  SenderId: {
    type: String,
    required: true
  },
  receipentId: {
    type: String,
    required: true
  },
  dateSent: {
    type: Date,
    "default": Date.now
  },
  isRead: {
    type: Boolean,
    "default": false
  },
  isLiked: {
    type: Boolean,
    "default": false
  }
});
var chat = (0, _mongoose.model)("post", chatSchema);
var _default = chat;
exports["default"] = _default;
//# sourceMappingURL=chats.models.js.map