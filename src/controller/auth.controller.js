/**
 * @fileOverview contains the various functions to manage the users route.
 * @author Brian omondi
 * @version 0.0.1
 */
process.env.SECREATE_TOKEN = "hfufyufutruygyiugkhgyug";
import User from "../models/user.model";
import { registrationValidation, loginValidation } from "../misc/validation";
import bcrypt, { genSalt, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { generate } from "randomstring";
import { sendemail } from "../misc/mailler";


const projection = {
  password: 0,

  dateOfRegistration: 0,
  contacts: 0,
  blockedContacts: 0
};
/**
 *
 * @param {*} req incoming user request
 * @param {*} res server response
 * @param {*} next next middleware to be executed
 * @description used to create new user account i.e singup new users
 * @example  'using this url' -> host:4000/api/user/register
 * and passing {
 *                  "email": <user-email> ,
 *                  "password":<user-password> ,
 *                  "name" :<user-name>,
 *                  "profileImage":<user-profileImage>
 *             }
 */
export async function register_user(req, res) {
  //validate the user input
  /**@constant error this is returned by the registerValidation */
  const { error } = registrationValidation(req.body);
  if (error) return res.send(error.details[0].message).status(422);

  //check if the email already exists
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(422).send("email already exists");

  //encrpte the password

  const encrptedPass = await bcrypt.hash(req.body.password, 10);
  //generate a random string
  /**@constant */

  const secreateToken = generate();
  //flag the account as inactive
  //create a new user

  try {
    console.log(req.body);
    const name = Date.now() + " " + req.file.originalname;
    const image = `/uploads/${encodeURIComponent(name)}`;
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: encrptedPass,
      profileImage: image
    });
    //save the user
    await user.save();

    res
      .status(200)
      .send({ message: "registration sucessfull", token: secreateToken });
  } catch (error) {
    //catch errors if any
    res.status(400).send({ message: "registration unsucessfull", error });
  }
}
/**
 *
 * @param {*} req incoming user request
 * @param {*} res server response
 * @param {*} next next middleware to be executed
 * @description used to authenticate and authorize  user credential's
 * @example  'using this url' -> host:4000/api/user/login
 * and passing {
 *                  "email": <user-email> ,
 *                  "password":<user-password>
 *             }
 */
export async function log_in_user(req, res) {
  try {
    //validate the user input
    const { error } = loginValidation(req.body);
    if (error) return res.send(error.details[0].message);

    //check if the email doesn't exists
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send("Error authenticating please try again !");

    //check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass)
      return res.status(422).send("Error authenticating please try again !");

    //check if account is active
    // if (!user.active) return res.status(400).json({ message: 'Please activate your account first' });
    //create and assing an authentification token
    const token = sign({ _id: user._id }, process.env.SECREATE_TOKEN);

    res
      .header("AUTH_TOKEN", token)
      .send({ _id: user._id, token })
      .status(200);
  } catch (err) {
    console.log(err);
    res.status(408).json({ message: err });
  }
}
/**
 *
 * @param {*} req incoming user request
 * @param {*} res server response
 * @param {*} next next middleware to be executed
 * @description used to fetch a list of users profile information
 * @example  ' POST request using this url' -> host:4000/api/user/
 * and passing {
 *                  "userIds": [],
 *             }
 *
 */
export async function getUsers(req, res, next) {
  try {
    const users = await User.find(
      { _id: { $in: req.body.userIds } },
      { password: 0 }
    );
    if (!users) return res.json({ message: " users not found" }).status(404);
    res.json({ users }).status(200);
    next();
  } catch (error) {
    res.status(400).send("error getting users");
  }
}

/**
 *
 * @param {*} req incoming user request
 * @param {*} res server response
 * @param {*} next next middleware to be executed
 * @description used to fetch a particular user's profile information
 * @example  ' GET request using this url' -> host:4000/api/user/:id
 *
 */
export async function getUser(req, res, next) {
  try {
    const singleUser = await User.findById({ _id: req.params.id });
    if (!singleUser)
      return res.json({ message: " User not found" }).status(404);
    res.json({ singleUser }).status(200);
    next();
  } catch (error) {
    res.status(400).send("error getting user");
  }
}
/**
 *
 * @param {*} req incoming user request
 * @param {*} res server response
 * @param {*} next next middleware to be executed
 * @description used to modify/change user profile information
 * @example  'using this url' -> host:3000/api/user/
 * and passing {
 *                  "password": <new password>,
 *                  "profileImage": <new profileImage>
 *             }
 * the password or profile image are both optional and one or both can be sent in a particular request
 */
