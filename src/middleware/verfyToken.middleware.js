/**
 * @fileOverview contains all the custom middleware used in the application
 * @author Eucossa
 * @version 0.0.1
 */

import { verify } from 'jsonwebtoken';

export default (req,res,next) => {
    const token = req.header('AUTH_TOKEN');
    if(!token) return res.status(401).send('ACCESS DENIED');

    try {
        const verifiedToken = verify(token, process.env.SECREATE_TOKEN);
        req.user = verifiedToken;
      
        next()
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}