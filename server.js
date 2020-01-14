/**
 * @fileOverview this is the main file and serves as the root entry point of the application
 * @author brian omondi
 * @version 0.0.1
 */

import express, { json } from "express";
const app = express();
import { config } from 'dotenv';
import { Promise, connect, connection } from 'mongoose';


//import custom routes
import AuthRoutes from './src/routes/auth.routes';
import ChatsRoutes from './src/routes/chat.routes';
import verify from './src/middleware/verfyToken.middleware';
config();

//conect mongoDb
connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true  });

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


app.listen(4000,()=>{
    console.log('server up and running on port 3000')
});