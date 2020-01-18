/**
 * @fileOverview this is the main file and serves as the root entry point of the application
 * @author brian omondi
 * @version 0.0.1
 */

import express, { json } from "express";
const app = express();
import { config } from 'dotenv';
import { connect, connection } from 'mongoose';
import * as dotenv from 'dotenv';

// load env vars
dotenv.config({ path: './config/config.env' });
//import custom routes
import AuthRoutes from './src/routes/auth.routes';
import ChatsRoutes from './src/routes/chat.routes';
import verify from './src/middleware/verfyToken.middleware';
const Port = process.env.PORT || 4000;
// express.response.setHeader('X-Powered-By', 'snapShare');
//conect mongoDb
connect( process.env.CONNECTION_STRING_2, { useNewUrlParser: true, useUnifiedTopology: true  });

connection.once('open', function () {
    console.log(' Database connection made sucessfull');
   
}).on('error', function (error) {
    console.log('connection error:', error)
})
//middlewares
app.use('/uploads', express.static('uploads'))
app.use(json());

//route middleware
app.use('/api/user',AuthRoutes);
app.use('/api/chats',verify,ChatsRoutes);


app.listen(Port,()=>{
    console.log(`server up and running on port ${Port}`)
});