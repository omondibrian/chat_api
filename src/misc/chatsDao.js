/**
 * @fileOverview  the chatsDao contains the functions needed
 * to manege all database interactions
 * @author brian omondi
 * @version 0.0.1
 */

import Chat from "../models/chats.models";
import { verify } from "jsonwebtoken";

// const chat = await getsingleChat(token,chatId)
/**
 * @param {String} token user auth token
 * @private method of the class
 * @description use to varify the validity of the jwt passed
 * @returns {Boolean} either true if valid token or false if otherwise
 */
const tokenVerifyer = token => {
  try {
    const verifiedToken = verify(token, process.env.SECREATE_TOKEN);
    if (verifiedToken) return true;
  } catch (e) {
    return false;
  }
};

/**
 * @param {Document} chat chat document to be saved
 * @private method of the class
 * @description used to save the chat document into the collection
 */
export const saveChat = async chat => {
  try {
    //save the chat
    const savedchat = await chat.save();
    return savedchat;
  } catch (error) {
    //catch errors if any
    throw new TypeError("error saving chat");
  }
};
/**
 * @param {String} token the user auth token used to check for authencity of the user
 * @param {String} chatId chat to be fetched
 * @public method of the class
 * @returns {Document}  an array of user chats
 * @throws  invalid token exeception
 * @description used to fetch single user chat from the chats collection
 *
 */
export const getsingleChat = (token, chatId) => {
  const isVarified = tokenVerifyer(token);
  if (!isVarified) {
    throw new TypeError("invalid token");
  }
  return new Promise(async (resolve, reject) => {
    try {
      const chat = await Chat.find({ _id: chatId });
      resolve(chat);
    } catch (error) {
      reject(error);
    }
  });
};
/**
 * @public method
 * @param {String} token the user auth token used to check for authencity of the user
 * @returns {Document[]}  an array of user chats
 * @throws  invalid token exeception
 * @description used to retrive user chats
 */
export const getUserChats = token => {
  const isVarified = tokenVerifyer(token);
  if (!isVarified) {
    throw new TypeError("invalid token");
  }
  const { _id } = verify(token, process.env.SECREATE_TOKEN);
  return new Promise(async (resolve, reject) => {
    try {
      const chats = await Chat.find({ receipentId: _id });
      resolve(chats);
    } catch (err) {
      reject(new TypeError("error while processing your chats"));
    }
  });
};
/**
 * @public method
 * @param {String} token the user auth token used to check for authencity of the user
 * @param {*} data the payload received from the user
 * @returns {Document}  newly created user chat
 * @description create new user chats
 * @throws  invalid token exeception
 */
export const createChat = (token, data) => {
  const { _id } = verify(token, process.env.SECREATE_TOKEN);
  //check if token is valid
  const isVarified = this.tokenVerifyer(token);
  if (isVarified) {
    throw new TypeError("invalid token");
  }
  //if token is valid then the user message is saved in the persistance storage
  return new Promise(async (resolve, reject) => {
    try {
      //create a new chat
      const chat = new Chat({
        text: data.text,
        SenderId: _id,
        receipentId: data.receipentId,
        imageUrl: data.imageUrl || ""
      });
      const newChat = await this.saveChat(chat);
      resolve(newChat);
    } catch (error) {
      reject(new TypeError("error while creating your message"));
    }
  });
};
/**
 * @public method
 * @param {String} token the user auth token used to check for authencity of the user
 * @param {String} chatId chat id to be deleted
 * @returns {String}  newly created user chat
 * @description deleted specific user chat
 * @throws  invalid token exeception
 */
export const deleteChat = (token, chatId) => {
  //check if token is valid
  const isVarified = this.tokenVerifyer(token);
  if (isVarified) {
    throw new TypeError("invalid token");
  }
  //return delete the chat from persistance storage
  return new Promise(async (resolve, reject) => {
    try {
      const { _id } = await Chat.findOneAndRemove(
        { _id: chatId },
        { useFindAndModify: false }
      );
      resolve({ _id });
    } catch (error) {
      reject(new TypeError("error while removing chat "));
    }
  });
};