export async function changeUserProfile(req, res, next) {
  try {
    const { _id } = req.user;
    if (req.body.password) {
      //encrpte the password
      const salt = await genSalt(10);
      const encrptedPass = await hash(req.body.password, salt);
      await User.updateOne({ _id: _id }, { $set: { password: encrptedPass } });
    } else {
      const name = Date.now() + " " + req.file.originalname;
      const image = `/uploads/${encodeURIComponent(name)}`;
      await User.updateOne({ _id: _id }, { $set: { profileImage: image } });
    }

    const updatedProfile = await User.findOne(
      { _id },
      { password: 0 },
      { ...projection }
    );
    res.json({ updatedProfile }).status(200);
    next();
  } catch (error) {
    res.status(400).send("error while updating profile");
  }
}
/**
 *
 * @param {*} req incoming user request
 * @param {*} res server response
 * @param {*} next next middleware to be executed
 * @description forgotPass resets user's password and sends an email containing the new password
 * to the users email account
 * @example  'using this url' -> host:3000/api/user/forgotpass
 */
export async function forgotPass(req, res, next) {
  // try {
    const { email } = req.body;
    const secreateToken = generate(7);
    //encrpte the password
    const salt = await bcrypt.genSalt(10);
    const encrptedPass = await bcrypt.hash(secreateToken, salt);
    await User.updateOne(
      { email: email },
      { $set: { password: encrptedPass } }
    );
    const user = await User.findOne({ email: email });
    //compose an email
    const html = `
        Hello ${user.name},<br/>
        please enter the verification code below to acess your account
        please enter the following token<br/>
        Token:${secreateToken}<br/>
        Have a nice day.
        `;
    //send the email
      //  await sendemail(process.env.User,req.body.email,'Password Reset Request',html)
    res
      .json({
        message: "password changed successfully please check your email",
        secreateToken
      })
      .status(200);
  // } catch (error) {
  //   res.status(400).send("error while updating profile");
  // }
}
/**
 * @description used to search for new friends
 * @param {Request} req incoming user request
 * @param {Response} res server response
 * @example  'using this url' -> host:4000/api/user/friends
 *  and passing {
 *                  "name"?: <user-name>,
 *                  "email"?:<user-email>
 *             }
 */
export async function searchFriends(req, res) {
  try {
    const { name, email } = req.body;
    if (name) {
      //look for users with that name and return them to the user
      const users = await User.find({ name }, { ...projection });
      res.json({ result: users }).status(200);
    } else {
      //if name is not provided then we use the email to fetch the particular user
      const users = await User.find({ email }, { ...projection });
      res.json({ result: users }).status(200);
    }
  } catch (error) {
    res.status(400).send("error while extracting users");
  }
}
/**
 * @description used to add contact
 * @param {Request} req incoming user request
 * @param {Response} res server response
 * @example  'using this url' -> host:4000/api/user/friends/:id
 */
export async function addContact(req, res) {
  try {
    //extract a temporary list of user contact
    const { _id } = req.user;
    await updateUserContact(_id, req.body.userId);
    //update other user contacts
    await updateUserContact(req.body.userId, _id);
    const userDetails = await User.findById({ _id: _id }, { ...projection });
    res.json(userDetails).status(200);
  } catch (error) {
    res.status(400).send({ message: "error while updating contacts" });
  }
  async function updateUserContact(_id, userId) {
    if (_id === userId) throw Error("invalid operation");
    const user = await User.findById({ _id: _id }, { ...projection });
    const { contacts } = user;

    //add the new contact into the list
    const newContact = [...contacts, userId];
    //get unique array
    const uniqueContacts = Array.from(new Set(newContact));
    //update the user contact
    await User.updateOne({ _id: _id }, { $set: { contacts: uniqueContacts } });
  }
}

/**
 * @description used to block unwanted users from sending text's to the user
 * @param {Request} req incoming user request
 * @param {Response} res server response
 * @example  'using this url' -> host:4000/api/user/contacts/:id
 */
export async function blockContact(req, res) {
  try {
    const { _id } = req.user;
    const { userId } = req.body;
    if (_id === userId) throw Error("invalid operation");
    const user = await User.findById({ _id: _id });
    //extract a temporary list of user contact
    const { blockedContacts } = user;
    //add the new contact into the list
    const newContact = [...blockedContacts, userId];
    //get unique array
    const uniqueContacts = Array.from(new Set(newContact));
    //update the user contact
    await User.updateOne(
      { _id: _id },
      { $set: { blockedContacts: uniqueContacts } }
    );
  } catch (error) {
    res.status(400).send({ message: "error while updating contacts" });
  }
}
