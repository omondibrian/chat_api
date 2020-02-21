/**
 * @fileOverview It describes the basic structure/schema of the chats collection
 * @author brian omondi
 * @version 0.0.1
 */

import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;
//Todo:add isLiked to the chats model
const chatSchema = new Schema({
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
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isLiked: {
    type: Boolean,
    default: false
  }
});

const chat = model("post", chatSchema);
export default chat;
