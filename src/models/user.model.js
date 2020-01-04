/**
 * @fileOverview  it describes the users schema i.e how data will be structured in 
 * the mongoose database
 * @author brian omondi
 * @version 0.0.1
 */

import { Schema , model } from 'mongoose';


const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        min:6,
        max:255
    },

    email:{
        type:String,
        required:true,
        min:6,
        max:255
    },
    password:{
        type:String,
        required:true,
        max:1024,
        min:6
    },
    dateOfRegistration:{
        type:Date,
        default:Date.now
    },
    profileImage:{type:String}
})
export default model('User',userSchema)