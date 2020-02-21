"use strict";

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/web.timers");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initMinIO = initMinIO;

require("regenerator-runtime/runtime");

var _minio = require("minio");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var minioHost = process.env.MINIO_HOST || 'localhost';
var minioBucket = 'image-storage';
var minioAcessKey = process.env.MINIO_ACCESS_KEY || 'minioadmin';
var minioSecretKey = process.env.MINIO_SECRET_KEY || "minioadmin";

function initMinIO() {
  return _initMinIO.apply(this, arguments);
}

function _initMinIO() {
  _initMinIO = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var client;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('Initialising MinIO...');
            client = new _minio.Client({
              endPoint: minioHost,
              port: 9000,
              useSSL: false,
              AccessKey: 'minioadmin',
              SecretKey: 'minioadmin'
            }); // let success = false
            // while (!success) {

            _context.prev = 2;
            _context.next = 5;
            return client.bucketExists(minioBucket);

          case 5:
            if (_context.sent) {
              _context.next = 9;
              break;
            }

            _context.next = 8;
            return client.makeBucket(minioBucket);

          case 8:
            console.log("".concat(minioBucket, " has been made sucessfully"));

          case 9:
            _context.next = 15;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](2);
            _context.next = 15;
            return new Promise(function (resolve) {
              return setTimeout(resolve, 1000);
            });

          case 15:
            console.log('MinIO initialised');
            return _context.abrupt("return", client);

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 11]]);
  }));
  return _initMinIO.apply(this, arguments);
}
//# sourceMappingURL=minio.js.map