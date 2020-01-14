/**
 * @fileOverview it contains all the post routes for the application
 * @author brian omondi
 * @version 0.0.1
 */

import { Router } from 'express';
const router=Router();

import admin from '../middleware/auth.middleware';
import multer, { diskStorage } from 'multer';
import {getChats, makeNewChat, getSingleChat, editChat, deleteSingleChat} from '../controller/chats.controller'

const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname)
    }
})
const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

/**@constant */
const upload = multer({
    storage: storage,
    fileFilter: filefilter
});

/**
 * get chats route
 * calls the getChat route handler
 */
router.get('/',getChats);

/**make chats route
 * calls the makeNewChat route handler
 */
router.post('/', upload.single('imageUrl'),makeNewChat);
// router.get('/conv/:id',deleteSingleConversation);
router.get('/:id', getSingleChat);
router.delete('/:id',deleteSingleChat)
//todo:add the isLiked and isRead route
export default router ;