/**
 * @fileOverview this is the main file and serves as the root entry point of the application
 * @author brian omondi
 * @version 0.0.1
 */


import * as dotenv from "dotenv";
import Http from "http";
import socketIo from "socket.io";
import app ,{start}from "./app";
const server = Http.Server(app);

// load env vars

dotenv.config({ path: "config/config.env" });

import { createClient } from "redis";
import { getUserChats, getsingleChat } from "./misc/chatsDao";


const Port = process.env.PORT || 4000;
const REDIS_PORT = process.env.PORT || 6379;

//setup the redis client
const client = createClient(REDIS_PORT);

start()
server.listen(Port, () => {
  console.log(`server up and running on port ${Port}`);
});

//socket setup
const io = socketIo(server);

io.on("connection", socket => {
  //fire 'online'event to notify all connected friends
  socket.on("online", data => {
    const { _id } = data;
    //add user to redis cache
    client.setex(_id, 3600, socket.id);
  });
  // Fire 'send' event for updating Message list in UI
  socket.on("message", function(data) {
    console.log("data", data);
    const { _id, chatId, token } = data;
    try {
      client.get(_id, async (err, socketId) => {
        if (err) throw err;
        if (socketId !== null) {
          const chat = await getsingleChat(token, chatId);
          console.log(`chatid = ${chatId} and its chat=${chat}`);
          io.to(`${socketId}`).emit("incoming_message", chat);
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
  // Fire 'typing' event for updating the UI
  socket.on("typing", function(data) {
    const { _id } = data;
    getSocketIdAndExecuteEvent(_id, socketId => {
      io.to(`${socketId}`).emit("typed");
    });
  });
  //check for new unread messages , friend requests or accepted requests
  socket.on("notifications", async function(data) {
    const { token, _id } = data;
    try {
      const newChats = await getUserChats(token);
      getSocketIdAndExecuteEvent(_id, socketId => {
        io.to(`${socketId}`).emit("newNotification", newChats);
      });
    } catch (err) {
      console.log(err);
    }
  });
});

function getSocketIdAndExecuteEvent(_id, cb, data) {
  try {
    client.get(_id, (err, socketId) => {
      if (err) throw err;
      if (socketId !== null) {
        cb(socketId, data);
      }
    });
  } catch (err) {
    console.log(err);
  }
}
