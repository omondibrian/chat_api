/**
 * @fileOverview  the chatsController contains the functions needed
 * to manege all the chats
 * @author brian omondi
 * @version 0.0.1
 */

import Chat from '../models/chats.models';
const { findOne, updateOne } = Chat;

/**
 * 
 * @param {*} req incoming user request
 * @param {*} res server response
 * @description used to fetch a list of chats
 * @example  'using this url' -> host:3000/api/chats/
 * 
 */
export async function getChats(req, res) {
const {_id} = req.user;
  try {
      const chats = await Chat.find({ receipentId:_id});
      res.json({
          chats,
          user: req.user
      }).status(200)
  } catch (error) {
    res.status(400).json({message:error})
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
  
if(req.body.imageUrl){
    //create a new chat
    const chat = new Chat({
        text: req.body.text,
        SenderId: req.user._id,
        receipentId:req.body.receipentId,
        imageUrl:req.body.imageUrl
    })
}else{
     //create a new chat
     const chat = new Chat({
        text: req.body.text,
        SenderId: req.user._id,
        receipentId:req.body.receipentId,
        
    })
}
    try {
        //save the chat
        const savedchat = await chat.save()
        res.status(200).send({ chat_id: savedchat._id });
    } catch (error) {
        //catch errors if any
        res.status(400).send(error)
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
    const chatId = req.params.id
    const chats = await Chat.findOne({_id:chatId});
    res.json({
        chats: chats,
        user: req.user
    }).status(200)
}

/**
 * 
 * @param {*} req incoming user request
 * @param {*} res server response
 * @description used to delete single chat
 * @example  'using this url' -> host:3000/api/chats/:id
 */
export async function deleteSingleChat(req, res) {
    const chatId = req.params.id
    const chats = await Chat.findOneAndRemove({ _id: chatId }, { useFindAndModify: false });
    res.json({
        chats: chats,
        user: req.user
    }).status(200)
}

/**
 * 
 * @param {*} req incoming user request
 * @param {*} res server response
 * @description used to delete single conversation between the user and the receiver
 * @example  'using this url' -> host:3000/api/chats/
 */
export async function deleteSingleConversation(req, res) {

    const chats = await Chat.deleteMany({ SenderId:req.body.SenderId,receipentId:req.body.receipentId}, { useFindAndModify: false });
    res.json({
        chats: chats,
        user: req.user
    }).status(200)
}
