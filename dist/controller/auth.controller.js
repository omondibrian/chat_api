"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.find");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.define-properties");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-own-property-descriptors");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.set");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register_user = register_user;
exports.log_in_user = log_in_user;
exports.getUsers = getUsers;
exports.getUser = getUser;
exports.changeUserProfile = changeUserProfile;
exports.forgotPass = forgotPass;
exports.searchFriends = searchFriends;
exports.addContact = addContact;
exports.blockContact = blockContact;

require("regenerator-runtime/runtime");

var _user = _interopRequireDefault(require("../models/user.model"));

var _validation = require("../misc/validation");

var _bcryptjs = _interopRequireWildcard(require("bcryptjs"));

var _jsonwebtoken = require("jsonwebtoken");

var _randomstring = require("randomstring");

var _minio = require("../misc/minio");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @fileOverview contains the various functions to manage the users route.
 * @author Brian omondi
 * @version 0.0.1
 */
process.env.SECREATE_TOKEN = 'hfufyufutruygyiugkhgyug';
var minioBucket = "image-storage";
var projection = {
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

function register_user(_x, _x2) {
  return _register_user.apply(this, arguments);
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


function _register_user() {
  _register_user = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var _registrationValidati, error, emailExists, encrptedPass, secreateToken, minio, image, user;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            //validate the user input

            /**@constant error this is returned by the registerValidation */
            _registrationValidati = (0, _validation.registrationValidation)(req.body), error = _registrationValidati.error;

            if (!error) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", res.send(error.details[0].message).status(422));

          case 3:
            _context.next = 5;
            return _user["default"].findOne({
              email: req.body.email
            });

          case 5:
            emailExists = _context.sent;

            if (!emailExists) {
              _context.next = 8;
              break;
            }

            return _context.abrupt("return", res.status(422).send("email already exists"));

          case 8:
            _context.next = 10;
            return _bcryptjs["default"].hash(req.body.password, 10);

          case 10:
            encrptedPass = _context.sent;
            //generate a random string

            /**@constant */
            secreateToken = (0, _randomstring.generate)(); //flag the account as inactive
            //create a new user
            // try {

            if (!req.file) {
              _context.next = 24;
              break;
            }

            console.log(req.body);
            _context.next = 16;
            return (0, _minio.initMinIO)();

          case 16:
            minio = _context.sent;
            _context.next = 19;
            return minio.putObject(minioBucket, req.file.originalname, req.file.buffer);

          case 19:
            image = "/uploads/".concat(encodeURIComponent(req.file.originalname));
            user = new _user["default"]({
              name: req.body.name,
              email: req.body.email,
              password: encrptedPass,
              profileImage: image
            }); //save the user

            _context.next = 23;
            return user.save();

          case 23:
            res.status(200).send({
              message: "registration sucessfull",
              token: secreateToken
            });

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _register_user.apply(this, arguments);
}

function log_in_user(_x3, _x4) {
  return _log_in_user.apply(this, arguments);
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


function _log_in_user() {
  _log_in_user = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var _loginValidation, error, user, validPass, token;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            //validate the user input
            _loginValidation = (0, _validation.loginValidation)(req.body), error = _loginValidation.error;

            if (!error) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt("return", res.send(error.details[0].message));

          case 4:
            _context2.next = 6;
            return _user["default"].findOne({
              email: req.body.email
            });

          case 6:
            user = _context2.sent;

            if (user) {
              _context2.next = 9;
              break;
            }

            return _context2.abrupt("return", res.status(400).send("Error authenticating please try again !"));

          case 9:
            _context2.next = 11;
            return _bcryptjs["default"].compare(req.body.password, user.password);

          case 11:
            validPass = _context2.sent;

            if (validPass) {
              _context2.next = 14;
              break;
            }

            return _context2.abrupt("return", res.status(422).send("Error authenticating please try again !"));

          case 14:
            console.log(req.body); //check if account is active
            // if (!user.active) return res.status(400).json({ message: 'Please activate your account first' });
            //create and assing an authentification token

            token = (0, _jsonwebtoken.sign)({
              _id: user._id
            }, process.env.SECREATE_TOKEN);
            console.log('finished');
            res.header("AUTH_TOKEN", token).send({
              _id: user._id,
              token: token
            }).status(200);
            _context2.next = 24;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            res.status(408).json({
              message: _context2.t0
            });

          case 24:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 20]]);
  }));
  return _log_in_user.apply(this, arguments);
}

