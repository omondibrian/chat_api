/**
 * @fileOverview it contains all the post routes for the application
 * @author brian omondi
 * @version 0.0.1
 */

import { Router } from "express";
const router = Router();

import blocked from "../middleware/blocked.middleware";
import multer, { diskStorage } from "multer";
import {
  getChats,
  makeNewChat,
  getSingleChat,
  deleteSingleConversation,
  deleteSingleChat,
  likeChat,
  markAsRead,
  getNewChats
} from "../controller/chats.controller";
import { addObjectToStore } from "../middleware/addObjectToStore";

const storage = multer.memoryStorage()
const filefilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

/**@constant */
const upload = multer({
  storage: storage,
  fileFilter: filefilter
});

/**
 * get chats route
 * calls the getChat route handler
 */
router.get("/", getChats);
// router.get('/',getNewChats);
/**make chats route
 * calls the makeNewChat route handler
 */
router.post("/", upload.single("imageUrl"), addObjectToStore,blocked, makeNewChat);
router.delete("/conv", deleteSingleConversation);
router.get("/:id", getSingleChat);
router.delete("/:id", deleteSingleChat);
router.put("/likeChat", likeChat);
router.put("/markAsRead", markAsRead);
//todo:add the isLiked and isRead route
export default router;
