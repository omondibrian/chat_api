"use strict";

require("core-js/modules/es.array.find");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteChat = exports.createChat = exports.getUserChats = exports.getsingleChat = exports.saveChat = void 0;

require("regenerator-runtime/runtime");

var _chats = _interopRequireDefault(require("../models/chats.models"));

var _jsonwebtoken = require("jsonwebtoken");

var _this = void 0;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// const chat = await getsingleChat(token,chatId)

/**
 * @param {String} token user auth token
 * @private method of the class
 * @description use to varify the validity of the jwt passed
 * @returns {Boolean} either true if valid token or false if otherwise
 */
var tokenVerifyer = function tokenVerifyer(token) {
  try {
    var verifiedToken = (0, _jsonwebtoken.verify)(token, process.env.SECREATE_TOKEN);
    if (verifiedToken) return true;
  } catch (e) {
    return false;
  }
};
/**
 * @param {Document} chat chat document to be saved
 * @private method of the class
 * @description used to save the chat document into the collection
 */


var saveChat =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(chat) {
    var savedchat;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return chat.save();

          case 3:
            savedchat = _context.sent;
            return _context.abrupt("return", savedchat);

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            throw new TypeError("error saving chat");

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
  }));

  return function saveChat(_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @param {String} token the user auth token used to check for authencity of the user
 * @param {String} chatId chat to be fetched
 * @public method of the class
 * @returns {Document}  an array of user chats
 * @throws  invalid token exeception
 * @description used to fetch single user chat from the chats collection
 *
 */


exports.saveChat = saveChat;

var getsingleChat = function getsingleChat(token, chatId) {
  var isVarified = tokenVerifyer(token);

  if (!isVarified) {
    throw new TypeError("invalid token");
  }

  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(resolve, reject) {
      var chat;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return _chats["default"].find({
                _id: chatId
              });

            case 3:
              chat = _context2.sent;
              resolve(chat);
              _context2.next = 10;
              break;

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](0);
              reject(_context2.t0);

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 7]]);
    }));

    return function (_x2, _x3) {
      return _ref2.apply(this, arguments);
    };
  }());
};
/**
 * @public method
 * @param {String} token the user auth token used to check for authencity of the user
 * @returns {Document[]}  an array of user chats
 * @throws  invalid token exeception
 * @description used to retrive user chats
 */


exports.getsingleChat = getsingleChat;

var getUserChats = function getUserChats(token) {
  var isVarified = tokenVerifyer(token);

  if (!isVarified) {
    throw new TypeError("invalid token");
  }

  var _verify = (0, _jsonwebtoken.verify)(token, process.env.SECREATE_TOKEN),
      _id = _verify._id;

  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(resolve, reject) {
      var chats;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return _chats["default"].find({
                receipentId: _id
              });

            case 3:
              chats = _context3.sent;
              resolve(chats);
              _context3.next = 10;
              break;

            case 7:
              _context3.prev = 7;
              _context3.t0 = _context3["catch"](0);
              reject(new TypeError("error while processing your chats"));

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 7]]);
    }));

    return function (_x4, _x5) {
      return _ref3.apply(this, arguments);
    };
  }());
};
/**
 * @public method
 * @param {String} token the user auth token used to check for authencity of the user
 * @param {*} data the payload received from the user
 * @returns {Document}  newly created user chat
 * @description create new user chats
 * @throws  invalid token exeception
 */


exports.getUserChats = getUserChats;

var createChat = function createChat(token, data) {
  var _verify2 = (0, _jsonwebtoken.verify)(token, process.env.SECREATE_TOKEN),
      _id = _verify2._id; //check if token is valid


  var isVarified = _this.tokenVerifyer(token);

  if (isVarified) {
    throw new TypeError("invalid token");
  } //if token is valid then the user message is saved in the persistance storage


  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(resolve, reject) {
      var chat, newChat;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              //create a new chat
              chat = new _chats["default"]({
                text: data.text,
                SenderId: _id,
                receipentId: data.receipentId,
                imageUrl: data.imageUrl || ""
              });
              _context4.next = 4;
              return _this.saveChat(chat);

            case 4:
              newChat = _context4.sent;
              resolve(newChat);
              _context4.next = 11;
              break;

            case 8:
              _context4.prev = 8;
              _context4.t0 = _context4["catch"](0);
              reject(new TypeError("error while creating your message"));

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[0, 8]]);
    }));

    return function (_x6, _x7) {
      return _ref4.apply(this, arguments);
    };
  }());
};
/**
 * @public method
 * @param {String} token the user auth token used to check for authencity of the user
 * @param {String} chatId chat id to be deleted
 * @returns {String}  newly created user chat
 * @description deleted specific user chat
 * @throws  invalid token exeception
 */


exports.createChat = createChat;

var deleteChat = function deleteChat(token, chatId) {
  //check if token is valid
  var isVarified = _this.tokenVerifyer(token);

  if (isVarified) {
    throw new TypeError("invalid token");
  } //return delete the chat from persistance storage


  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref5 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(resolve, reject) {
      var _ref6, _id;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return _chats["default"].findOneAndRemove({
                _id: chatId
              }, {
                useFindAndModify: false
              });

            case 3:
              _ref6 = _context5.sent;
              _id = _ref6._id;
              resolve({
                _id: _id
              });
              _context5.next = 11;
              break;

            case 8:
              _context5.prev = 8;
              _context5.t0 = _context5["catch"](0);
              reject(new TypeError("error while removing chat "));

            case 11:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[0, 8]]);
    }));

    return function (_x8, _x9) {
      return _ref5.apply(this, arguments);
    };
  }());
};

exports.deleteChat = deleteChat;
//# sourceMappingURL=chatsDao.js.map