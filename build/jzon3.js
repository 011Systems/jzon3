define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  /** @fileoverview jzon3.js **/

  var JZON3_PREFIX = '!__',
      JZON3_OBJ = JZON3_PREFIX + '@',
      JZON3_NUM = JZON3_PREFIX + '#',
      JZON3_DATE = JZON3_PREFIX + '*';

  var JZON3 = function () {
    function JZON3() {
      _classCallCheck(this, JZON3);
    }

    _createClass(JZON3, null, [{
      key: 'stringify',
      value: function stringify(obj) {
        var obj2cnt = new Map(),
            cnt = 0;

        var Date_toJSON = Date.prototype.toJSON;
        Date.prototype.toJSON = undefined;

        var r = JSON.stringify(obj, function (key, val) {
          // console.log(`  > ${key} = ${val}`);
          if (val === null) return val;
          // if(val===undefined) return JZON3_UNDEF;

          if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
            if (val instanceof Date) return JZON3_DATE + val.toISOString();

            var oid = obj2cnt.get(val);
            if (oid) return JZON3_OBJ + oid;
            obj2cnt.set(val, ++cnt);
            // console.log(`    --> ${cnt}`);
            return val;
          }

          if (typeof val === 'number') {
            if (!isFinite(val) || isNaN(val)) return JZON3_NUM + val;
            return val;
          }

          return val;
        });

        Date.prototype.toJSON = Date_toJSON;

        return r;
      }
    }, {
      key: 'parse',
      value: function parse(text) {
        var cnt2obj = new Map(),
            cnt = 0;

        // console.log(text);
        var r = JSON.parse(text, function (key, val) {
          // console.log(`  > ${key} = ${val}`);
          if (val === null) return val;
          // if(val===JZON3_UNDEF) return undefined;  // does not work!

          if (typeof val === 'string') {
            if (val.startsWith(JZON3_NUM)) return Number(val.substr(JZON3_NUM.length));
            if (val.startsWith(JZON3_DATE)) return new Date(val.substr(JZON3_DATE.length));
            return val;
          }

          return val;
        });

        function traverse(obj) {
          var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

          if (obj == null) return;
          cnt2obj.set(++cnt, obj);
          // console.log(`@${cnt}`);
          for (var key in obj) {
            var val = obj[key];
            // console.log(`--  [${level}] ${key}=${val}`);
            if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
              if (val instanceof Date) continue;
              traverse(val, level + 1);
            } else if (typeof val === 'string') {
              if (val.startsWith(JZON3_OBJ)) {
                var fix = cnt2obj.get(Number(val.substr(JZON3_OBJ.length)));
                // console.log(`         ${val} => ${fix.name}`);
                obj[key] = fix;
              }
            }
          }
        }
        traverse(r);

        return r;
      }
    }]);

    return JZON3;
  }();

  exports.default = JZON3;
});
