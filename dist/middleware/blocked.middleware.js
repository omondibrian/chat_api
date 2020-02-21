"use strict";

require("core-js/modules/es.array.filter");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("regenerator-runtime/runtime");

var _user = _interopRequireDefault(require("../models/user.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var blocked =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res, next) {
    var _id, receipent, blockedContacts, user;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _id = req.user._id;
            _context.next = 4;
            return _user["default"].findOne({
              _id: req.body.receipentId
            });

          case 4:
            receipent = _context.sent;
            blockedContacts = receipent.blockedContacts;
            user = blockedContacts.filter(function (contact) {
              return contact._id === _id;
            });
            console.log(user);

            if (!(user.length > 0)) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("return", res.status(200).send({
              message: "your request is being processed"
            }));

          case 10:
            next();
            _context.next = 16;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 13]]);
  }));

  return function blocked(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _default = blocked;
exports["default"] = _default;
//# sourceMappingURL=blocked.middleware.js.map