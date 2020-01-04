/**
 * @fileOverview this is the authorisation routes
 * @author brian omondi
 * @version 0.0.1
 */

const router = require("express").Router();
import {
  register_user,
  log_in_user,
  getUsers,
  changeUserProfile,
  forgotPass,
  getUser
} from "../controller/auth.controller";
import verified from "../middleware/verfyToken.middleware";
import multer, { diskStorage } from "multer";

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});
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

/**registration route
 * @param req this passes the requests from the user to the server
 * @param res this is the response given back to the client side
 * @example
 * this is accessed via this end point
 * https:localhost/api/user/register
 */
router.post("/register", upload.single("profileImage"), register_user);

/**login route
 * @param req
 * @param res
 * this is how the routes param are used
 * @example
 * https:localhost/api/user/login
 * to acess your login authorization token -> AUTH_TOKEN
 */
router.post("/login", log_in_user);
// router.post("/verify", activateAccount);
router.get("/", getUsers);
router.get('/:id',getUser)
router.put("/", upload.single("profileImage"), verified, changeUserProfile);
router.post("/forgotpass", forgotPass);
export default router;
