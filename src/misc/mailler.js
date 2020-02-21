/**
 * @fileOverview it maneges the mailing services of the system.
 * @author brian omondi
 * @version 0.0.1
 */

import { createTransport } from "nodemailer";
import { config } from "dotenv";
// load env vars
config({ path: "./config/config.env" });
const transport = createTransport({ 
  service:"gmail", 
  auth: {
    user:process.env.USER,
    pass: process.env.PASSWORD
  }
});

export function sendemail(from, to, subject, html) {
  return new Promise((resolve, reject) => {
    transport.sendMail({ from, subject, to, html }, (err, info) => {
      if (err) reject(err);
      resolve(info);
    });
  });
}
