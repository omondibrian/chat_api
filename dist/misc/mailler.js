"use strict";

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendemail = sendemail;

var _nodemailer = require("nodemailer");

var _dotenv = require("dotenv");

/**
 * @fileOverview it maneges the mailing services of the system.
 * @author brian omondi
 * @version 0.0.1
 */
// load env vars
(0, _dotenv.config)({
  path: "./config/config.env"
});
var transport = (0, _nodemailer.createTransport)({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD
  }
});

function sendemail(from, to, subject, html) {
  return new Promise(function (resolve, reject) {
    transport.sendMail({
      from: from,
      subject: subject,
      to: to,
      html: html
    }, function (err, info) {
      if (err) reject(err);
      resolve(info);
    });
  });
}
//# sourceMappingURL=mailler.js.map