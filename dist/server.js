"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require("core-js/modules/es.array.concat");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("regenerator-runtime/runtime");

var _mongoose = require("mongoose");

var dotenv = _interopRequireWildcard(require("dotenv"));

var _http = _interopRequireDefault(require("http"));

var _socket = _interopRequireDefault(require("socket.io"));

var _app = _interopRequireDefault(require("./app"));

var _redis = require("redis");

var _chatsDao = require("./misc/chatsDao");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var server = _http["default"].Server(_app["default"]); // load env vars


dotenv.config({
  path: "config/config.env"
});
var MONGODB_URL = process.env.CONNECTION_STRING || "mongodb://localhost/snapshare";
var Port = process.env.PORT || 4000;
var REDIS_PORT = process.env.PORT || 6379; //setup the redis client

var client = (0, _redis.createClient)(REDIS_PORT); // express.response.setHeader('X-Powered-By', 'snapShare');
//conect mongoDb

(0, _mongoose.connect)(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

_mongoose.connection.once("open", function () {
  console.log(" Database connection made sucessfull");
}).on("error", function (error) {
  console.log("connection error:", error);
});

server.listen(Port, function () {
  console.log("server up and running on port ".concat(Port));
}); //socket setup

var io = (0, _socket["default"])(server);
io.on("connection", function (socket) {
  //fire 'online'event to notify all connected friends
  socket.on("online", function (data) {
    var _id = data._id; //add user to redis cache

    client.setex(_id, 3600, socket.id);
  }); // Fire 'send' event for updating Message list in UI

  socket.on("message", function (data) {
    console.log("data", data);
    var _id = data._id,
        chatId = data.chatId,
        token = data.token;

    try {
      client.get(_id,
      /*#__PURE__*/
      function () {
        var _ref = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(err, socketId) {
          var chat;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!err) {
                    _context.next = 2;
                    break;
                  }

                  throw err;

                case 2:
                  if (!(socketId !== null)) {
                    _context.next = 8;
                    break;
                  }

                  _context.next = 5;
                  return (0, _chatsDao.getsingleChat)(token, chatId);

                case 5:
                  chat = _context.sent;
                  console.log("chatid = ".concat(chatId, " and its chat=").concat(chat));
                  io.to("".concat(socketId)).emit("incoming_message", chat);

                case 8:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
    } catch (err) {
      console.log(err);
    }
  }); // Fire 'typing' event for updating the UI

  socket.on("typing", function (data) {
    var _id = data._id;
    getSocketIdAndExecuteEvent(_id, function (socketId) {
      io.to("".concat(socketId)).emit("typed");
    });
  }); //check for new unread messages , friend requests or accepted requests

  socket.on("notifications",
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(data) {
      var token, _id, newChats;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              token = data.token, _id = data._id;
              _context2.prev = 1;
              _context2.next = 4;
              return (0, _chatsDao.getUserChats)(token);

            case 4:
              newChats = _context2.sent;
              getSocketIdAndExecuteEvent(_id, function (socketId) {
                io.to("".concat(socketId)).emit("newNotification", newChats);
              });
              _context2.next = 11;
              break;

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](1);
              console.log(_context2.t0);

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[1, 8]]);
    }));

    return function (_x3) {
      return _ref2.apply(this, arguments);
    };
  }());
});

function getSocketIdAndExecuteEvent(_id, cb, data) {
  try {
    client.get(_id, function (err, socketId) {
      if (err) throw err;

      if (socketId !== null) {
        cb(socketId, data);
      }
    });
  } catch (err) {
    console.log(err);
  }
}
//# sourceMappingURL=server.js.map