function getUsers(_x5, _x6, _x7) {
  return _getUsers.apply(this, arguments);
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


function _getUsers() {
  _getUsers = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res, next) {
    var users;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _user["default"].find({
              _id: {
                $in: req.body.userIds
              }
            }, {
              password: 0
            });

          case 3:
            users = _context3.sent;

            if (users) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt("return", res.json({
              message: " users not found"
            }).status(404));

          case 6:
            res.json({
              users: users
            }).status(200);
            next();
            _context3.next = 13;
            break;

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](0);
            res.status(400).send("error getting users");

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 10]]);
  }));
  return _getUsers.apply(this, arguments);
}

function getUser(_x8, _x9, _x10) {
  return _getUser.apply(this, arguments);
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


function _getUser() {
  _getUser = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res, next) {
    var singleUser;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _user["default"].findById({
              _id: req.params.id
            });

          case 3:
            singleUser = _context4.sent;

            if (singleUser) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt("return", res.json({
              message: " User not found"
            }).status(404));

          case 6:
            res.json({
              singleUser: singleUser
            }).status(200);
            next();
            _context4.next = 13;
            break;

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](0);
            res.status(400).send("error getting user");

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 10]]);
  }));
  return _getUser.apply(this, arguments);
}

function changeUserProfile(_x11, _x12, _x13) {
  return _changeUserProfile.apply(this, arguments);
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


function _changeUserProfile() {
  _changeUserProfile = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(req, res, next) {
    var _id, salt, encrptedPass, updatedProfile;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _id = req.user._id;

            if (!req.body.password) {
              _context5.next = 13;
              break;
            }

            _context5.next = 5;
            return (0, _bcryptjs.genSalt)(10);

          case 5:
            salt = _context5.sent;
            _context5.next = 8;
            return (0, _bcryptjs.hash)(req.body.password, salt);

          case 8:
            encrptedPass = _context5.sent;
            _context5.next = 11;
            return _user["default"].updateOne({
              _id: _id
            }, {
              $set: {
                password: encrptedPass
              }
            });

          case 11:
            _context5.next = 15;
            break;

          case 13:
            _context5.next = 15;
            return _user["default"].updateOne({
              _id: _id
            }, {
              $set: {
                profileImage: req.file.path
              }
            });

          case 15:
            _context5.next = 17;
            return _user["default"].findOne({
              _id: _id
            }, {
              password: 0
            }, _objectSpread({}, projection));

          case 17:
            updatedProfile = _context5.sent;
            res.json({
              updatedProfile: updatedProfile
            }).status(200);
            next();
            _context5.next = 25;
            break;

          case 22:
            _context5.prev = 22;
            _context5.t0 = _context5["catch"](0);
            res.status(400).send("error while updating profile");

          case 25:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 22]]);
  }));
  return _changeUserProfile.apply(this, arguments);
}

function forgotPass(_x14, _x15, _x16) {
  return _forgotPass.apply(this, arguments);
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


function _forgotPass() {
  _forgotPass = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(req, res, next) {
    var email, secreateToken, salt, encrptedPass, user, html;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            email = req.body.email;
            secreateToken = (0, _randomstring.generate)(7); //encrpte the password

            _context6.next = 5;
            return _bcryptjs["default"].genSalt(10);

          case 5:
            salt = _context6.sent;
            _context6.next = 8;
            return _bcryptjs["default"].hash(secreateToken, salt);

          case 8:
            encrptedPass = _context6.sent;
            _context6.next = 11;
            return _user["default"].updateOne({
              email: email
            }, {
              $set: {
                password: encrptedPass
              }
            });

          case 11:
            _context6.next = 13;
            return _user["default"].findOne({
              email: email
            });

          case 13:
            user = _context6.sent;
            //compose an email
            html = "\n        Hello ".concat(user.name, ",<br/>\n        please enter the verification code below to acess your account\n        please enter the following token<br/>\n        Token:").concat(secreateToken, "<br/>\n        Have a nice day.\n        "); //send the email
            //    await sendemail(process.env.User,req.body.email,'Password Reset Request',html)

            res.json({
              message: "password changed successfully please check your email",
              secreateToken: secreateToken
            }).status(200);
            _context6.next = 21;
            break;

          case 18:
            _context6.prev = 18;
            _context6.t0 = _context6["catch"](0);
            res.status(400).send("error while updating profile");

          case 21:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 18]]);
  }));
  return _forgotPass.apply(this, arguments);
}

function searchFriends(_x17, _x18) {
  return _searchFriends.apply(this, arguments);
}
/**
 * @description used to add contact
 * @param {Request} req incoming user request
 * @param {Response} res server response
 * @example  'using this url' -> host:4000/api/user/friends/:id
 */


