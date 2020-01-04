/**
 * @fileOverview contains the various functions to manage the users route.
 * @author Brian omondi
 * @version 0.0.1
 */

import User from '../models/user.model';
import { registrationValidation, loginValidation } from '../misc/validation';
import bcrypt,{ genSalt, hash, } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import {generate} from 'randomstring';
import {sendemail} from '../misc/mailler';


/**
 * 
 * @param {*} req incoming user request
 * @param {*} res server response
 * @param {*} next next middleware to be executed  
 * @description used to create new user account i.e singup new users 
 * @example  'using this url' -> host:3000/api/user/register
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
    if (emailExists) return res.status(422).send('email already exists');

    //encrpte the password
    
    const encrptedPass = await bcrypt.hash(req.body.password, 10)
    //generate a random string
    /**@constant */ 
    const secreateToken = generate();
    //flag the account as inactive
    // console.log(req.file)
    //create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: encrptedPass,
        profileImage: req.file.path,        
    })
    try {
        //save the user
         await user.save();
       
        res.status(200).send({ message: 'registration sucessfull', token: secreateToken });
    } catch (error) {
        //catch errors if any
        res.status(400).send({ message:'registration unsucessfull',error})
    }

}
/**
 * 
 * @param {*} req incoming user request
 * @param {*} res server response
 * @param {*} next next middleware to be executed  
 * @description used to authenticate and authorize  user credential's 
 * @example  'using this url' -> host:3000/api/user/login
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
    if (!user) return res.status(400).send("Error authenticating please try again !");

    //check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(422).send('Error authenticating please try again');

    //check if account is active
    // if (!user.active) return res.status(400).json({ message: 'Please activate your account first' });
    //create and assing an authentification token
    const token = sign({ _id: user._id }, process.env.SECREATE_TOKEN)
    res.header('AUTH_TOKEN', token).send({token}).status(200)

    
} catch (error) {
    res.status(400).json({message:error})
}
}
/**
 * 
 * @param {*} req incoming user request
 * @param {*} res server response
 * @param {*} next next middleware to be executed  
 * @description used to fetch a list of users profile information
 * @example  'using this url' -> host:3000/api/user/
 * and passing {
 *                  "userIds": [],     
 *             } 
 * 
 */
export async function getUsers(req,res,next){
    try {
        const users = await User.find({_id:{$in:req.body.userIds}});
        if(!users) return res.json({message:" users not found"}).status(404);
        res.json({users}).status(200);
        next();
    } catch (error) {
        res.status(400).send('error getting users')
    }

}

/**
 * 
 * @param {*} req incoming user request
 * @param {*} res server response
 * @param {*} next next middleware to be executed  
 * @description used to fetch a particular user's profile information
 * @example  'using this url' -> host:3000/api/user/:id
 * 
 */
export async function getUser(req,res,next){
    try {
        const singleUser = await User.findById({ _id : req.params.id});
        if(!singleUser) return res.json({message:" User not found"}).status(404);
        res.json({singleUser}).status(200);
        next();
    } catch (error) {
        res.status(400).send('error getting user')
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
export async function changeUserProfile(req,res,next){
    try {
        const { _id } = req.user;
        if(req.body.password){
            //encrpte the password
            const salt = await genSalt(10);
            const encrptedPass = await hash(req.body.password, salt);
            await User.updateOne({ _id: _id }, { $set: { password: encrptedPass } });
            
        }
        else{
            await User.updateOne({ _id: _id }, { $set: { profileImage: req.file.path } });
            
        }
       
        const updatedProfile =  await User.findOne({_id});
        res.json({updatedProfile}).status(200);
       next();
    } catch (error) {
        res.status(400).send('error while updating profile')

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
export async function forgotPass(req,res,next){
    try {
        const { email } = req.body;
        const secreateToken = generate(7);
        //encrpte the password
        const salt = await bcrypt.genSalt(10);
        const encrptedPass = await bcrypt.hash(secreateToken, salt);
        await User.updateOne({ email: email }, { $set: { password: encrptedPass } });
        const user= await  User.findOne({ email: email })
        //compose an email
        const html = `
        Hello ${user.name},<br/>
        please enter the verification code below to acess your account
        please enter the following token<br/>
        Token:${secreateToken}<br/>
        Have a nice day.
        `
        //send the email
       await sendemail('eucossaplatform@gmail.com',req.body.email,'Password Reset Request',html)
        res.json({ message:"password changed successfully please check your email",secreateToken:secreateToken }).status(200);
    } catch (error) {
      next(error);  
    }
}

/**used to change the role of the particular user */
// export async function changeUserRole(req,res,next){
//   try {
//       const user = await update({ _id: req.body.id }, { $set: { role: 'admin' } });
//       res.status(200).json({
//           user
//       })
//   } catch (error) {
//       next(error)
//   }
// }
/**this function is used to activate newly created accounts */
// export async function activateAccount(req, res,next) {
//    try {
//        /**@constant */
//        const { secreateToken } = req.body;
//        //find the specific user to whom the secreate token belongs to
//        /**@constant */
//        const inactiveUser = await findOne({ secreateToken: secreateToken });
//        if (!inactiveUser) return res.status(404).json({
//            message: 'User not Found please ensure that the token is correct'
//        })
//        //if the user is there we activate the account
//        inactiveUser.active = true;
//        inactiveUser.secreateToken = '';
//        await inactiveUser.save();
//        res.status(200).json({ message: "successfully activated your account" }); 
//    } catch (error) {
//        next(error);
//    }

// }