"use strict";

require("core-js/modules/es.array.find");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChats = getChats;
exports.makeNewChat = makeNewChat;
exports.getSingleChat = getSingleChat;
exports.deleteSingleChat = deleteSingleChat;
exports.deleteSingleConversation = deleteSingleConversation;
exports.likeChat = likeChat;
exports.markAsRead = markAsRead;
exports.getNewChats = getNewChats;

require("regenerator-runtime/runtime");

var _chats = _interopRequireDefault(require("../models/chats.models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 *
 * @param {*} req incoming user request
 * @param {*} res server response
 * @description used to fetch a list of chats
 * @example  'using this url' -> host:4000/api/chats/
 *
 */
function getChats(_x, _x2) {
  return _getChats.apply(this, arguments);
}
/**
 *
 * @param {*} req incoming user request
 * @param {*} res server response
 * @description used to create new chat
 * @example  'using this url' -> host:3000/api/chats/
 * and passing {
 *                  "text": <text> ,
 *                  "receipentId":<receipentId> ,
 *             }
 */


function _getChats() {
  _getChats = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var _id, chats;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _id = req.user._id;
            _context.prev = 1;
            _context.next = 4;
            return _chats["default"].find({
              $or: [{
                receipentId: _id
              }, {
                SenderId: _id
              }]
            });

          case 4:
            chats = _context.sent;
            res.json({
              chats: chats,
              user: req.user
            }).status(200);
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](1);
            res.status(400).json({
              message: _context.t0
            });

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 8]]);
  }));
  return _getChats.apply(this, arguments);
}

function makeNewChat(_x3, _x4) {
  return _makeNewChat.apply(this, arguments);
}
/**
 *
 * @param {*} req incoming user request
 * @param {*} res server response
 * @description used to fetch single chat
 * @example  'using this url' -> host:3000/api/chats/:id
 */


function _makeNewChat() {
  _makeNewChat = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var image, chat, savedchat;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            image = "";

            try {
              req.file.path ? image = req.file.path : null;
            } catch (error) {
              image = "";
            } //create a new chat


            chat = new _chats["default"]({
              text: req.body.text,
              SenderId: req.user._id,
              receipentId: req.body.receipentId,
              imageUrl: image
            });
            _context2.prev = 3;
            _context2.next = 6;
            return chat.save();

          case 6:
            savedchat = _context2.sent;
            res.status(200).send({
              chatId: savedchat._id
            });
            _context2.next = 13;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](3);
            //catch errors if any
            res.status(400).send(_context2.t0);

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 10]]);
  }));
  return _makeNewChat.apply(this, arguments);
}

function getSingleChat(_x5, _x6) {
  return _getSingleChat.apply(this, arguments);
}
/**
 *
 * @param {*} req incoming user request
 * @param {*} res server response
 * @description used to delete single chat
 * @example  'using this url' -> host:3000/api/chats/:id
 */


function _getSingleChat() {
  _getSingleChat = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res) {
    var chatId, chats;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            chatId = req.params.id;
            _context3.next = 3;
            return _chats["default"].findOne({
              _id: chatId
            });

          case 3:
            chats = _context3.sent;
            res.json({
              chats: chats,
              user: req.user
            }).status(200);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _getSingleChat.apply(this, arguments);
}

function deleteSingleChat(_x7, _x8) {
  return _deleteSingleChat.apply(this, arguments);
}
/**
 *
 * @param {*} req incoming user request
 * @param {*} res server response
 * @description used to delete single conversation between the user and the receiver
 * @example  'using this url' -> host:4000/api/chats/conv/
 */


function _deleteSingleChat() {
  _deleteSingleChat = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res) {
    var chatId, chats;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            chatId = req.params.id;
            _context4.next = 3;
            return _chats["default"].findOneAndRemove({
              _id: chatId
            }, {
              useFindAndModify: false
            });

          case 3:
            chats = _context4.sent;
            res.json({
              chats: chats,
              user: req.user
            }).status(200);

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _deleteSingleChat.apply(this, arguments);
}

function deleteSingleConversation(_x9, _x10) {
  return _deleteSingleConversation.apply(this, arguments);
}
/**
 *
 * @param {*} req incoming user request
 * @param {*} res server response
 * @description used to like single chat between the user and the receiver
 * @example  'using this url' -> host:4000/api/chats/likeChat/
 */


function _deleteSingleConversation() {
  _deleteSingleConversation = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(req, res) {
    var chats;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _chats["default"].deleteMany({
              $and: [{
                SenderId: req.body.SenderId
              }, {
                receipentId: req.body.receipentId
              }]
            }, {
              useFindAndModify: false
            });

          case 2:
            chats = _context5.sent;
            res.json({
              chats: chats,
              user: req.user
            }).status(200);

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _deleteSingleConversation.apply(this, arguments);
}

function likeChat(_x11, _x12) {
  return _likeChat.apply(this, arguments);
}
/**
 *
 * @param {*} req incoming user request
 * @param {*} res server response
 * @description used to mark chat between the user and the receiver as read
 * @example  'using this url' -> host:4000/api/chats/marlAsRead/
 */


function _likeChat() {
  _likeChat = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(req, res) {
    var _id, chat, isLiked;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _id = req.body._id;
            _context6.prev = 1;
            _context6.next = 4;
            return _chats["default"].findById({
              _id: _id
            });

          case 4:
            chat = _context6.sent;
            isLiked = chat.isLiked;
            _context6.next = 8;
            return _chats["default"].updateOne({
              _id: _id
            }, {
              $set: {
                isLiked: !isLiked
              }
            });

          case 8:
            res.json({
              message: "chat updated successfully"
            }).status(200);
            _context6.next = 14;
            break;

          case 11:
            _context6.prev = 11;
            _context6.t0 = _context6["catch"](1);
            res.send(new Error("error performing operation"));

          case 14:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[1, 11]]);
  }));
  return _likeChat.apply(this, arguments);
}

function markAsRead(_x13, _x14) {
  return _markAsRead.apply(this, arguments);
}

function _markAsRead() {
  _markAsRead = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(req, res) {
    var _id;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _id = req.body._id;
            _context7.prev = 1;
            _context7.next = 4;
            return _chats["default"].updateOne({
              _id: _id
            }, {
              $set: {
                isRead: true
              }
            });

          case 4:
            res.json({
              message: "chat updated successfully"
            }).status(200);
            _context7.next = 10;
            break;

          case 7:
            _context7.prev = 7;
            _context7.t0 = _context7["catch"](1);
            res.send(new Error("error performing operation"));

          case 10:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[1, 7]]);
  }));
  return _markAsRead.apply(this, arguments);
}

function getNewChats(_x15) {
  return _getNewChats.apply(this, arguments);
}

function _getNewChats() {
  _getNewChats = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(_id) {
    var chats;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return _chats["default"].find({});

          case 3:
            chats = _context8.sent;
            console.log("chatscontroller", chats);
            return _context8.abrupt("return", chats);

          case 8:
            _context8.prev = 8;
            _context8.t0 = _context8["catch"](0);
            throw new Error("unable to get new chats");

          case 11:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 8]]);
  }));
  return _getNewChats.apply(this, arguments);
}
//# sourceMappingURL=chats.controller.js.map