/**
 * @fileOverview  the chatsController contains the functions needed
 * to manege all the chats
 * @author brian omondi
 * @version 0.0.1
 */

import Chat from "../models/chats.models";

/**
 *
 * @param {*} req incoming user request
 * @param {*} res server response
 * @description used to fetch a list of chats
 * @example  'using this url' -> host:4000/api/chats/
 *
 */
export async function getChats(req, res) {
  const { _id } = req.user;
  try {
    const chats = await Chat.find({
      $or: [{ receipentId: _id }, { SenderId: _id }]
    });
    res
      .json({
        chats,
        user: req.user
      })
      .status(200);
  } catch (error) {
    res.status(400).json({ message: error });
  }
}

/**
 *
 * @param {*} req incoming user request
 * @param {*} res server response
 * @description used to create new chat
 * @example  'using this url' -> host:3000/api/chats/
 * and passing {
 *                  "text": <text> ,
 *                  "receipentId":<receipentId> ,
 *             }
 */

export async function makeNewChat(req, res) {
  let image = "";
  try {
    req.file.path ? (image = req.file.path) : null;
  } catch (error) {
    image = "";
  }

  //create a new chat
  const chat = new Chat({
    text: req.body.text,
    SenderId: req.user._id,
    receipentId: req.body.receipentId,
    imageUrl: image
  });
  try {
    //save the chat
    const savedchat = await chat.save();
    res.status(200).send({ chatId: savedchat._id });
  } catch (error) {
    //catch errors if any
    res.status(400).send(error);
  }
}

/**
 *
 * @param {*} req incoming user request
 * @param {*} res server response
 * @description used to fetch single chat
 * @example  'using this url' -> host:3000/api/chats/:id
 */
export async function getSingleChat(req, res) {
  const chatId = req.params.id;
  const chats = await Chat.findOne({ _id: chatId });
  res
    .json({
      chats: chats,
      user: req.user
    })
    .status(200);
}

/**
 *
 * @param {*} req incoming user request
 * @param {*} res server response
 * @description used to delete single chat
 * @example  'using this url' -> host:3000/api/chats/:id
 */
export async function deleteSingleChat(req, res) {
  const chatId = req.params.id;
  const chats = await Chat.findOneAndRemove(
    { _id: chatId },
    { useFindAndModify: false }
  );
  res
    .json({
      chats: chats,
      user: req.user
    })
    .status(200);
}

/**
 *
 * @param {*} req incoming user request
 * @param {*} res server response
 * @description used to delete single conversation between the user and the receiver
 * @example  'using this url' -> host:4000/api/chats/conv/
 */
export async function deleteSingleConversation(req, res) {
  const chats = await Chat.deleteMany(
    {
      $and: [
        { SenderId: req.body.SenderId },
        { receipentId: req.body.receipentId }
      ]
    },
    { useFindAndModify: false }
  );
  res
    .json({
      chats: chats,
      user: req.user
    })
    .status(200);
}
/**
 *
 * @param {*} req incoming user request
 * @param {*} res server response
 * @description used to like single chat between the user and the receiver
 * @example  'using this url' -> host:4000/api/chats/likeChat/
 */
export async function likeChat(req, res) {
  const { _id } = req.body;

  try {
    const chat = await Chat.findById({ _id: _id });

    const { isLiked } = chat;
    await Chat.updateOne({ _id: _id }, { $set: { isLiked: !isLiked } });
    res.json({ message: "chat updated successfully" }).status(200);
  } catch (error) {
    res.send(new Error("error performing operation"));
  }
}

/**
 *
 * @param {*} req incoming user request
 * @param {*} res server response
 * @description used to mark chat between the user and the receiver as read
 * @example  'using this url' -> host:4000/api/chats/marlAsRead/
 */
export async function markAsRead(req, res) {
  const { _id } = req.body;
  try {
    await Chat.updateOne({ _id: _id }, { $set: { isRead: true } });
    res.json({ message: "chat updated successfully" }).status(200);
  } catch (error) {
    res.send(new Error("error performing operation"));
  }
}

export async function getNewChats(_id) {
  try {
    const chats = await Chat.find({});
    console.log("chatscontroller", chats);
    return chats;
  } catch (error) {
    throw new Error("unable to get new chats");
  }
}