function _searchFriends() {
  _searchFriends = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(req, res) {
    var _req$body, name, email, users, _users;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _req$body = req.body, name = _req$body.name, email = _req$body.email;

            if (!name) {
              _context7.next = 9;
              break;
            }

            _context7.next = 5;
            return _user["default"].find({
              name: name
            }, _objectSpread({}, projection));

          case 5:
            users = _context7.sent;
            res.json({
              result: users
            }).status(200);
            _context7.next = 13;
            break;

          case 9:
            _context7.next = 11;
            return _user["default"].find({
              email: email
            }, _objectSpread({}, projection));

          case 11:
            _users = _context7.sent;
            res.json({
              result: _users
            }).status(200);

          case 13:
            _context7.next = 18;
            break;

          case 15:
            _context7.prev = 15;
            _context7.t0 = _context7["catch"](0);
            res.status(400).send("error while extracting users");

          case 18:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 15]]);
  }));
  return _searchFriends.apply(this, arguments);
}

function addContact(_x19, _x20) {
  return _addContact.apply(this, arguments);
}
/**
 * @description used to block unwanted users from sending text's to the user
 * @param {Request} req incoming user request
 * @param {Response} res server response
 * @example  'using this url' -> host:4000/api/user/contacts/:id
 */


function _addContact() {
  _addContact = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(req, res) {
    var _id, userDetails, updateUserContact, _updateUserContact;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _updateUserContact = function _ref2() {
              _updateUserContact = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee8(_id, userId) {
                var user, contacts, newContact, uniqueContacts;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        if (!(_id === userId)) {
                          _context8.next = 2;
                          break;
                        }

                        throw Error("invalid operation");

                      case 2:
                        _context8.next = 4;
                        return _user["default"].findById({
                          _id: _id
                        }, _objectSpread({}, projection));

                      case 4:
                        user = _context8.sent;
                        contacts = user.contacts; //add the new contact into the list

                        newContact = [].concat(_toConsumableArray(contacts), [userId]); //get unique array

                        uniqueContacts = Array.from(new Set(newContact)); //update the user contact

                        _context8.next = 10;
                        return _user["default"].updateOne({
                          _id: _id
                        }, {
                          $set: {
                            contacts: uniqueContacts
                          }
                        });

                      case 10:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8);
              }));
              return _updateUserContact.apply(this, arguments);
            };

            updateUserContact = function _ref(_x23, _x24) {
              return _updateUserContact.apply(this, arguments);
            };

            _context9.prev = 2;
            //extract a temporary list of user contact
            _id = req.user._id;
            _context9.next = 6;
            return updateUserContact(_id, req.body.userId);

          case 6:
            _context9.next = 8;
            return updateUserContact(req.body.userId, _id);

          case 8:
            _context9.next = 10;
            return _user["default"].findById({
              _id: _id
            }, _objectSpread({}, projection));

          case 10:
            userDetails = _context9.sent;
            res.json(userDetails).status(200);
            _context9.next = 17;
            break;

          case 14:
            _context9.prev = 14;
            _context9.t0 = _context9["catch"](2);
            res.status(400).send({
              message: "error while updating contacts"
            });

          case 17:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[2, 14]]);
  }));
  return _addContact.apply(this, arguments);
}

function blockContact(_x21, _x22) {
  return _blockContact.apply(this, arguments);
}

function _blockContact() {
  _blockContact = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(req, res) {
    var _id, userId, user, blockedContacts, newContact, uniqueContacts;

    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            _id = req.user._id;
            userId = req.body.userId;

            if (!(_id === userId)) {
              _context10.next = 5;
              break;
            }

            throw Error("invalid operation");

          case 5:
            _context10.next = 7;
            return _user["default"].findById({
              _id: _id
            });

          case 7:
            user = _context10.sent;
            //extract a temporary list of user contact
            blockedContacts = user.blockedContacts; //add the new contact into the list

            newContact = [].concat(_toConsumableArray(blockedContacts), [userId]); //get unique array

            uniqueContacts = Array.from(new Set(newContact)); //update the user contact

            _context10.next = 13;
            return _user["default"].updateOne({
              _id: _id
            }, {
              $set: {
                blockedContacts: uniqueContacts
              }
            });

          case 13:
            _context10.next = 18;
            break;

          case 15:
            _context10.prev = 15;
            _context10.t0 = _context10["catch"](0);
            res.status(400).send({
              message: "error while updating contacts"
            });

          case 18:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[0, 15]]);
  }));
  return _blockContact.apply(this, arguments);
}
//# sourceMappingURL=auth.controller.js.map