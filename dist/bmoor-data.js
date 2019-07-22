var bmoorData =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 62);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Observable = undefined;

var _canReportError = __webpack_require__(25);

var _toSubscriber = __webpack_require__(78);

var _observable = __webpack_require__(8);

var _pipe = __webpack_require__(43);

var _config = __webpack_require__(18);

var Observable = /*@__PURE__*/function () {
    function Observable(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var operator = this.operator;
        var sink = (0, _toSubscriber.toSubscriber)(observerOrNext, error, complete);
        if (operator) {
            sink.add(operator.call(sink, this.source));
        } else {
            sink.add(this.source || _config.config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable ? this._subscribe(sink) : this._trySubscribe(sink));
        }
        if (_config.config.useDeprecatedSynchronousErrorHandling) {
            if (sink.syncErrorThrowable) {
                sink.syncErrorThrowable = false;
                if (sink.syncErrorThrown) {
                    throw sink.syncErrorValue;
                }
            }
        }
        return sink;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        } catch (err) {
            if (_config.config.useDeprecatedSynchronousErrorHandling) {
                sink.syncErrorThrown = true;
                sink.syncErrorValue = err;
            }
            if ((0, _canReportError.canReportError)(sink)) {
                sink.error(err);
            } else {
                console.warn(err);
            }
        }
    };
    Observable.prototype.forEach = function (next, promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var subscription;
            subscription = _this.subscribe(function (value) {
                try {
                    next(value);
                } catch (err) {
                    reject(err);
                    if (subscription) {
                        subscription.unsubscribe();
                    }
                }
            }, reject, resolve);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        var source = this.source;
        return source && source.subscribe(subscriber);
    };
    Observable.prototype[_observable.observable] = function () {
        return this;
    };
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        if (operations.length === 0) {
            return this;
        }
        return (0, _pipe.pipeFromArray)(operations)(this);
    };
    Observable.prototype.toPromise = function (promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) {
                return value = x;
            }, function (err) {
                return reject(err);
            }, function () {
                return resolve(value);
            });
        });
    };
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}(); /** PURE_IMPORTS_START _util_canReportError,_util_toSubscriber,_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */
exports.Observable = Observable;

function getPromiseCtor(promiseCtor) {
    if (!promiseCtor) {
        promiseCtor = _config.config.Promise || Promise;
    }
    if (!promiseCtor) {
        throw new Error('no Promise impl found');
    }
    return promiseCtor;
}
//# sourceMappingURL=Observable.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.__extends = __extends;
exports.__rest = __rest;
exports.__decorate = __decorate;
exports.__param = __param;
exports.__metadata = __metadata;
exports.__awaiter = __awaiter;
exports.__generator = __generator;
exports.__exportStar = __exportStar;
exports.__values = __values;
exports.__read = __read;
exports.__spread = __spread;
exports.__spreadArrays = __spreadArrays;
exports.__await = __await;
exports.__asyncGenerator = __asyncGenerator;
exports.__asyncDelegator = __asyncDelegator;
exports.__asyncValues = __asyncValues;
exports.__makeTemplateObject = __makeTemplateObject;
exports.__importStar = __importStar;
exports.__importDefault = __importDefault;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return _extendStatics(d, b);
};

function __extends(d, b) {
    _extendStatics(d, b);
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var _assign = function __assign() {
    exports.__assign = _assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) {
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
        }
        return t;
    };
    return _assign.apply(this, arguments);
};

exports.__assign = _assign;
function __rest(s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) {
        decorator(target, key, paramIndex);
    };
}

function __metadata(metadataKey, metadataValue) {
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function sent() {
            if (t[0] & 1) throw t[1];return t[1];
        }, trys: [], ops: [] },
        f,
        y,
        t,
        g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;
    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) {
            try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0:case 1:
                        t = op;break;
                    case 4:
                        _.label++;return { value: op[1], done: false };
                    case 5:
                        _.label++;y = op[1];op = [0];continue;
                    case 7:
                        op = _.ops.pop();_.trys.pop();continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;continue;
                        }
                        if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                            _.label = op[1];break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];t = op;break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];_.ops.push(op);break;
                        }
                        if (t[2]) _.ops.pop();
                        _.trys.pop();continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [6, e];y = 0;
            } finally {
                f = t = 0;
            }
        }if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) {
        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator],
        i = 0;
    if (m) return m.call(o);
    return {
        next: function next() {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
        r,
        ar = [],
        e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
            ar.push(r.value);
        }
    } catch (error) {
        e = { error: error };
    } finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally {
            if (e) throw e.error;
        }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++) {
        ar = ar.concat(__read(arguments[i]));
    }return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
        s += arguments[i].length;
    }for (var r = Array(s), k = 0, i = 0; i < il; i++) {
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
            r[k] = a[j];
        }
    }return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []),
        i,
        q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
        return this;
    }, i;
    function verb(n) {
        if (g[n]) i[n] = function (v) {
            return new Promise(function (a, b) {
                q.push([n, v, a, b]) > 1 || resume(n, v);
            });
        };
    }
    function resume(n, v) {
        try {
            step(g[n](v));
        } catch (e) {
            settle(q[0][3], e);
        }
    }
    function step(r) {
        r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
        resume("next", value);
    }
    function reject(value) {
        resume("throw", value);
    }
    function settle(f, v) {
        if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
    }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) {
        throw e;
    }), verb("return"), i[Symbol.iterator] = function () {
        return this;
    }, i;
    function verb(n, f) {
        i[n] = o[n] ? function (v) {
            return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v;
        } : f;
    }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator],
        i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
        return this;
    }, i);
    function verb(n) {
        i[n] = o[n] && function (v) {
            return new Promise(function (resolve, reject) {
                v = o[n](v), settle(resolve, reject, v.done, v.value);
            });
        };
    }
    function settle(resolve, reject, d, v) {
        Promise.resolve(v).then(function (v) {
            resolve({ value: v, done: d });
        }, reject);
    }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) {
        Object.defineProperty(cooked, "raw", { value: raw });
    } else {
        cooked.raw = raw;
    }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) {
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }result.default = mod;
    return result;
}

function __importDefault(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = Object.create(__webpack_require__(5));

bmoor.dom = __webpack_require__(64);
bmoor.data = __webpack_require__(65);
bmoor.flow = __webpack_require__(66);
bmoor.array = __webpack_require__(24);
bmoor.build = __webpack_require__(69);
bmoor.object = __webpack_require__(73);
bmoor.string = __webpack_require__(74);
bmoor.promise = __webpack_require__(75);

bmoor.Memory = __webpack_require__(76);
bmoor.Eventing = __webpack_require__(38);
bmoor.Observable = __webpack_require__(77);

module.exports = bmoor;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Subscription = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_UnsubscriptionError PURE_IMPORTS_END */


var _isArray = __webpack_require__(6);

var _isObject = __webpack_require__(27);

var _isFunction = __webpack_require__(17);

var _UnsubscriptionError = __webpack_require__(42);

var Subscription = /*@__PURE__*/function () {
    function Subscription(unsubscribe) {
        this.closed = false;
        this._parentOrParents = null;
        this._subscriptions = null;
        if (unsubscribe) {
            this._unsubscribe = unsubscribe;
        }
    }
    Subscription.prototype.unsubscribe = function () {
        var errors;
        if (this.closed) {
            return;
        }
        var _a = this,
            _parentOrParents = _a._parentOrParents,
            _unsubscribe = _a._unsubscribe,
            _subscriptions = _a._subscriptions;
        this.closed = true;
        this._parentOrParents = null;
        this._subscriptions = null;
        if (_parentOrParents instanceof Subscription) {
            _parentOrParents.remove(this);
        } else if (_parentOrParents !== null) {
            for (var index = 0; index < _parentOrParents.length; ++index) {
                var parent_1 = _parentOrParents[index];
                parent_1.remove(this);
            }
        }
        if ((0, _isFunction.isFunction)(_unsubscribe)) {
            try {
                _unsubscribe.call(this);
            } catch (e) {
                errors = e instanceof _UnsubscriptionError.UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
            }
        }
        if ((0, _isArray.isArray)(_subscriptions)) {
            var index = -1;
            var len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if ((0, _isObject.isObject)(sub)) {
                    try {
                        sub.unsubscribe();
                    } catch (e) {
                        errors = errors || [];
                        if (e instanceof _UnsubscriptionError.UnsubscriptionError) {
                            errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
                        } else {
                            errors.push(e);
                        }
                    }
                }
            }
        }
        if (errors) {
            throw new _UnsubscriptionError.UnsubscriptionError(errors);
        }
    };
    Subscription.prototype.add = function (teardown) {
        var subscription = teardown;
        if (!teardown) {
            return Subscription.EMPTY;
        }
        switch (typeof teardown === 'undefined' ? 'undefined' : _typeof(teardown)) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    return subscription;
                } else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                } else if (!(subscription instanceof Subscription)) {
                    var tmp = subscription;
                    subscription = new Subscription();
                    subscription._subscriptions = [tmp];
                }
                break;
            default:
                {
                    throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
                }
        }
        var _parentOrParents = subscription._parentOrParents;
        if (_parentOrParents === null) {
            subscription._parentOrParents = this;
        } else if (_parentOrParents instanceof Subscription) {
            if (_parentOrParents === this) {
                return subscription;
            }
            subscription._parentOrParents = [_parentOrParents, this];
        } else if (_parentOrParents.indexOf(this) === -1) {
            _parentOrParents.push(this);
        } else {
            return subscription;
        }
        var subscriptions = this._subscriptions;
        if (subscriptions === null) {
            this._subscriptions = [subscription];
        } else {
            subscriptions.push(subscription);
        }
        return subscription;
    };
    Subscription.prototype.remove = function (subscription) {
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    Subscription.EMPTY = function (empty) {
        empty.closed = true;
        return empty;
    }(new Subscription());
    return Subscription;
}();
exports.Subscription = Subscription;

function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) {
        return errs.concat(err instanceof _UnsubscriptionError.UnsubscriptionError ? err.errors : err);
    }, []);
}
//# sourceMappingURL=Subscription.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SafeSubscriber = exports.Subscriber = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */


var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _isFunction = __webpack_require__(17);

var _Observer = __webpack_require__(41);

var _Subscription = __webpack_require__(3);

var _rxSubscriber = __webpack_require__(28);

var _config = __webpack_require__(18);

var _hostReportError = __webpack_require__(26);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var Subscriber = /*@__PURE__*/function (_super) {
    tslib_1.__extends(Subscriber, _super);
    function Subscriber(destinationOrNext, error, complete) {
        var _this = _super.call(this) || this;
        _this.syncErrorValue = null;
        _this.syncErrorThrown = false;
        _this.syncErrorThrowable = false;
        _this.isStopped = false;
        switch (arguments.length) {
            case 0:
                _this.destination = _Observer.empty;
                break;
            case 1:
                if (!destinationOrNext) {
                    _this.destination = _Observer.empty;
                    break;
                }
                if ((typeof destinationOrNext === 'undefined' ? 'undefined' : _typeof(destinationOrNext)) === 'object') {
                    if (destinationOrNext instanceof Subscriber) {
                        _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
                        _this.destination = destinationOrNext;
                        destinationOrNext.add(_this);
                    } else {
                        _this.syncErrorThrowable = true;
                        _this.destination = new SafeSubscriber(_this, destinationOrNext);
                    }
                    break;
                }
            default:
                _this.syncErrorThrowable = true;
                _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
                break;
        }
        return _this;
    }
    Subscriber.prototype[_rxSubscriber.rxSubscriber] = function () {
        return this;
    };
    Subscriber.create = function (next, error, complete) {
        var subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    };
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped) {
            this._next(value);
        }
    };
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    };
    Subscriber.prototype.complete = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        this.destination.error(err);
        this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
        this.destination.complete();
        this.unsubscribe();
    };
    Subscriber.prototype._unsubscribeAndRecycle = function () {
        var _parentOrParents = this._parentOrParents;
        this._parentOrParents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parentOrParents = _parentOrParents;
        return this;
    };
    return Subscriber;
}(_Subscription.Subscription);
exports.Subscriber = Subscriber;

var SafeSubscriber = /*@__PURE__*/function (_super) {
    tslib_1.__extends(SafeSubscriber, _super);
    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
        var _this = _super.call(this) || this;
        _this._parentSubscriber = _parentSubscriber;
        var next;
        var context = _this;
        if ((0, _isFunction.isFunction)(observerOrNext)) {
            next = observerOrNext;
        } else if (observerOrNext) {
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (observerOrNext !== _Observer.empty) {
                context = Object.create(observerOrNext);
                if ((0, _isFunction.isFunction)(context.unsubscribe)) {
                    _this.add(context.unsubscribe.bind(context));
                }
                context.unsubscribe = _this.unsubscribe.bind(_this);
            }
        }
        _this._context = context;
        _this._next = next;
        _this._error = error;
        _this._complete = complete;
        return _this;
    }
    SafeSubscriber.prototype.next = function (value) {
        if (!this.isStopped && this._next) {
            var _parentSubscriber = this._parentSubscriber;
            if (!_config.config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            } else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            var useDeprecatedSynchronousErrorHandling = _config.config.useDeprecatedSynchronousErrorHandling;
            if (this._error) {
                if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                } else {
                    this.__tryOrSetError(_parentSubscriber, this._error, err);
                    this.unsubscribe();
                }
            } else if (!_parentSubscriber.syncErrorThrowable) {
                this.unsubscribe();
                if (useDeprecatedSynchronousErrorHandling) {
                    throw err;
                }
                (0, _hostReportError.hostReportError)(err);
            } else {
                if (useDeprecatedSynchronousErrorHandling) {
                    _parentSubscriber.syncErrorValue = err;
                    _parentSubscriber.syncErrorThrown = true;
                } else {
                    (0, _hostReportError.hostReportError)(err);
                }
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.complete = function () {
        var _this = this;
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._complete) {
                var wrappedComplete = function wrappedComplete() {
                    return _this._complete.call(_this._context);
                };
                if (!_config.config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(wrappedComplete);
                    this.unsubscribe();
                } else {
                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                    this.unsubscribe();
                }
            } else {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
        try {
            fn.call(this._context, value);
        } catch (err) {
            this.unsubscribe();
            if (_config.config.useDeprecatedSynchronousErrorHandling) {
                throw err;
            } else {
                (0, _hostReportError.hostReportError)(err);
            }
        }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
        if (!_config.config.useDeprecatedSynchronousErrorHandling) {
            throw new Error('bad call');
        }
        try {
            fn.call(this._context, value);
        } catch (err) {
            if (_config.config.useDeprecatedSynchronousErrorHandling) {
                parent.syncErrorValue = err;
                parent.syncErrorThrown = true;
                return true;
            } else {
                (0, _hostReportError.hostReportError)(err);
                return true;
            }
        }
        return false;
    };
    SafeSubscriber.prototype._unsubscribe = function () {
        var _parentSubscriber = this._parentSubscriber;
        this._context = null;
        this._parentSubscriber = null;
        _parentSubscriber.unsubscribe();
    };
    return SafeSubscriber;
}(Subscriber);
exports.SafeSubscriber = SafeSubscriber;
//# sourceMappingURL=Subscriber.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * The core of bmoor's usefulness
 * @module bmoor
 **/

/**
 * Tests if the value is undefined
 *
 * @function isUndefined
 * @param {*} value - The variable to test
 * @return {boolean}
 **/
function isUndefined(value) {
	return value === undefined;
}

/**
 * Tests if the value is not undefined
 *
 * @function isDefined
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isDefined(value) {
	return value !== undefined;
}

/**
 * Tests if the value is a string
 *
 * @function isString
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isString(value) {
	return typeof value === 'string';
}

/**
 * Tests if the value is numeric
 *
 * @function isNumber
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isNumber(value) {
	return typeof value === 'number';
}

/**
 * Tests if the value is a function
 *
 * @function isFuncion
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isFunction(value) {
	return typeof value === 'function';
}

/**
 * Tests if the value is an object
 *
 * @function isObject
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isObject(value) {
	return value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
}

/**
 * Tests if the value is a boolean
 *
 * @function isBoolean
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isBoolean(value) {
	return typeof value === 'boolean';
}

/**
 * Tests if the value can be used as an array
 *
 * @function isArrayLike
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isArrayLike(value) {
	// for me, if you have a length, I'm assuming you're array like, might change
	if (value) {
		return isObject(value) && (value.length === 0 || 0 in value && value.length - 1 in value);
	} else {
		return false;
	}
}

/**
 * Tests if the value is an array
 *
 * @function isArray
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isArray(value) {
	return value instanceof Array;
}

/**
 * Tests if the value has no content.
 * If an object, has no own properties.
 * If array, has length == 0.
 * If other, is not defined
 *
 * @function isEmpty
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isEmpty(value) {
	var key;

	if (isObject(value)) {
		for (key in value) {
			if (value.hasOwnProperty(key)) {
				return false;
			}
		}
	} else if (isArrayLike(value)) {
		return value.length === 0;
	} else {
		return isUndefined(value);
	}

	return true;
}

function parse(path) {
	if (!path) {
		return [];
	} else if (isString(path)) {
		return path.split('.');
	} else if (isArray(path)) {
		return path.slice(0);
	} else {
		throw new Error('unable to parse path: ' + path + ' : ' + (typeof path === 'undefined' ? 'undefined' : _typeof(path)));
	}
}

/**
 * Sets a value to a namespace, returns the old value
 *
 * @function set
 * @param {object} root The root of the namespace, bMoor.namespace.root if not defined
 * @param {string|array} space The namespace
 * @param {*} value The value to set the namespace to
 * @return {*}
 **/
function set(root, space, value) {
	var i,
	    c,
	    val,
	    nextSpace,
	    curSpace = root;

	space = parse(space);

	val = space.pop();

	for (i = 0, c = space.length; i < c; i++) {
		nextSpace = space[i];

		if (isUndefined(curSpace[nextSpace])) {
			curSpace[nextSpace] = {};
		}

		curSpace = curSpace[nextSpace];
	}

	curSpace[val] = value;

	return curSpace;
}

function _makeSetter(property, next) {
	if (next) {
		return function (ctx, value) {
			var t = ctx[property];

			if (!t) {
				t = ctx[property] = {};
			}

			return next(t, value);
		};
	} else {
		return function (ctx, value) {
			ctx[property] = value;
			return ctx;
		};
	}
}

function makeSetter(space) {
	var i,
	    fn,
	    readings = parse(space);

	for (i = readings.length - 1; i > -1; i--) {
		fn = _makeSetter(readings[i], fn);
	}

	return fn;
}

/**
 * get a value from a namespace, if it doesn't exist, the path will be created
 *
 * @function get
 * @param {object} root The root of the namespace, bMoor.namespace.root if not defined
 * @param {string|array|function} space The namespace
 * @return {array}
 **/
function get(root, path) {
	var i,
	    c,
	    space,
	    nextSpace,
	    curSpace = root;

	if (!root) {
		return root;
	}

	space = parse(path);
	if (space.length) {
		for (i = 0, c = space.length; i < c; i++) {
			nextSpace = space[i];

			if (isUndefined(curSpace[nextSpace])) {
				return;
			}

			curSpace = curSpace[nextSpace];
		}
	}

	return curSpace;
}

function _makeGetter(property, next) {
	if (next) {
		return function (obj) {
			try {
				return next(obj[property]);
			} catch (ex) {
				return undefined;
			}
		};
	} else {
		return function (obj) {
			try {
				return obj[property];
			} catch (ex) {
				return undefined;
			}
		};
	}
}

function makeGetter(path) {
	var i,
	    fn,
	    space = parse(path);

	if (space.length) {
		for (i = space.length - 1; i > -1; i--) {
			fn = _makeGetter(space[i], fn);
		}
	} else {
		return function (obj) {
			return obj;
		};
	}

	return fn;
}

/**
 * Delete a namespace, returns the old value
 *
 * @function del
 * @param {object} root The root of the namespace, bMoor.namespace.root if not defined
 * @param {string|array} space The namespace
 * @return {*}
 **/
function del(root, space) {
	var old,
	    val,
	    nextSpace,
	    curSpace = root;

	if (space && (isString(space) || isArrayLike(space))) {
		space = parse(space);

		val = space.pop();

		for (var i = 0; i < space.length; i++) {
			nextSpace = space[i];

			if (isUndefined(curSpace[nextSpace])) {
				return;
			}

			curSpace = curSpace[nextSpace];
		}

		old = curSpace[val];
		delete curSpace[val];
	}

	return old;
}

/**
 * Call a function against all elements of an array like object, from 0 to length.  
 *
 * @function loop
 * @param {array} arr The array to iterate through
 * @param {function} fn The function to call against each element
 * @param {object} context The context to call each function against
 **/
function loop(arr, fn, context) {
	var i, c;

	if (!context) {
		context = arr;
	}

	if (arr.forEach) {
		arr.forEach(fn, context);
	} else {
		for (i = 0, c = arr.length; i < c; ++i) {
			if (i in arr) {
				fn.call(context, arr[i], i, arr);
			}
		}
	}
}

/**
 * Call a function against all own properties of an object.  
 *
 * @function each
 * @param {object} arr The object to iterate through
 * @param {function} fn The function to call against each element
 * @param {object} context The context to call each function against
 **/
function each(obj, fn, context) {
	var key;

	if (!context) {
		context = obj;
	}

	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			fn.call(context, obj[key], key, obj);
		}
	}
}

/**
 * Call a function against all own properties of an object, skipping specific framework properties.
 * In this framework, $ implies a system function, _ implies private, so skip _
 *
 * @function iterate
 * @param {object} obj The object to iterate through
 * @param {function} fn The function to call against each element
 * @param {object} context The scope to call each function against
 **/
function iterate(obj, fn, context) {
	var key;

	if (!context) {
		context = obj;
	}

	for (key in obj) {
		if (obj.hasOwnProperty(key) && key.charAt(0) !== '_') {
			fn.call(context, obj[key], key, obj);
		}
	}
}

/**
 * Call a function against all own properties of an object, skipping specific framework properties.
 * In this framework, $ implies a system function, _ implies private, so skip both
 *
 * @function safe
 * @param {object} obj - The object to iterate through
 * @param {function} fn - The function to call against each element
 * @param {object} scope - The scope to call each function against
 **/
function safe(obj, fn, context) {
	var key;

	if (!context) {
		context = obj;
	}

	for (key in obj) {
		if (obj.hasOwnProperty(key) && key.charAt(0) !== '_' && key.charAt(0) !== '$') {
			fn.call(context, obj[key], key, obj);
		}
	}
}

function naked(obj, fn, context) {
	safe(obj, function (t, k, o) {
		if (!isFunction(t)) {
			fn.call(context, t, k, o);
		}
	});
}

module.exports = {
	// booleans
	isUndefined: isUndefined,
	isDefined: isDefined,
	isString: isString,
	isNumber: isNumber,
	isFunction: isFunction,
	isObject: isObject,
	isBoolean: isBoolean,
	isArrayLike: isArrayLike,
	isArray: isArray,
	isEmpty: isEmpty,
	// access
	parse: parse,
	set: set,
	makeSetter: makeSetter,
	get: get,
	makeGetter: makeGetter,
	del: del,
	// controls
	loop: loop,
	each: each,
	iterate: iterate,
	safe: safe,
	naked: naked
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var isArray = exports.isArray = Array.isArray || function (x) {
  return x && typeof x.length === 'number';
};
//# sourceMappingURL=isArray.js.map

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isScheduler = isScheduler;
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isScheduler(value) {
    return value && typeof value.schedule === 'function';
}
//# sourceMappingURL=isScheduler.js.map

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var observable = exports.observable = typeof Symbol === 'function' && Symbol.observable || '@@observable';
//# sourceMappingURL=observable.js.map

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnonymousSubject = exports.Subject = exports.SubjectSubscriber = undefined;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _Observable = __webpack_require__(0);

var _Subscriber = __webpack_require__(4);

var _Subscription = __webpack_require__(3);

var _ObjectUnsubscribedError = __webpack_require__(19);

var _SubjectSubscription = __webpack_require__(44);

var _rxSubscriber = __webpack_require__(28);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var SubjectSubscriber = /*@__PURE__*/function (_super) {
    tslib_1.__extends(SubjectSubscriber, _super);
    function SubjectSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        return _this;
    }
    return SubjectSubscriber;
}(_Subscriber.Subscriber); /** PURE_IMPORTS_START tslib,_Observable,_Subscriber,_Subscription,_util_ObjectUnsubscribedError,_SubjectSubscription,_internal_symbol_rxSubscriber PURE_IMPORTS_END */
exports.SubjectSubscriber = SubjectSubscriber;

var Subject = /*@__PURE__*/function (_super) {
    tslib_1.__extends(Subject, _super);
    function Subject() {
        var _this = _super.call(this) || this;
        _this.observers = [];
        _this.closed = false;
        _this.isStopped = false;
        _this.hasError = false;
        _this.thrownError = null;
        return _this;
    }
    Subject.prototype[_rxSubscriber.rxSubscriber] = function () {
        return new SubjectSubscriber(this);
    };
    Subject.prototype.lift = function (operator) {
        var subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    };
    Subject.prototype.next = function (value) {
        if (this.closed) {
            throw new _ObjectUnsubscribedError.ObjectUnsubscribedError();
        }
        if (!this.isStopped) {
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].next(value);
            }
        }
    };
    Subject.prototype.error = function (err) {
        if (this.closed) {
            throw new _ObjectUnsubscribedError.ObjectUnsubscribedError();
        }
        this.hasError = true;
        this.thrownError = err;
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].error(err);
        }
        this.observers.length = 0;
    };
    Subject.prototype.complete = function () {
        if (this.closed) {
            throw new _ObjectUnsubscribedError.ObjectUnsubscribedError();
        }
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].complete();
        }
        this.observers.length = 0;
    };
    Subject.prototype.unsubscribe = function () {
        this.isStopped = true;
        this.closed = true;
        this.observers = null;
    };
    Subject.prototype._trySubscribe = function (subscriber) {
        if (this.closed) {
            throw new _ObjectUnsubscribedError.ObjectUnsubscribedError();
        } else {
            return _super.prototype._trySubscribe.call(this, subscriber);
        }
    };
    Subject.prototype._subscribe = function (subscriber) {
        if (this.closed) {
            throw new _ObjectUnsubscribedError.ObjectUnsubscribedError();
        } else if (this.hasError) {
            subscriber.error(this.thrownError);
            return _Subscription.Subscription.EMPTY;
        } else if (this.isStopped) {
            subscriber.complete();
            return _Subscription.Subscription.EMPTY;
        } else {
            this.observers.push(subscriber);
            return new _SubjectSubscription.SubjectSubscription(this, subscriber);
        }
    };
    Subject.prototype.asObservable = function () {
        var observable = new _Observable.Observable();
        observable.source = this;
        return observable;
    };
    Subject.create = function (destination, source) {
        return new AnonymousSubject(destination, source);
    };
    return Subject;
}(_Observable.Observable);
exports.Subject = Subject;

var AnonymousSubject = /*@__PURE__*/function (_super) {
    tslib_1.__extends(AnonymousSubject, _super);
    function AnonymousSubject(destination, source) {
        var _this = _super.call(this) || this;
        _this.destination = destination;
        _this.source = source;
        return _this;
    }
    AnonymousSubject.prototype.next = function (value) {
        var destination = this.destination;
        if (destination && destination.next) {
            destination.next(value);
        }
    };
    AnonymousSubject.prototype.error = function (err) {
        var destination = this.destination;
        if (destination && destination.error) {
            this.destination.error(err);
        }
    };
    AnonymousSubject.prototype.complete = function () {
        var destination = this.destination;
        if (destination && destination.complete) {
            this.destination.complete();
        }
    };
    AnonymousSubject.prototype._subscribe = function (subscriber) {
        var source = this.source;
        if (source) {
            return this.source.subscribe(subscriber);
        } else {
            return _Subscription.Subscription.EMPTY;
        }
    };
    return AnonymousSubject;
}(Subject);
exports.AnonymousSubject = AnonymousSubject;
//# sourceMappingURL=Subject.js.map

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EMPTY = undefined;
exports.empty = empty;

var _Observable = __webpack_require__(0);

var EMPTY = /*@__PURE__*/exports.EMPTY = new _Observable.Observable(function (subscriber) {
    return subscriber.complete();
}); /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
function empty(scheduler) {
    return scheduler ? emptyScheduled(scheduler) : EMPTY;
}
function emptyScheduled(scheduler) {
    return new _Observable.Observable(function (subscriber) {
        return scheduler.schedule(function () {
            return subscriber.complete();
        });
    });
}
//# sourceMappingURL=empty.js.map

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MapOperator = undefined;
exports.map = map;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _Subscriber = __webpack_require__(4);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
function map(project, thisArg) {
    return function mapOperation(source) {
        if (typeof project !== 'function') {
            throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
        }
        return source.lift(new MapOperator(project, thisArg));
    };
}
var MapOperator = /*@__PURE__*/function () {
    function MapOperator(project, thisArg) {
        this.project = project;
        this.thisArg = thisArg;
    }
    MapOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
    };
    return MapOperator;
}();
exports.MapOperator = MapOperator;

var MapSubscriber = /*@__PURE__*/function (_super) {
    tslib_1.__extends(MapSubscriber, _super);
    function MapSubscriber(destination, project, thisArg) {
        var _this = _super.call(this, destination) || this;
        _this.project = project;
        _this.count = 0;
        _this.thisArg = thisArg || _this;
        return _this;
    }
    MapSubscriber.prototype._next = function (value) {
        var result;
        try {
            result = this.project.call(this.thisArg, value, this.count++);
        } catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return MapSubscriber;
}(_Subscriber.Subscriber);
//# sourceMappingURL=map.js.map

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.from = from;

var _Observable = __webpack_require__(0);

var _subscribeTo = __webpack_require__(35);

var _scheduled = __webpack_require__(54);

function from(input, scheduler) {
    if (!scheduler) {
        if (input instanceof _Observable.Observable) {
            return input;
        }
        return new _Observable.Observable((0, _subscribeTo.subscribeTo)(input));
    } else {
        return (0, _scheduled.scheduled)(input, scheduler);
    }
}
//# sourceMappingURL=from.js.map
/** PURE_IMPORTS_START _Observable,_util_subscribeTo,_scheduled_scheduled PURE_IMPORTS_END */

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AsyncAction = undefined;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _Action = __webpack_require__(85);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/** PURE_IMPORTS_START tslib,_Action PURE_IMPORTS_END */
var AsyncAction = /*@__PURE__*/function (_super) {
    tslib_1.__extends(AsyncAction, _super);
    function AsyncAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        _this.pending = false;
        return _this;
    }
    AsyncAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (this.closed) {
            return this;
        }
        this.state = state;
        var id = this.id;
        var scheduler = this.scheduler;
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, delay);
        }
        this.pending = true;
        this.delay = delay;
        this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
        return this;
    };
    AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        return setInterval(scheduler.flush.bind(scheduler, this), delay);
    };
    AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (delay !== null && this.delay === delay && this.pending === false) {
            return id;
        }
        clearInterval(id);
        return undefined;
    };
    AsyncAction.prototype.execute = function (state, delay) {
        if (this.closed) {
            return new Error('executing a cancelled action');
        }
        this.pending = false;
        var error = this._execute(state, delay);
        if (error) {
            return error;
        } else if (this.pending === false && this.id != null) {
            this.id = this.recycleAsyncId(this.scheduler, this.id, null);
        }
    };
    AsyncAction.prototype._execute = function (state, delay) {
        var errored = false;
        var errorValue = undefined;
        try {
            this.work(state);
        } catch (e) {
            errored = true;
            errorValue = !!e && e || new Error(e);
        }
        if (errored) {
            this.unsubscribe();
            return errorValue;
        }
    };
    AsyncAction.prototype._unsubscribe = function () {
        var id = this.id;
        var scheduler = this.scheduler;
        var actions = scheduler.actions;
        var index = actions.indexOf(this);
        this.work = null;
        this.state = null;
        this.pending = false;
        this.scheduler = null;
        if (index !== -1) {
            actions.splice(index, 1);
        }
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, null);
        }
        this.delay = null;
    };
    return AsyncAction;
}(_Action.Action);
exports.AsyncAction = AsyncAction;
//# sourceMappingURL=AsyncAction.js.map

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AsyncScheduler = undefined;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _Scheduler = __webpack_require__(46);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/** PURE_IMPORTS_START tslib,_Scheduler PURE_IMPORTS_END */
var AsyncScheduler = /*@__PURE__*/function (_super) {
    tslib_1.__extends(AsyncScheduler, _super);
    function AsyncScheduler(SchedulerAction, now) {
        if (now === void 0) {
            now = _Scheduler.Scheduler.now;
        }
        var _this = _super.call(this, SchedulerAction, function () {
            if (AsyncScheduler.delegate && AsyncScheduler.delegate !== _this) {
                return AsyncScheduler.delegate.now();
            } else {
                return now();
            }
        }) || this;
        _this.actions = [];
        _this.active = false;
        _this.scheduled = undefined;
        return _this;
    }
    AsyncScheduler.prototype.schedule = function (work, delay, state) {
        if (delay === void 0) {
            delay = 0;
        }
        if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
            return AsyncScheduler.delegate.schedule(work, delay, state);
        } else {
            return _super.prototype.schedule.call(this, work, delay, state);
        }
    };
    AsyncScheduler.prototype.flush = function (action) {
        var actions = this.actions;
        if (this.active) {
            actions.push(action);
            return;
        }
        var error;
        this.active = true;
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (action = actions.shift());
        this.active = false;
        if (error) {
            while (action = actions.shift()) {
                action.unsubscribe();
            }
            throw error;
        }
    };
    return AsyncScheduler;
}(_Scheduler.Scheduler);
exports.AsyncScheduler = AsyncScheduler;
//# sourceMappingURL=AsyncScheduler.js.map

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fromArray = fromArray;

var _Observable = __webpack_require__(0);

var _subscribeToArray = __webpack_require__(48);

var _scheduleArray = __webpack_require__(31);

function fromArray(input, scheduler) {
    if (!scheduler) {
        return new _Observable.Observable((0, _subscribeToArray.subscribeToArray)(input));
    } else {
        return (0, _scheduleArray.scheduleArray)(input, scheduler);
    }
}
//# sourceMappingURL=fromArray.js.map
/** PURE_IMPORTS_START _Observable,_util_subscribeToArray,_scheduled_scheduleArray PURE_IMPORTS_END */

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getSymbolIterator = getSymbolIterator;
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function getSymbolIterator() {
    if (typeof Symbol !== 'function' || !Symbol.iterator) {
        return '@@iterator';
    }
    return Symbol.iterator;
}
var iterator = /*@__PURE__*/exports.iterator = getSymbolIterator();
var $$iterator = exports.$$iterator = iterator;
//# sourceMappingURL=iterator.js.map

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isFunction = isFunction;
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isFunction(x) {
    return typeof x === 'function';
}
//# sourceMappingURL=isFunction.js.map

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var _enable_super_gross_mode_that_will_cause_bad_things = false;
var config = exports.config = {
    Promise: undefined,
    set useDeprecatedSynchronousErrorHandling(value) {
        if (value) {
            var error = /*@__PURE__*/new Error();
            /*@__PURE__*/console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
        } else if (_enable_super_gross_mode_that_will_cause_bad_things) {
            /*@__PURE__*/console.log('RxJS: Back to a better error behavior. Thank you. <3');
        }
        _enable_super_gross_mode_that_will_cause_bad_things = value;
    },
    get useDeprecatedSynchronousErrorHandling() {
        return _enable_super_gross_mode_that_will_cause_bad_things;
    }
};
//# sourceMappingURL=config.js.map

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function ObjectUnsubscribedErrorImpl() {
    Error.call(this);
    this.message = 'object unsubscribed';
    this.name = 'ObjectUnsubscribedError';
    return this;
}
ObjectUnsubscribedErrorImpl.prototype = /*@__PURE__*/Object.create(Error.prototype);
var ObjectUnsubscribedError = exports.ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl;
//# sourceMappingURL=ObjectUnsubscribedError.js.map

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OuterSubscriber = undefined;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _Subscriber = __webpack_require__(4);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
var OuterSubscriber = /*@__PURE__*/function (_super) {
    tslib_1.__extends(OuterSubscriber, _super);
    function OuterSubscriber() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    };
    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
        this.destination.error(error);
    };
    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
        this.destination.complete();
    };
    return OuterSubscriber;
}(_Subscriber.Subscriber);
exports.OuterSubscriber = OuterSubscriber;
//# sourceMappingURL=OuterSubscriber.js.map

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.subscribeToResult = subscribeToResult;

var _InnerSubscriber = __webpack_require__(50);

var _subscribeTo = __webpack_require__(35);

var _Observable = __webpack_require__(0);

function subscribeToResult(outerSubscriber, result, outerValue, outerIndex, destination) {
    if (destination === void 0) {
        destination = new _InnerSubscriber.InnerSubscriber(outerSubscriber, outerValue, outerIndex);
    }
    if (destination.closed) {
        return undefined;
    }
    if (result instanceof _Observable.Observable) {
        return result.subscribe(destination);
    }
    return (0, _subscribeTo.subscribeTo)(result)(destination);
}
//# sourceMappingURL=subscribeToResult.js.map
/** PURE_IMPORTS_START _InnerSubscriber,_subscribeTo,_Observable PURE_IMPORTS_END */

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bmoor = __webpack_require__(2),
    setUid = bmoor.data.setUid,
    oldPush = Array.prototype.push;

var DataSubject = __webpack_require__(39).Subject;

// designed for one way data flows.
// src -> feed -> target

var Feed = function (_DataSubject) {
	_inherits(Feed, _DataSubject);

	function Feed(src) {
		var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		_classCallCheck(this, Feed);

		var _this = _possibleConstructorReturn(this, (Feed.__proto__ || Object.getPrototypeOf(Feed)).call(this, null, settings));

		var hot = false;
		if (src) {
			hot = !!src.length || settings.hot; // if it's a length of 0, don't go hot
			src.push = src.unshift = _this.add.bind(_this);

			src.forEach(function (datum) {
				_this._track(datum);
			});
		} else {
			src = [];
		}

		setUid(_this);

		_this.data = src;

		if (hot) {
			_this.next();
		}
		return _this;
	}
	/*
 next(){
 	this._next();
 }
 */


	_createClass(Feed, [{
		key: '_track',
		value: function _track() /*datum*/{
			// just a stub for now
		}
	}, {
		key: '_add',
		value: function _add(datum) {
			oldPush.call(this.data, datum);

			this._track(datum);

			return datum;
		}
	}, {
		key: 'add',
		value: function add(datum) {
			var added = this._add(datum);

			this._next();

			return added;
		}
	}, {
		key: 'consume',
		value: function consume(arr) {
			for (var i = 0, c = arr.length; i < c; i++) {
				this._add(arr[i]);
			}

			this._next();
		}
	}, {
		key: 'empty',
		value: function empty() {
			this.data.length = 0;

			this._next();
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			this.data = null;
			this.complete();
		}
	}]);

	return Feed;
}(DataSubject);

module.exports = Feed;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (cb, min, max, settings) {
	var ctx, args, next, limit, timeout;

	if (!settings) {
		settings = {};
	}

	function fire() {
		limit = null;
		cb.apply(settings.context || ctx, args);
	}

	function run() {
		var now = Date.now();

		if (now >= limit || now >= next) {
			fire();
		} else {
			timeout = setTimeout(run, Math.min(limit, next) - now);
		}
	}

	var fn = function windowed() {
		var now = Date.now();

		ctx = this;
		args = arguments;
		next = now + min;

		if (!limit) {
			limit = now + max;
			timeout = setTimeout(run, min);
		}
	};

	fn.clear = function () {
		clearTimeout(timeout);
		timeout = null;
		limit = null;
	};

	fn.flush = function () {
		fire();
		fn.clear();
	};

	fn.shift = function (diff) {
		limit += diff;
	};

	fn.active = function () {
		return !!limit;
	};

	return fn;
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Array helper functions
 * @module bmoor.array
 **/

var bmoor = __webpack_require__(5);

/**
 * Search an array for an element and remove it, starting at the begining or a specified location
 *
 * @function remove
 * @param {array} arr An array to be searched
 * @param {*} searchElement Content for which to be searched
 * @param {integer} fromIndex The begining index from which to begin the search, defaults to 0
 * @return {array} array containing removed element
 **/
function remove(arr, searchElement, fromIndex) {
	var pos = arr.indexOf(searchElement, fromIndex);

	if (pos > -1) {
		return arr.splice(pos, 1)[0];
	}
}

/**
 * Search an array for an element and remove all instances of it, starting at the begining or a specified location
 *
 * @function remove
 * @param {array} arr An array to be searched
 * @param {*} searchElement Content for which to be searched
 * @param {integer} fromIndex The begining index from which to begin the search, defaults to 0
 * @return {integer} number of elements removed
 **/
function removeAll(arr, searchElement, fromIndex) {
	var r,
	    pos = arr.indexOf(searchElement, fromIndex);

	if (pos > -1) {
		r = removeAll(arr, searchElement, pos + 1);
		r.unshift(arr.splice(pos, 1)[0]);

		return r;
	} else {
		return [];
	}
}

function bisect(arr, value, func, preSorted) {
	var idx,
	    val,
	    bottom = 0,
	    top = arr.length - 1;

	if (!preSorted) {
		arr.sort(function (a, b) {
			return func(a) - func(b);
		});
	}

	if (func(arr[bottom]) >= value) {
		return {
			left: bottom,
			right: bottom
		};
	}

	if (func(arr[top]) <= value) {
		return {
			left: top,
			right: top
		};
	}

	if (arr.length) {
		while (top - bottom > 1) {
			idx = Math.floor((top + bottom) / 2);
			val = func(arr[idx]);

			if (val === value) {
				top = idx;
				bottom = idx;
			} else if (val > value) {
				top = idx;
			} else {
				bottom = idx;
			}
		}

		// if it is one of the end points, make it that point
		if (top !== idx && func(arr[top]) === value) {
			return {
				left: top,
				right: top
			};
		} else if (bottom !== idx && func(arr[bottom]) === value) {
			return {
				left: bottom,
				right: bottom
			};
		} else {
			return {
				left: bottom,
				right: top
			};
		}
	}
}

/**
 * Compare two arrays.
 *
 * @function remove
 * @param {array} arr1 An array to be compared
 * @param {array} arr2 An array to be compared
 * @param {function} func The comparison function
 * @return {object} an object containing the elements unique to the left, matched, and unqiue to the right
 **/
function compare(arr1, arr2, func) {
	var cmp,
	    left = [],
	    right = [],
	    leftI = [],
	    rightI = [];

	arr1 = arr1.slice(0);
	arr2 = arr2.slice(0);

	arr1.sort(func);
	arr2.sort(func);

	while (arr1.length > 0 && arr2.length > 0) {
		cmp = func(arr1[0], arr2[0]);

		if (cmp < 0) {
			left.push(arr1.shift());
		} else if (cmp > 0) {
			right.push(arr2.shift());
		} else {
			leftI.push(arr1.shift());
			rightI.push(arr2.shift());
		}
	}

	while (arr1.length) {
		left.push(arr1.shift());
	}

	while (arr2.length) {
		right.push(arr2.shift());
	}

	return {
		left: left,
		intersection: {
			left: leftI,
			right: rightI
		},
		right: right
	};
}

/**
 * Create a new array that is completely unique
 *
 * @function unique
 * @param {array} arr The array to be made unique
 * @param {function|boolean} sort If boolean === true, array is presorted.  If function, use to sort
 **/
function unique(arr, sort, uniqueFn) {
	var rtn = [];

	if (arr.length) {
		if (sort) {
			// more efficient because I can presort
			if (bmoor.isFunction(sort)) {
				arr = arr.slice(0).sort(sort);
			}

			var last = void 0;

			for (var i = 0, c = arr.length; i < c; i++) {
				var d = arr[i],
				    v = uniqueFn ? uniqueFn(d) : d;

				if (v !== last) {
					last = v;
					rtn.push(d);
				}
			}
		} else if (uniqueFn) {
			var hash = {};

			for (var _i = 0, _c = arr.length; _i < _c; _i++) {
				var _d = arr[_i],
				    _v = uniqueFn(_d);

				if (!hash[_v]) {
					hash[_v] = true;
					rtn.push(_d);
				}
			}
		} else {
			// greedy and inefficient
			for (var _i2 = 0, _c2 = arr.length; _i2 < _c2; _i2++) {
				var _d2 = arr[_i2];

				if (rtn.indexOf(_d2) === -1) {
					rtn.push(_d2);
				}
			}
		}
	}

	return rtn;
}

// I could probably make this sexier, like allow uniqueness algorithm, but I'm keeping it simple for now
function intersection(arr1, arr2) {
	var rtn = [];

	if (arr1.length > arr2.length) {
		var t = arr1;

		arr1 = arr2;
		arr2 = t;
	}

	for (var i = 0, c = arr1.length; i < c; i++) {
		var d = arr1[i];

		if (arr2.indexOf(d) !== -1) {
			rtn.push(d);
		}
	}

	return rtn;
}

function difference(arr1, arr2) {
	var rtn = [];

	for (var i = 0, c = arr1.length; i < c; i++) {
		var d = arr1[i];

		if (arr2.indexOf(d) === -1) {
			rtn.push(d);
		}
	}

	return rtn;
}

function equals(arr1, arr2) {
	if (arr1 === arr2) {
		return true;
	} else if (arr1.length !== arr2.length) {
		return false;
	} else {
		for (var i = 0, c = arr1.length; i < c; i++) {
			if (arr1[i] !== arr2[i]) {
				return false;
			}
		}

		return true;
	}
}

function watch(arr, insert, remove, preload) {
	if (insert) {
		var oldPush = arr.push.bind(arr);
		var oldUnshift = arr.unshift.bind(arr);

		arr.push = function () {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			args.forEach(insert);

			oldPush.apply(undefined, args);
		};

		arr.unshift = function () {
			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			args.forEach(insert);

			oldUnshift.apply(undefined, args);
		};

		if (preload) {
			arr.forEach(insert);
		}
	}

	if (remove) {
		var oldShift = arr.shift.bind(arr);
		var oldPop = arr.pop.bind(arr);
		var oldSplice = arr.splice.bind(arr);

		arr.shift = function () {
			remove(oldShift.apply(undefined, arguments));
		};

		arr.pop = function () {
			remove(oldPop.apply(undefined, arguments));
		};

		arr.splice = function () {
			var res = oldSplice.apply(undefined, arguments);

			res.forEach(remove);

			return res;
		};
	}
}

module.exports = {
	remove: remove,
	removeAll: removeAll,
	bisect: bisect,
	compare: compare,
	unique: unique,
	intersection: intersection,
	difference: difference,
	watch: watch,
	equals: equals
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.canReportError = canReportError;

var _Subscriber = __webpack_require__(4);

function canReportError(observer) {
    while (observer) {
        var _a = observer,
            closed_1 = _a.closed,
            destination = _a.destination,
            isStopped = _a.isStopped;
        if (closed_1 || isStopped) {
            return false;
        } else if (destination && destination instanceof _Subscriber.Subscriber) {
            observer = destination;
        } else {
            observer = null;
        }
    }
    return true;
}
//# sourceMappingURL=canReportError.js.map
/** PURE_IMPORTS_START _Subscriber PURE_IMPORTS_END */

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hostReportError = hostReportError;
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function hostReportError(err) {
    setTimeout(function () {
        throw err;
    }, 0);
}
//# sourceMappingURL=hostReportError.js.map

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isObject = isObject;
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isObject(x) {
    return x !== null && (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object';
}
//# sourceMappingURL=isObject.js.map

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var rxSubscriber = exports.rxSubscriber = typeof Symbol === 'function' ? /*@__PURE__*/Symbol('rxSubscriber') : '@@rxSubscriber_' + /*@__PURE__*/Math.random();
var $$rxSubscriber = exports.$$rxSubscriber = rxSubscriber;
//# sourceMappingURL=rxSubscriber.js.map

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noop = noop;
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function noop() {}
//# sourceMappingURL=noop.js.map

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.of = of;

var _isScheduler = __webpack_require__(7);

var _fromArray = __webpack_require__(15);

var _scheduleArray = __webpack_require__(31);

function of() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var scheduler = args[args.length - 1];
    if ((0, _isScheduler.isScheduler)(scheduler)) {
        args.pop();
        return (0, _scheduleArray.scheduleArray)(args, scheduler);
    } else {
        return (0, _fromArray.fromArray)(args);
    }
}
//# sourceMappingURL=of.js.map
/** PURE_IMPORTS_START _util_isScheduler,_fromArray,_scheduled_scheduleArray PURE_IMPORTS_END */

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.scheduleArray = scheduleArray;

var _Observable = __webpack_require__(0);

var _Subscription = __webpack_require__(3);

/** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
function scheduleArray(input, scheduler) {
    return new _Observable.Observable(function (subscriber) {
        var sub = new _Subscription.Subscription();
        var i = 0;
        sub.add(scheduler.schedule(function () {
            if (i === input.length) {
                subscriber.complete();
                return;
            }
            subscriber.next(input[i++]);
            if (!subscriber.closed) {
                sub.add(this.schedule());
            }
        }));
        return sub;
    });
}
//# sourceMappingURL=scheduleArray.js.map

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AsyncSubject = undefined;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _Subject = __webpack_require__(9);

var _Subscription = __webpack_require__(3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var AsyncSubject = /*@__PURE__*/function (_super) {
    tslib_1.__extends(AsyncSubject, _super);
    function AsyncSubject() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.value = null;
        _this.hasNext = false;
        _this.hasCompleted = false;
        return _this;
    }
    AsyncSubject.prototype._subscribe = function (subscriber) {
        if (this.hasError) {
            subscriber.error(this.thrownError);
            return _Subscription.Subscription.EMPTY;
        } else if (this.hasCompleted && this.hasNext) {
            subscriber.next(this.value);
            subscriber.complete();
            return _Subscription.Subscription.EMPTY;
        }
        return _super.prototype._subscribe.call(this, subscriber);
    };
    AsyncSubject.prototype.next = function (value) {
        if (!this.hasCompleted) {
            this.value = value;
            this.hasNext = true;
        }
    };
    AsyncSubject.prototype.error = function (error) {
        if (!this.hasCompleted) {
            _super.prototype.error.call(this, error);
        }
    };
    AsyncSubject.prototype.complete = function () {
        this.hasCompleted = true;
        if (this.hasNext) {
            _super.prototype.next.call(this, this.value);
        }
        _super.prototype.complete.call(this);
    };
    return AsyncSubject;
}(_Subject.Subject); /** PURE_IMPORTS_START tslib,_Subject,_Subscription PURE_IMPORTS_END */
exports.AsyncSubject = AsyncSubject;
//# sourceMappingURL=AsyncSubject.js.map

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.async = undefined;

var _AsyncAction = __webpack_require__(13);

var _AsyncScheduler = __webpack_require__(14);

/** PURE_IMPORTS_START _AsyncAction,_AsyncScheduler PURE_IMPORTS_END */
var async = /*@__PURE__*/exports.async = new _AsyncScheduler.AsyncScheduler(_AsyncAction.AsyncAction);
//# sourceMappingURL=async.js.map

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.identity = identity;
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function identity(x) {
    return x;
}
//# sourceMappingURL=identity.js.map

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.subscribeTo = undefined;

var _subscribeToArray = __webpack_require__(48);

var _subscribeToPromise = __webpack_require__(103);

var _subscribeToIterable = __webpack_require__(104);

var _subscribeToObservable = __webpack_require__(105);

var _isArrayLike = __webpack_require__(51);

var _isPromise = __webpack_require__(52);

var _isObject = __webpack_require__(27);

var _iterator = __webpack_require__(16);

var _observable = __webpack_require__(8);

var subscribeTo = exports.subscribeTo = function subscribeTo(result) {
    if (!!result && typeof result[_observable.observable] === 'function') {
        return (0, _subscribeToObservable.subscribeToObservable)(result);
    } else if ((0, _isArrayLike.isArrayLike)(result)) {
        return (0, _subscribeToArray.subscribeToArray)(result);
    } else if ((0, _isPromise.isPromise)(result)) {
        return (0, _subscribeToPromise.subscribeToPromise)(result);
    } else if (!!result && typeof result[_iterator.iterator] === 'function') {
        return (0, _subscribeToIterable.subscribeToIterable)(result);
    } else {
        var value = (0, _isObject.isObject)(result) ? 'an invalid object' : "'" + result + "'";
        var msg = "You provided " + value + " where a stream was expected." + ' You can provide an Observable, Promise, Array, or Iterable.';
        throw new TypeError(msg);
    }
};
//# sourceMappingURL=subscribeTo.js.map
/** PURE_IMPORTS_START _subscribeToArray,_subscribeToPromise,_subscribeToIterable,_subscribeToObservable,_isArrayLike,_isPromise,_isObject,_symbol_iterator,_symbol_observable PURE_IMPORTS_END */

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(2),
    makeGetter = bmoor.makeGetter,

// makeSetter = bmoor.makeSetter,
// Writer = require('./path/Writer.js').default,
// Reader = require('./path/Reader.js').default,
Tokenizer = __webpack_require__(57).default;

var Path = function () {
	// normal path: foo.bar
	// array path : foo[].bar
	function Path(path) {
		_classCallCheck(this, Path);

		if (path instanceof Tokenizer) {
			this.tokenizer = path;
		} else {
			this.tokenizer = new Tokenizer(path);
		}

		this.root = this.tokenizer.tokens[0];
		this.hasArray = this.root.isArray;
	}

	_createClass(Path, [{
		key: '_makeChild',
		value: function _makeChild(path) {
			return new this.constructor(path);
		}

		// converts something like [{a:1},{a:2}] to [1,2]
		// when given [].a

	}, {
		key: 'flatten',
		value: function flatten(obj) {
			var target = [obj],
			    chunks = this.tokenizer.getAccessors();

			while (chunks.length) {
				var chunk = chunks.shift(),
				    getter = makeGetter(chunk);

				target = target.map(getter).reduce(function (rtn, arr) {
					return rtn.concat(arr);
				}, []);
			}

			return target;
		}

		// call this method against 

	}, {
		key: 'exec',
		value: function exec(obj, fn) {
			this.flatten(obj).forEach(fn);
		}
	}, {
		key: 'root',
		value: function root(accessors) {
			return this.tokenizer.root(accessors);
		}
	}, {
		key: 'remainder',
		value: function remainder() {
			return this._makeChild(this.tokenizer.remainder());
		}
	}]);

	return Path;
}();

module.exports = {
	default: Path
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bmoor = __webpack_require__(2);

var _require = __webpack_require__(40),
    Subject = _require.Subject;

function makeMask(target, override) {
	var mask = bmoor.isArray(target) ? target.slice(0) : bmoor.object.mask(target);

	// I'm being lazy
	Object.keys(target).forEach(function (k) {
		if (bmoor.isObject(target[k])) {
			mask[k] = makeMask(target[k], bmoor.isObject(override) ? override[k] : null);
		}
	});

	if (override) {
		Object.keys(override).forEach(function (k) {
			var m = mask[k],
			    o = override[k],
			    bothObj = bmoor.isObject(m) && bmoor.isObject(o);

			if (!(bothObj && k in mask) && o !== m) {
				mask[k] = o;
			}
		});
	}

	return mask;
}

function _isDirty(obj, cmp) {
	if (!obj) {
		return false;
	}

	var keys = Object.keys(obj);

	if (!cmp) {
		cmp = Object.getPrototypeOf(obj);
	}

	for (var i = 0, c = keys.length; i < c; i++) {
		var k = keys[i];

		if (k.charAt(0) !== '$') {
			var t = obj[k];

			if (t === cmp[k]) {
				continue;
			} else if (!bmoor.isObject(t) || _isDirty(t, cmp[k])) {
				return true;
			}
		}
	}

	return false;
}

function _getChanges(obj, cmp) {
	if (!obj) {
		return;
	}

	var rtn = {},
	    valid = false,
	    keys = Object.keys(obj);

	if (!cmp) {
		cmp = Object.getPrototypeOf(obj);
	} else if (!bmoor.isObject(cmp)) {
		return bmoor.object.merge(rtn, obj);
	}

	for (var i = 0, c = keys.length; i < c; i++) {
		var k = keys[i];

		if (k.charAt(0) !== '$') {
			var datum = obj[k];

			if (bmoor.isObject(datum)) {
				var res = _getChanges(datum, cmp ? cmp[k] : null);

				if (res) {
					valid = true;
					rtn[k] = res;
				}
			} else if (!(k in cmp) || cmp[k] !== datum) {
				valid = true;
				rtn[k] = datum;
			}
		}
	}

	if (valid) {
		return rtn;
	}
}

function _map(obj, delta) {
	var keys = Object.keys(delta);

	for (var i = 0, c = keys.length; i < c; i++) {
		var k = keys[i],
		    d = delta[k],
		    o = obj[k];

		if (k.charAt(0) !== '$') {
			if (d !== o) {
				if (bmoor.isObject(d) && bmoor.isObject(o)) {
					_map(o, d);
				} else {
					obj[k] = d;
				}
			}
		}
	}
}

function _flatten(obj, cmp) {
	var rtn = {};

	if (!cmp) {
		cmp = Object.getPrototypeOf(obj);
	}

	Object.keys(cmp).forEach(function (key) {
		if (key.charAt(0) !== '$') {
			var v = cmp[key];

			if (bmoor.isObject(v) && !obj.hasOwnProperty(key)) {
				rtn[key] = bmoor.object.copy({}, v);
			} else {
				rtn[key] = v;
			}
		}
	});

	Object.keys(obj).forEach(function (key) {
		if (key.charAt(0) !== '$') {
			var v = obj[key];

			if (bmoor.isObject(v)) {
				rtn[key] = _flatten(v, cmp[key]);
			} else {
				rtn[key] = v;
			}
		}
	});

	return rtn;
}

var Proxy = function (_Subject) {
	_inherits(Proxy, _Subject);

	function Proxy(obj) {
		_classCallCheck(this, Proxy);

		var _this = _possibleConstructorReturn(this, (Proxy.__proto__ || Object.getPrototypeOf(Proxy)).call(this));

		_this._followers = {};

		_this.getDatum = function () {
			return obj;
		};
		return _this;
	}

	_createClass(Proxy, [{
		key: 'next',
		value: function next() {
			_get(Proxy.prototype.__proto__ || Object.getPrototypeOf(Proxy.prototype), 'next', this).call(this, this.getDatum());
		}

		// a 'deep copy' of the datum, but using mask() to have the original
		// as the object's prototype.

	}, {
		key: 'getMask',
		value: function getMask(override) {
			if (!this.mask || override) {
				this.mask = makeMask(this.getDatum(), override);
			}

			return this.mask;
		}

		// create a true deep copy of the datum.  if applyMask == true, 
		// we copy the mask on top as well.  Can be used for stringify then

	}, {
		key: 'copy',
		value: function copy(applyMask) {
			var rtn = {};

			bmoor.object.merge(rtn, this.getDatum());
			if (applyMask) {
				bmoor.object.merge(rtn, bmoor.isObject(applyMask) ? applyMask : this.getMask());
			}

			return rtn;
		}

		// create a shallow copy of the datum.  if applyMask == true, 
		// we copy the mask on top as well.  Can be used for stringify then

	}, {
		key: 'extend',
		value: function extend(applyMask) {
			var rtn = {};

			bmoor.object.extend(rtn, this.getDatum());
			if (applyMask) {
				bmoor.object.extend(rtn, bmoor.isObject(applyMask) ? applyMask : this.getMask());
			}

			return rtn;
		}
	}, {
		key: '$',
		value: function $(path) {
			return bmoor.get(this.getDatum(), path);
		}
	}, {
		key: 'getChanges',
		value: function getChanges() {
			return _getChanges(this.mask);
		}
	}, {
		key: 'isDirty',
		value: function isDirty() {
			return _isDirty(this.mask);
		}
	}, {
		key: 'map',
		value: function map(delta) {
			var mask = this.getMask();

			_map(mask, delta);

			return mask;
		}
	}, {
		key: 'merge',
		value: function merge(delta) {
			if (!delta) {
				delta = this.getChanges();
			} else {
				delta = _getChanges(delta, this.getDatum());
			}

			if (delta) {
				bmoor.object.merge(this.getDatum(), delta);

				this.mask = null;
				this.next();
			}
		}
	}, {
		key: 'flatten',
		value: function flatten(delta) {
			if (delta) {
				return _flatten(delta, this.getDatum());
			} else {
				return _flatten(this.getMask());
			}
		}
	}, {
		key: 'toJson',
		value: function toJson() {
			return JSON.stringify(this.getDatum());
		}
	}, {
		key: 'follow',
		value: function follow(fn, hash) {
			this._followers[hash] = this.subscribe(fn);
		}
	}, {
		key: 'unfollow',
		value: function unfollow(hash) {
			var unfollow = this._followers[hash];

			if (unfollow) {
				unfollow();
			}
		}
	}]);

	return Proxy;
}(Subject);

Proxy.map = _map;
Proxy.isDirty = _isDirty;
Proxy.flatten = _flatten;
Proxy.getChanges = _getChanges;

module.exports = Proxy;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var core = __webpack_require__(5);
var array = __webpack_require__(24);

var Eventing = function () {
	function Eventing() {
		_classCallCheck(this, Eventing);

		this._listeners = {};
	}

	_createClass(Eventing, [{
		key: 'on',
		value: function on(event, cb) {
			var listeners = null;

			if (!this._listeners[event]) {
				this._listeners[event] = [];
			}

			listeners = this._listeners[event];

			listeners.push(cb);

			return function clear$on() {
				listeners.splice(listeners.indexOf(cb), 1);
			};
		}
	}, {
		key: 'once',
		value: function once(event, cb) {
			var clear = null;
			var fn = function fn() {
				clear();
				cb.apply(undefined, arguments);
			};

			clear = this.on(event, fn);

			return clear;
		}
	}, {
		key: 'subscribe',
		value: function subscribe(subscriptions) {
			var dis = this;
			var kills = [];
			var events = Object.keys(subscriptions);

			events.forEach(function (event) {
				var action = subscriptions[event];

				kills.push(dis.on(event, action));
			});

			return function killAll() {
				kills.forEach(function (kill) {
					kill();
				});
			};
		}
	}, {
		key: 'trigger',
		value: function trigger(event) {
			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}

			if (this.hasWaiting(event)) {
				// slice and deep copy in case someone gets cute and unregisters
				try {
					var callbacks = this._listeners[event];
					return Promise.all(callbacks.slice(0).map(function (cb) {
						var fn = null;

						if (core.isArray(cb)) {
							if (cb.length) {
								fn = cb.shift();
							}

							if (!cb.length) {
								array.remove(callbacks, cb);
							}
						} else {
							fn = cb;
						}

						if (fn) {
							return fn.apply(undefined, args);
						} else {
							return;
						}
					}));
				} catch (ex) {
					return Promise.reject(ex);
				}
			} else {
				return Promise.resolve([]);
			}
		}
	}, {
		key: 'hasWaiting',
		value: function hasWaiting(event) {
			return !!this._listeners[event];
		}
	}]);

	return Eventing;
}();

module.exports = Eventing;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bmoor = __webpack_require__(2);
// const flowWindow = bmoor.flow.window;

var _require = __webpack_require__(40),
    ReplaySubject = _require.ReplaySubject;

var Subject = function (_ReplaySubject) {
	_inherits(Subject, _ReplaySubject);

	function Subject(data) {
		var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		_classCallCheck(this, Subject);

		var _this = _possibleConstructorReturn(this, (Subject.__proto__ || Object.getPrototypeOf(Subject)).call(this, 1));

		_this.settings = settings;

		if (data) {
			_this.data = data;
		}

		var oldNext = _this.next;
		_this.next = function () {
			_this._next();
		};
		_this._next = /*flowWindow(*/function () {
			if (oldNext) {
				oldNext.call(_this, _this.data);
			} else {
				_get(Subject.prototype.__proto__ || Object.getPrototypeOf(Subject.prototype), 'next', _this).call(_this, _this.data);
			}
		} /*, settings.windowMin||0, settings.windowMax||30)*/;
		return _this;
	}

	_createClass(Subject, [{
		key: 'on',
		value: function on(action, fn, errFn) {
			if (action !== 'next') {
				throw new Error('bmoor-data::Feed - on - only allows next');
			}

			return this.subscribe(function (data) {
				setTimeout(function () {
					fn(data);
				}, 0);
			}, errFn || function (err) {
				console.log('error', err);
			});
		}
	}, {
		key: 'once',
		value: function once(action, fn, errFn) {
			// TODO : reduce this to no action
			if (bmoor.isFunction(action)) {
				errFn = fn;
				fn = action;
				action = 'next';
			}

			if (action !== 'next') {
				throw new Error('bmoor-data::Feed - once - only allows next');
			}

			var child = this.subscribe(function (data) {
				setTimeout(function () {
					if (child) {
						child.unsubscribe();
					}

					return fn(data);
				}, 0);
			}, errFn || function (err) {
				console.log('error', err);
			});

			return child;
		}
	}, {
		key: 'callStack',
		value: function callStack(fns, errFn) {
			var child = this.subscribe(function (data) {
				fns.shift()(data);
			}, errFn || function (err) {
				console.log('error', err);
			});

			return child;
		}
	}, {
		key: 'promise',
		value: function promise() {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				_this2.once(resolve, reject);
			});
		}
	}]);

	return Subject;
}(ReplaySubject);

module.exports = {
	default: Subject,
	Subject: Subject
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Observable = __webpack_require__(0);

Object.defineProperty(exports, 'Observable', {
  enumerable: true,
  get: function get() {
    return _Observable.Observable;
  }
});

var _ConnectableObservable = __webpack_require__(79);

Object.defineProperty(exports, 'ConnectableObservable', {
  enumerable: true,
  get: function get() {
    return _ConnectableObservable.ConnectableObservable;
  }
});

var _groupBy = __webpack_require__(81);

Object.defineProperty(exports, 'GroupedObservable', {
  enumerable: true,
  get: function get() {
    return _groupBy.GroupedObservable;
  }
});

var _observable = __webpack_require__(8);

Object.defineProperty(exports, 'observable', {
  enumerable: true,
  get: function get() {
    return _observable.observable;
  }
});

var _Subject = __webpack_require__(9);

Object.defineProperty(exports, 'Subject', {
  enumerable: true,
  get: function get() {
    return _Subject.Subject;
  }
});

var _BehaviorSubject = __webpack_require__(82);

Object.defineProperty(exports, 'BehaviorSubject', {
  enumerable: true,
  get: function get() {
    return _BehaviorSubject.BehaviorSubject;
  }
});

var _ReplaySubject = __webpack_require__(83);

Object.defineProperty(exports, 'ReplaySubject', {
  enumerable: true,
  get: function get() {
    return _ReplaySubject.ReplaySubject;
  }
});

var _AsyncSubject = __webpack_require__(32);

Object.defineProperty(exports, 'AsyncSubject', {
  enumerable: true,
  get: function get() {
    return _AsyncSubject.AsyncSubject;
  }
});

var _asap = __webpack_require__(88);

Object.defineProperty(exports, 'asapScheduler', {
  enumerable: true,
  get: function get() {
    return _asap.asap;
  }
});

var _async = __webpack_require__(33);

Object.defineProperty(exports, 'asyncScheduler', {
  enumerable: true,
  get: function get() {
    return _async.async;
  }
});

var _queue = __webpack_require__(45);

Object.defineProperty(exports, 'queueScheduler', {
  enumerable: true,
  get: function get() {
    return _queue.queue;
  }
});

var _animationFrame = __webpack_require__(92);

Object.defineProperty(exports, 'animationFrameScheduler', {
  enumerable: true,
  get: function get() {
    return _animationFrame.animationFrame;
  }
});

var _VirtualTimeScheduler = __webpack_require__(95);

Object.defineProperty(exports, 'VirtualTimeScheduler', {
  enumerable: true,
  get: function get() {
    return _VirtualTimeScheduler.VirtualTimeScheduler;
  }
});
Object.defineProperty(exports, 'VirtualAction', {
  enumerable: true,
  get: function get() {
    return _VirtualTimeScheduler.VirtualAction;
  }
});

var _Scheduler = __webpack_require__(46);

Object.defineProperty(exports, 'Scheduler', {
  enumerable: true,
  get: function get() {
    return _Scheduler.Scheduler;
  }
});

var _Subscription = __webpack_require__(3);

Object.defineProperty(exports, 'Subscription', {
  enumerable: true,
  get: function get() {
    return _Subscription.Subscription;
  }
});

var _Subscriber = __webpack_require__(4);

Object.defineProperty(exports, 'Subscriber', {
  enumerable: true,
  get: function get() {
    return _Subscriber.Subscriber;
  }
});

var _Notification = __webpack_require__(47);

Object.defineProperty(exports, 'Notification', {
  enumerable: true,
  get: function get() {
    return _Notification.Notification;
  }
});
Object.defineProperty(exports, 'NotificationKind', {
  enumerable: true,
  get: function get() {
    return _Notification.NotificationKind;
  }
});

var _pipe = __webpack_require__(43);

Object.defineProperty(exports, 'pipe', {
  enumerable: true,
  get: function get() {
    return _pipe.pipe;
  }
});

var _noop = __webpack_require__(29);

Object.defineProperty(exports, 'noop', {
  enumerable: true,
  get: function get() {
    return _noop.noop;
  }
});

var _identity = __webpack_require__(34);

Object.defineProperty(exports, 'identity', {
  enumerable: true,
  get: function get() {
    return _identity.identity;
  }
});

var _isObservable = __webpack_require__(96);

Object.defineProperty(exports, 'isObservable', {
  enumerable: true,
  get: function get() {
    return _isObservable.isObservable;
  }
});

var _ArgumentOutOfRangeError = __webpack_require__(97);

Object.defineProperty(exports, 'ArgumentOutOfRangeError', {
  enumerable: true,
  get: function get() {
    return _ArgumentOutOfRangeError.ArgumentOutOfRangeError;
  }
});

var _EmptyError = __webpack_require__(98);

Object.defineProperty(exports, 'EmptyError', {
  enumerable: true,
  get: function get() {
    return _EmptyError.EmptyError;
  }
});

var _ObjectUnsubscribedError = __webpack_require__(19);

Object.defineProperty(exports, 'ObjectUnsubscribedError', {
  enumerable: true,
  get: function get() {
    return _ObjectUnsubscribedError.ObjectUnsubscribedError;
  }
});

var _UnsubscriptionError = __webpack_require__(42);

Object.defineProperty(exports, 'UnsubscriptionError', {
  enumerable: true,
  get: function get() {
    return _UnsubscriptionError.UnsubscriptionError;
  }
});

var _TimeoutError = __webpack_require__(99);

Object.defineProperty(exports, 'TimeoutError', {
  enumerable: true,
  get: function get() {
    return _TimeoutError.TimeoutError;
  }
});

var _bindCallback = __webpack_require__(100);

Object.defineProperty(exports, 'bindCallback', {
  enumerable: true,
  get: function get() {
    return _bindCallback.bindCallback;
  }
});

var _bindNodeCallback = __webpack_require__(101);

Object.defineProperty(exports, 'bindNodeCallback', {
  enumerable: true,
  get: function get() {
    return _bindNodeCallback.bindNodeCallback;
  }
});

var _combineLatest = __webpack_require__(102);

Object.defineProperty(exports, 'combineLatest', {
  enumerable: true,
  get: function get() {
    return _combineLatest.combineLatest;
  }
});

var _concat = __webpack_require__(106);

Object.defineProperty(exports, 'concat', {
  enumerable: true,
  get: function get() {
    return _concat.concat;
  }
});

var _defer = __webpack_require__(55);

Object.defineProperty(exports, 'defer', {
  enumerable: true,
  get: function get() {
    return _defer.defer;
  }
});

var _empty = __webpack_require__(10);

Object.defineProperty(exports, 'empty', {
  enumerable: true,
  get: function get() {
    return _empty.empty;
  }
});

var _forkJoin = __webpack_require__(114);

Object.defineProperty(exports, 'forkJoin', {
  enumerable: true,
  get: function get() {
    return _forkJoin.forkJoin;
  }
});

var _from = __webpack_require__(12);

Object.defineProperty(exports, 'from', {
  enumerable: true,
  get: function get() {
    return _from.from;
  }
});

var _fromEvent = __webpack_require__(115);

Object.defineProperty(exports, 'fromEvent', {
  enumerable: true,
  get: function get() {
    return _fromEvent.fromEvent;
  }
});

var _fromEventPattern = __webpack_require__(116);

Object.defineProperty(exports, 'fromEventPattern', {
  enumerable: true,
  get: function get() {
    return _fromEventPattern.fromEventPattern;
  }
});

var _generate = __webpack_require__(117);

Object.defineProperty(exports, 'generate', {
  enumerable: true,
  get: function get() {
    return _generate.generate;
  }
});

var _iif = __webpack_require__(118);

Object.defineProperty(exports, 'iif', {
  enumerable: true,
  get: function get() {
    return _iif.iif;
  }
});

var _interval = __webpack_require__(119);

Object.defineProperty(exports, 'interval', {
  enumerable: true,
  get: function get() {
    return _interval.interval;
  }
});

var _merge = __webpack_require__(120);

Object.defineProperty(exports, 'merge', {
  enumerable: true,
  get: function get() {
    return _merge.merge;
  }
});

var _never = __webpack_require__(121);

Object.defineProperty(exports, 'never', {
  enumerable: true,
  get: function get() {
    return _never.never;
  }
});

var _of = __webpack_require__(30);

Object.defineProperty(exports, 'of', {
  enumerable: true,
  get: function get() {
    return _of.of;
  }
});

var _onErrorResumeNext = __webpack_require__(122);

Object.defineProperty(exports, 'onErrorResumeNext', {
  enumerable: true,
  get: function get() {
    return _onErrorResumeNext.onErrorResumeNext;
  }
});

var _pairs = __webpack_require__(123);

Object.defineProperty(exports, 'pairs', {
  enumerable: true,
  get: function get() {
    return _pairs.pairs;
  }
});

var _partition = __webpack_require__(124);

Object.defineProperty(exports, 'partition', {
  enumerable: true,
  get: function get() {
    return _partition.partition;
  }
});

var _race = __webpack_require__(127);

Object.defineProperty(exports, 'race', {
  enumerable: true,
  get: function get() {
    return _race.race;
  }
});

var _range = __webpack_require__(128);

Object.defineProperty(exports, 'range', {
  enumerable: true,
  get: function get() {
    return _range.range;
  }
});

var _throwError = __webpack_require__(49);

Object.defineProperty(exports, 'throwError', {
  enumerable: true,
  get: function get() {
    return _throwError.throwError;
  }
});

var _timer = __webpack_require__(129);

Object.defineProperty(exports, 'timer', {
  enumerable: true,
  get: function get() {
    return _timer.timer;
  }
});

var _using = __webpack_require__(130);

Object.defineProperty(exports, 'using', {
  enumerable: true,
  get: function get() {
    return _using.using;
  }
});

var _zip = __webpack_require__(131);

Object.defineProperty(exports, 'zip', {
  enumerable: true,
  get: function get() {
    return _zip.zip;
  }
});

var _scheduled = __webpack_require__(54);

Object.defineProperty(exports, 'scheduled', {
  enumerable: true,
  get: function get() {
    return _scheduled.scheduled;
  }
});
Object.defineProperty(exports, 'EMPTY', {
  enumerable: true,
  get: function get() {
    return _empty.EMPTY;
  }
});
Object.defineProperty(exports, 'NEVER', {
  enumerable: true,
  get: function get() {
    return _never.NEVER;
  }
});

var _config = __webpack_require__(18);

Object.defineProperty(exports, 'config', {
  enumerable: true,
  get: function get() {
    return _config.config;
  }
});

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.empty = undefined;

var _config = __webpack_require__(18);

var _hostReportError = __webpack_require__(26);

/** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */
var empty = exports.empty = {
    closed: true,
    next: function next(value) {},
    error: function error(err) {
        if (_config.config.useDeprecatedSynchronousErrorHandling) {
            throw err;
        } else {
            (0, _hostReportError.hostReportError)(err);
        }
    },
    complete: function complete() {}
};
//# sourceMappingURL=Observer.js.map

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function UnsubscriptionErrorImpl(errors) {
    Error.call(this);
    this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) {
        return i + 1 + ") " + err.toString();
    }).join('\n  ') : '';
    this.name = 'UnsubscriptionError';
    this.errors = errors;
    return this;
}
UnsubscriptionErrorImpl.prototype = /*@__PURE__*/Object.create(Error.prototype);
var UnsubscriptionError = exports.UnsubscriptionError = UnsubscriptionErrorImpl;
//# sourceMappingURL=UnsubscriptionError.js.map

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pipe = pipe;
exports.pipeFromArray = pipeFromArray;

var _noop = __webpack_require__(29);

function pipe() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return pipeFromArray(fns);
} /** PURE_IMPORTS_START _noop PURE_IMPORTS_END */
function pipeFromArray(fns) {
    if (!fns) {
        return _noop.noop;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) {
            return fn(prev);
        }, input);
    };
}
//# sourceMappingURL=pipe.js.map

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SubjectSubscription = undefined;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _Subscription = __webpack_require__(3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
var SubjectSubscription = /*@__PURE__*/function (_super) {
    tslib_1.__extends(SubjectSubscription, _super);
    function SubjectSubscription(subject, subscriber) {
        var _this = _super.call(this) || this;
        _this.subject = subject;
        _this.subscriber = subscriber;
        _this.closed = false;
        return _this;
    }
    SubjectSubscription.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.closed = true;
        var subject = this.subject;
        var observers = subject.observers;
        this.subject = null;
        if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
            return;
        }
        var subscriberIndex = observers.indexOf(this.subscriber);
        if (subscriberIndex !== -1) {
            observers.splice(subscriberIndex, 1);
        }
    };
    return SubjectSubscription;
}(_Subscription.Subscription);
exports.SubjectSubscription = SubjectSubscription;
//# sourceMappingURL=SubjectSubscription.js.map

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queue = undefined;

var _QueueAction = __webpack_require__(84);

var _QueueScheduler = __webpack_require__(86);

/** PURE_IMPORTS_START _QueueAction,_QueueScheduler PURE_IMPORTS_END */
var queue = /*@__PURE__*/exports.queue = new _QueueScheduler.QueueScheduler(_QueueAction.QueueAction);
//# sourceMappingURL=queue.js.map

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var Scheduler = /*@__PURE__*/function () {
    function Scheduler(SchedulerAction, now) {
        if (now === void 0) {
            now = Scheduler.now;
        }
        this.SchedulerAction = SchedulerAction;
        this.now = now;
    }
    Scheduler.prototype.schedule = function (work, delay, state) {
        if (delay === void 0) {
            delay = 0;
        }
        return new this.SchedulerAction(this, work).schedule(state, delay);
    };
    Scheduler.now = function () {
        return Date.now();
    };
    return Scheduler;
}();
exports.Scheduler = Scheduler;
//# sourceMappingURL=Scheduler.js.map

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Notification = exports.NotificationKind = undefined;

var _empty = __webpack_require__(10);

var _of = __webpack_require__(30);

var _throwError = __webpack_require__(49);

var NotificationKind = exports.NotificationKind = undefined;
/*@__PURE__*/ /** PURE_IMPORTS_START _observable_empty,_observable_of,_observable_throwError PURE_IMPORTS_END */
(function (NotificationKind) {
    NotificationKind["NEXT"] = "N";
    NotificationKind["ERROR"] = "E";
    NotificationKind["COMPLETE"] = "C";
})(NotificationKind || (exports.NotificationKind = NotificationKind = {}));
var Notification = /*@__PURE__*/function () {
    function Notification(kind, value, error) {
        this.kind = kind;
        this.value = value;
        this.error = error;
        this.hasValue = kind === 'N';
    }
    Notification.prototype.observe = function (observer) {
        switch (this.kind) {
            case 'N':
                return observer.next && observer.next(this.value);
            case 'E':
                return observer.error && observer.error(this.error);
            case 'C':
                return observer.complete && observer.complete();
        }
    };
    Notification.prototype.do = function (next, error, complete) {
        var kind = this.kind;
        switch (kind) {
            case 'N':
                return next && next(this.value);
            case 'E':
                return error && error(this.error);
            case 'C':
                return complete && complete();
        }
    };
    Notification.prototype.accept = function (nextOrObserver, error, complete) {
        if (nextOrObserver && typeof nextOrObserver.next === 'function') {
            return this.observe(nextOrObserver);
        } else {
            return this.do(nextOrObserver, error, complete);
        }
    };
    Notification.prototype.toObservable = function () {
        var kind = this.kind;
        switch (kind) {
            case 'N':
                return (0, _of.of)(this.value);
            case 'E':
                return (0, _throwError.throwError)(this.error);
            case 'C':
                return (0, _empty.empty)();
        }
        throw new Error('unexpected notification kind value');
    };
    Notification.createNext = function (value) {
        if (typeof value !== 'undefined') {
            return new Notification('N', value);
        }
        return Notification.undefinedValueNotification;
    };
    Notification.createError = function (err) {
        return new Notification('E', undefined, err);
    };
    Notification.createComplete = function () {
        return Notification.completeNotification;
    };
    Notification.completeNotification = new Notification('C');
    Notification.undefinedValueNotification = new Notification('N', undefined);
    return Notification;
}();
exports.Notification = Notification;
//# sourceMappingURL=Notification.js.map

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var subscribeToArray = exports.subscribeToArray = function subscribeToArray(array) {
    return function (subscriber) {
        for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
            subscriber.next(array[i]);
        }
        subscriber.complete();
    };
};
//# sourceMappingURL=subscribeToArray.js.map

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.throwError = throwError;

var _Observable = __webpack_require__(0);

function throwError(error, scheduler) {
    if (!scheduler) {
        return new _Observable.Observable(function (subscriber) {
            return subscriber.error(error);
        });
    } else {
        return new _Observable.Observable(function (subscriber) {
            return scheduler.schedule(dispatch, 0, { error: error, subscriber: subscriber });
        });
    }
} /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */

function dispatch(_a) {
    var error = _a.error,
        subscriber = _a.subscriber;
    subscriber.error(error);
}
//# sourceMappingURL=throwError.js.map

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InnerSubscriber = undefined;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _Subscriber = __webpack_require__(4);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
var InnerSubscriber = /*@__PURE__*/function (_super) {
    tslib_1.__extends(InnerSubscriber, _super);
    function InnerSubscriber(parent, outerValue, outerIndex) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        _this.outerValue = outerValue;
        _this.outerIndex = outerIndex;
        _this.index = 0;
        return _this;
    }
    InnerSubscriber.prototype._next = function (value) {
        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
    };
    InnerSubscriber.prototype._error = function (error) {
        this.parent.notifyError(error, this);
        this.unsubscribe();
    };
    InnerSubscriber.prototype._complete = function () {
        this.parent.notifyComplete(this);
        this.unsubscribe();
    };
    return InnerSubscriber;
}(_Subscriber.Subscriber);
exports.InnerSubscriber = InnerSubscriber;
//# sourceMappingURL=InnerSubscriber.js.map

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var isArrayLike = exports.isArrayLike = function isArrayLike(x) {
  return x && typeof x.length === 'number' && typeof x !== 'function';
};
//# sourceMappingURL=isArrayLike.js.map

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isPromise = isPromise;
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isPromise(value) {
    return !!value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
}
//# sourceMappingURL=isPromise.js.map

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeAll = mergeAll;

var _mergeMap = __webpack_require__(108);

var _identity = __webpack_require__(34);

/** PURE_IMPORTS_START _mergeMap,_util_identity PURE_IMPORTS_END */
function mergeAll(concurrent) {
    if (concurrent === void 0) {
        concurrent = Number.POSITIVE_INFINITY;
    }
    return (0, _mergeMap.mergeMap)(_identity.identity, concurrent);
}
//# sourceMappingURL=mergeAll.js.map

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /** PURE_IMPORTS_START _scheduleObservable,_schedulePromise,_scheduleArray,_scheduleIterable,_util_isInteropObservable,_util_isPromise,_util_isArrayLike,_util_isIterable PURE_IMPORTS_END */


exports.scheduled = scheduled;

var _scheduleObservable = __webpack_require__(109);

var _schedulePromise = __webpack_require__(110);

var _scheduleArray = __webpack_require__(31);

var _scheduleIterable = __webpack_require__(111);

var _isInteropObservable = __webpack_require__(112);

var _isPromise = __webpack_require__(52);

var _isArrayLike = __webpack_require__(51);

var _isIterable = __webpack_require__(113);

function scheduled(input, scheduler) {
    if (input != null) {
        if ((0, _isInteropObservable.isInteropObservable)(input)) {
            return (0, _scheduleObservable.scheduleObservable)(input, scheduler);
        } else if ((0, _isPromise.isPromise)(input)) {
            return (0, _schedulePromise.schedulePromise)(input, scheduler);
        } else if ((0, _isArrayLike.isArrayLike)(input)) {
            return (0, _scheduleArray.scheduleArray)(input, scheduler);
        } else if ((0, _isIterable.isIterable)(input) || typeof input === 'string') {
            return (0, _scheduleIterable.scheduleIterable)(input, scheduler);
        }
    }
    throw new TypeError((input !== null && (typeof input === 'undefined' ? 'undefined' : _typeof(input)) || input) + ' is not observable');
}
//# sourceMappingURL=scheduled.js.map

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.defer = defer;

var _Observable = __webpack_require__(0);

var _from = __webpack_require__(12);

var _empty = __webpack_require__(10);

function defer(observableFactory) {
    return new _Observable.Observable(function (subscriber) {
        var input;
        try {
            input = observableFactory();
        } catch (err) {
            subscriber.error(err);
            return undefined;
        }
        var source = input ? (0, _from.from)(input) : (0, _empty.empty)();
        return source.subscribe(subscriber);
    });
}
//# sourceMappingURL=defer.js.map
/** PURE_IMPORTS_START _Observable,_from,_empty PURE_IMPORTS_END */

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isNumeric = isNumeric;

var _isArray = __webpack_require__(6);

function isNumeric(val) {
    return !(0, _isArray.isArray)(val) && val - parseFloat(val) + 1 >= 0;
}
//# sourceMappingURL=isNumeric.js.map
/** PURE_IMPORTS_START _isArray PURE_IMPORTS_END */

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(2);

function nextToken(path) {
	var i = 0,
	    c = path.length,
	    char = path.charAt(0),
	    more = true;

	var access = null;

	if (path.charAt(1) === ']') {
		// don't do anything
	} else if (char === '[') {
		var count = 0;

		do {
			if (char === '[') {
				count++;
			} else if (char === ']') {
				count--;
			}

			i++;
			char = path.charAt(i);
		} while (count && i < c);

		access = path.substring(2, i - 2);
	} else {
		do {
			if (char === '.' || char === '[') {
				more = false;
			} else {
				i++;
				char = path.charAt(i);
			}
		} while (more && i < c);

		access = path.substring(0, i);
	}

	var token = path.substring(0, i),
	    isArray = false;

	if (char === '[' && path.charAt(i + 1) === ']') {
		token += '[]';
		i += 2;

		isArray = true;
	}

	if (path.charAt(i) === '.') {
		i++;
	}

	var next = path.substring(i);

	return {
		value: token,
		next: next,
		done: false,
		isArray: isArray,
		accessor: access
	};
}

var Tokenizer = function () {
	function Tokenizer(path) {
		_classCallCheck(this, Tokenizer);

		var tokens;

		this.begin();

		if (bmoor.isString(path)) {
			tokens = [];

			while (path) {
				var cur = nextToken(path);
				tokens.push(cur);
				path = cur.next;
			}
		} else {
			tokens = path;
		}

		this.tokens = tokens;
	}

	_createClass(Tokenizer, [{
		key: '_makeChild',
		value: function _makeChild(arr) {
			return new this.constructor(arr);
		}
	}, {
		key: 'begin',
		value: function begin() {
			this.pos = 0;
		}
	}, {
		key: 'hasNext',
		value: function hasNext() {
			return this.tokens.length > this.pos + 1;
		}
	}, {
		key: 'next',
		value: function next() {
			var token = this.tokens[this.pos];

			if (token) {
				this.pos++;

				return token;
			} else {
				return {
					done: true
				};
			}
		}
	}, {
		key: 'getAccessors',
		value: function getAccessors() {
			var rtn = this.accessors;

			if (rtn === undefined) {
				var cur = null;

				rtn = [];

				for (var i = 0, c = this.tokens.length; i < c; i++) {
					var token = this.tokens[i];

					if (cur) {
						cur.push(token.accessor);
					} else if (token.accessor) {
						cur = [token.accessor];
					} else {
						cur = [];
					}

					if (token.isArray) {
						rtn.push(cur);
						cur = null;
					}
				}

				if (cur) {
					rtn.push(cur);
				}

				this.accessors = rtn;
			}

			return rtn.slice(0);
		}
	}, {
		key: 'chunk',
		value: function chunk() {
			var rtn = this.chunks;

			if (rtn === undefined) {
				var cur = null;

				rtn = [];

				for (var i = 0, c = this.tokens.length; i < c; i++) {
					var token = this.tokens[i];

					if (cur) {
						if (token.value.charAt(0) === '[') {
							cur += token.value;
						} else {
							cur += '.' + token.value;
						}
					} else {
						cur = token.value;
					}

					if (token.isArray) {
						rtn.push(cur);
						cur = null;
					}
				}

				if (cur) {
					rtn.push(cur);
				}

				this.chunks = rtn;
			}

			return rtn;
		}
	}, {
		key: 'findArray',
		value: function findArray() {
			if (this.arrayPos === undefined) {
				var found = -1,
				    tokens = this.tokens;

				for (var i = 0, c = tokens.length; i < c; i++) {
					if (tokens[i].isArray) {
						found = i;
						i = c;
					}
				}

				this.arrayPos = found;
			}

			return this.arrayPos;
		}
	}, {
		key: 'root',
		value: function root(accessors) {
			return (accessors ? this.getAccessors() : this.chunk())[0];
		}
	}, {
		key: 'remainder',
		value: function remainder() {
			var found = this.findArray();

			found++; // -1 goes to 0

			if (found && found < this.tokens.length) {
				return this._makeChild(this.tokens.slice(found));
			} else {
				return null;
			}
		}
	}]);

	return Tokenizer;
}();

module.exports = {
	default: Tokenizer
};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Feed = __webpack_require__(22);
var Actionable = __webpack_require__(140);
var ObjProxy = __webpack_require__(37);

var Collection = function (_Feed) {
	_inherits(Collection, _Feed);

	function Collection() {
		_classCallCheck(this, Collection);

		return _possibleConstructorReturn(this, (Collection.__proto__ || Object.getPrototypeOf(Collection)).apply(this, arguments));
	}

	_createClass(Collection, [{
		key: 'indexOf',


		//--- array methods
		value: function indexOf(obj, start) {
			return this.data.indexOf(obj, start);
		}

		//--- collection methods

	}, {
		key: '_track',
		value: function _track(datum) {
			var _this2 = this;

			if (datum instanceof ObjProxy) {
				datum.follow(function () {
					_this2.next();
				}, this.$$bmoorUid);
			}
		}
	}, {
		key: '_remove',
		value: function _remove(datum) {
			var dex = this.indexOf(datum);

			if (dex !== -1) {
				var rtn = this.data[dex];

				if (dex === 0) {
					this.data.shift();
				} else {
					this.data.splice(dex, 1);
				}

				if (datum instanceof ObjProxy) {
					datum.unfollow(this.$$bmoorUid);
				}

				return rtn;
			}
		}
	}, {
		key: 'remove',
		value: function remove(datum) {
			var rtn = this._remove(datum);

			if (rtn) {
				this.next();

				return rtn;
			}
		}
	}, {
		key: 'empty',
		value: function empty() {
			var arr = this.data;

			while (arr.length) {
				this._remove(arr[0]);
			}

			this.next();
		}

		// TODO : everything below needs to be removed in the next version

	}, {
		key: 'index',
		value: function index(search) {
			var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			return Actionable.prototype.index.call(this, search, settings);
		}
	}, {
		key: 'get',
		value: function get(search) {
			var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			return Actionable.prototype.get.call(this, search, settings);
		}

		//--- child generators

	}, {
		key: 'route',
		value: function route(search) {
			var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			return Actionable.prototype.route.call(this, search, settings);
		}

		// TODO : create the Compare class, then memorize this

	}, {
		key: 'sorted',
		value: function sorted(sortFn) {
			var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			return Actionable.prototype.sorted.call(this, sortFn, settings);
		}
	}, {
		key: 'map',
		value: function map(mapFn) {
			var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			return Actionable.prototype.map.call(this, mapFn, settings);
		}
	}, {
		key: '_filter',
		value: function _filter(search) {
			var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			return Actionable.prototype._filter.call(this, search, settings);
		}
	}, {
		key: 'filter',
		value: function filter(search) {
			var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			return Actionable.prototype.filter.call(this, search, settings);
		}
	}, {
		key: 'select',
		value: function select() {
			var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			return Actionable.prototype.select.call(this, settings);
		}

		// settings { size }

	}, {
		key: 'paginate',
		value: function paginate() {
			var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			return Actionable.prototype.paginate.call(this, settings);
		}
	}]);

	return Collection;
}(Feed);

module.exports = Collection;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(2);

function stack(old, getter) {
	if (old) {
		return function (obj) {
			return old(obj) + ':' + getter(obj);
		};
	} else {
		return function (obj) {
			return getter(obj);
		};
	}
}

function build(obj) {
	var fn,
	    keys,
	    values = [];

	if (bmoor.isArray(obj)) {
		keys = obj;
	} else {
		var flat = bmoor.object.implode(obj);

		keys = Object.keys(flat);
	}

	keys.sort().forEach(function (path) {
		fn = stack(fn, bmoor.makeGetter(path));

		values.push(path);
	});

	return {
		fn: fn,
		index: values.join(':')
	};
}

var Hash = function Hash(ops, settings) {
	var _this = this;

	_classCallCheck(this, Hash);

	var fn, hash;

	if (!settings) {
		settings = {};
	}

	if (bmoor.isFunction(ops)) {
		fn = ops;
		hash = ops.toString().replace(/[\s]+/g, '');
	} else if (bmoor.isObject(ops)) {
		var t = build(ops);

		fn = t.fn;
		hash = t.index;
	} else {
		throw new Error('I can not build a Hash out of ' + (typeof ops === 'undefined' ? 'undefined' : _typeof(ops)));
	}

	this.hash = settings.hash || hash;
	this.fn = fn;
	this.parse = function (search) {
		if (bmoor.isObject(search)) {
			return _this.fn(search);
		} else {
			return search;
		}
	};
	this.go = function (search) {
		if (settings.massage && bmoor.isObject(search)) {
			search = settings.massage(search);
		}

		return _this.parse(search);
	};
};

module.exports = Hash;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(2);

function stack(old, getter, value) {
	if (old) {
		return function (obj) {
			if (getter(obj) === value) {
				return old(obj);
			} else {
				return false;
			}
		};
	} else {
		return function (obj) {
			return getter(obj) === value;
		};
	}
}

function build(obj) {
	var fn,
	    flat = bmoor.object.implode(obj),
	    values = [];

	Object.keys(flat).sort().forEach(function (path) {
		var v = flat[path];

		fn = stack(fn, bmoor.makeGetter(path), v);

		values.push(path + '=' + v);
	});

	return {
		fn: fn,
		index: values.join(':')
	};
}

var Test = function Test(ops, settings) {
	var _this = this;

	_classCallCheck(this, Test);

	var fn, hash;

	if (!settings) {
		settings = {};
	}

	if (bmoor.isFunction(ops)) {
		fn = ops;
		hash = ops.toString().replace(/[\s]+/g, '');
	} else if (bmoor.isObject(ops)) {
		var t = build(ops);

		fn = t.fn;
		hash = t.index;
	} else {
		throw new Error('I can not build a Test out of ' + (typeof ops === 'undefined' ? 'undefined' : _typeof(ops)));
	}

	this.hash = settings.hash || hash;
	this.parse = fn;
	this.go = function (search) {
		if (settings.massage) {
			search = settings.massage(search);
		}

		return _this.parse(search);
	};
};

module.exports = Test;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Memory = __webpack_require__(2).Memory,
    schemas = {
	default: Memory.use('data-structure-schema')
};

module.exports = {
	default: schemas.default,
	get: function get(name) {
		var schema;

		if (name !== 'default') {
			name = 'data-structure-schema-' + name;
		}

		schema = schemas[name];
		if (!schema) {
			schema = schemas[name] = Memory.use(name);
		}

		return schema;
	}
};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(63);

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	Feed: __webpack_require__(22),
	Pool: __webpack_require__(132),
	Collection: __webpack_require__(58),
	collection: {
		Proxied: __webpack_require__(148)
	},
	object: {
		Proxy: __webpack_require__(37),
		Test: __webpack_require__(60),
		Hash: __webpack_require__(59)
	},
	structure: {
		Model: __webpack_require__(149).default,
		Schema: __webpack_require__(61).default
	}
};

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = __webpack_require__(5),
    regex = {};

// TODO: put in a polyfill block
if (typeof window !== 'undefined' && !bmoor.isFunction(window.CustomEvent)) {

	var _CustomEvent = function _CustomEvent(event, params) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };

		var evt = document.createEvent('CustomEvent');

		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

		return evt;
	};

	_CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = _CustomEvent;
}

if (typeof Element !== 'undefined' && !Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector;
}

function getReg(className) {
	var reg = regex[className];

	if (!reg) {
		reg = new RegExp('(?:^|\\s)' + className + '(?!\\S)');
		regex[className] = reg;
	}

	return reg;
}

function getScrollPosition(doc) {
	if (!doc) {
		doc = document;
	}

	return {
		left: window.pageXOffset || (doc.documentElement || doc.body).scrollLeft,
		top: window.pageYOffset || (doc.documentElement || doc.body).scrollTop
	};
}

function getBoundryBox(element) {
	return element.getBoundingClientRect();
}

function centerOn(element, target, doc) {
	var el = getBoundryBox(element),
	    targ = getBoundryBox(target),
	    pos = getScrollPosition(doc);

	if (!doc) {
		doc = document;
	}

	element.style.top = pos.top + targ.top + targ.height / 2 - el.height / 2;
	element.style.left = pos.left + targ.left + targ.width / 2 - el.width / 2;
	element.style.right = '';
	element.style.bottom = '';

	element.style.position = 'absolute';
	doc.body.appendChild(element);
}

function showOn(element, target, doc) {
	var direction,
	    targ = getBoundryBox(target),
	    x = targ.x + targ.width / 2,
	    y = targ.y + targ.height / 2,
	    centerX = window.innerWidth / 2,
	    centerY = window.innerHeight / 2,
	    pos = getScrollPosition(doc);

	if (!doc) {
		doc = document;
	}

	if (x < centerX) {
		// right side has more room
		direction = 'r';
		element.style.left = pos.left + targ.right;
		element.style.right = '';
	} else {
		// left side has more room
		//element.style.left = targ.left - el.width - offset;
		direction = 'l';
		element.style.right = window.innerWidth - targ.left - pos.left;
		element.style.left = '';
	}

	if (y < centerY) {
		// more room on bottom
		direction = 'b' + direction;
		element.style.top = pos.top + targ.bottom;
		element.style.bottom = '';
	} else {
		// more room on top
		direction = 't' + direction;
		element.style.bottom = window.innerHeight - targ.top - pos.top;
		element.style.top = '';
	}

	element.style.position = 'absolute';
	doc.body.appendChild(element);

	return direction;
}

function massage(elements) {
	if (!bmoor.isArrayLike(elements)) {
		elements = [elements];
	}

	return elements;
}

function getDomElement(element, doc) {
	if (!doc) {
		doc = document;
	}

	if (bmoor.isString(element)) {
		return doc.querySelector(element);
	} else {
		return element;
	}
}

function getDomCollection(elements, doc) {
	var i,
	    c,
	    j,
	    co,
	    el,
	    selection,
	    els = [];

	if (!doc) {
		doc = document;
	}

	elements = massage(elements);

	for (i = 0, c = elements.length; i < c; i++) {
		el = elements[i];
		if (bmoor.isString(el)) {
			selection = doc.querySelectorAll(el);
			for (j = 0, co = selection.length; j < co; j++) {
				els.push(selection[j]);
			}
		} else {
			els.push(el);
		}
	}

	return els;
}

function addClass(elements, className) {
	var i,
	    c,
	    node,
	    baseClass,
	    reg = getReg(className);

	elements = massage(elements);

	for (i = 0, c = elements.length; i < c; i++) {
		node = elements[i];
		baseClass = node.getAttribute('class') || '';

		if (!baseClass.match(reg)) {
			node.setAttribute('class', baseClass + ' ' + className);
		}
	}
}

function removeClass(elements, className) {
	var i,
	    c,
	    node,
	    reg = getReg(className);

	elements = massage(elements);

	for (i = 0, c = elements.length; i < c; i++) {
		node = elements[i];
		node.setAttribute('class', (node.getAttribute('class') || '').replace(reg, ''));
	}
}

function bringForward(elements) {
	var i, c, node;

	elements = massage(elements);

	for (i = 0, c = elements.length; i < c; i++) {
		node = elements[i];

		if (node.parentNode) {
			node.parentNode.appendChild(node);
		}
	}
}

function triggerEvent(node, eventName, eventData, eventSettings) {
	if (node.dispatchEvent) {
		if (!eventSettings) {
			eventSettings = { 'view': window, 'bubbles': true, 'cancelable': true };
		} else {
			if (eventSettings.bubbles === undefined) {
				eventSettings.bubbles = true;
			}
			if (eventSettings.cancelable === undefined) {
				eventSettings.cancelable = true;
			}
		}

		eventSettings.detail = eventData;

		var event = new CustomEvent(eventName, eventSettings);
		event.$bmoor = true; // allow detection of bmoor events

		node.dispatchEvent(event);
	} else if (node.fireEvent) {
		var doc = void 0;

		if (!bmoor.isString(eventName)) {
			throw new Error('Can not throw custom events in IE');
		}

		if (node.ownerDocument) {
			doc = node.ownerDocument;
		} else if (node.nodeType === 9) {
			// the node may be the document itself, nodeType 9 = DOCUMENT_NODE
			doc = node;
		} else if (typeof document !== 'undefined') {
			doc = document;
		} else {
			throw new Error('Invalid node passed to fireEvent: ' + node.id);
		}

		var _event = doc.createEventObject();
		_event.detail = eventData;
		_event.$bmoor = true; // allow detection of bmoor events

		node.fireEvent('on' + eventName, _event);
	} else {
		throw new Error('We can not trigger events here');
	}
}

function onEvent(node, eventName, cb, qualifier) {
	node.addEventListener(eventName, function (event) {
		if (qualifier && !(event.target || event.srcElement).matches(qualifier)) {
			return;
		}

		cb(event.detail, event);
	});
}

module.exports = {
	getScrollPosition: getScrollPosition,
	getBoundryBox: getBoundryBox,
	getDomElement: getDomElement,
	getDomCollection: getDomCollection,
	showOn: showOn,
	centerOn: centerOn,
	addClass: addClass,
	removeClass: removeClass,
	bringForward: bringForward,
	triggerEvent: triggerEvent,
	onEvent: onEvent,
	on: function on(node, settings) {
		Object.keys(settings).forEach(function (eventName) {
			var ops = settings[eventName];

			if (bmoor.isFunction(ops)) {
				onEvent(node, eventName, ops);
			} else {
				Object.keys(ops).forEach(function (qualifier) {
					var cb = ops[qualifier];

					onEvent(node, eventName, cb, qualifier);
				});
			}
		});
	}
};

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Array helper functions
 * @module bmoor.data
 **/

var _id = 0;

function nextUid() {
	return ++_id;
}

function setUid(obj) {
	var t = obj.$$bmoorUid;

	if (!t) {
		t = obj.$$bmoorUid = nextUid();
	}

	return t;
}

function getUid(obj) {
	if (!obj.$$bmoorUid) {
		setUid(obj);
	}

	return obj.$$bmoorUid;
}

module.exports = {
	setUid: setUid,
	getUid: getUid
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	soon: __webpack_require__(67),
	debounce: __webpack_require__(68),
	window: __webpack_require__(23)
};

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (cb, time, settings) {
	var ctx, args, timeout;

	if (!settings) {
		settings = {};
	}

	function fire() {
		timeout = null;
		cb.apply(settings.context || ctx, args);
	}

	var fn = function sooned() {
		ctx = this;
		args = arguments;

		if (!timeout) {
			timeout = setTimeout(fire, time);
		}
	};

	fn.clear = function () {
		clearTimeout(timeout);
		timeout = null;
	};

	fn.flush = function () {
		fire();
		fn.clear();
	};

	fn.active = function () {
		return !!timeout;
	};

	return fn;
};

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (cb, time, settings) {
	var ctx, args, limit, timeout;

	if (!settings) {
		settings = {};
	}

	function fire() {
		timeout = null;
		cb.apply(settings.context || ctx, args);
	}

	function run() {
		var now = Date.now();

		if (now >= limit) {
			fire();
		} else {
			timeout = setTimeout(run, limit - now);
		}
	}

	var fn = function debounced() {
		var now = Date.now();

		ctx = this;
		args = arguments;
		limit = now + time;

		if (!timeout) {
			timeout = setTimeout(run, time);
		}
	};

	fn.clear = function () {
		clearTimeout(timeout);
		timeout = null;
		limit = null;
	};

	fn.flush = function () {
		fire();
		fn.clear();
	};

	fn.shift = function (diff) {
		limit += diff;
	};

	fn.active = function () {
		return !!timeout;
	};

	return fn;
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = __webpack_require__(5),
    mixin = __webpack_require__(70),
    plugin = __webpack_require__(71),
    decorate = __webpack_require__(72);

function proc(action, proto, def) {
	var i, c;

	if (bmoor.isArray(def)) {
		for (i = 0, c = def.length; i < c; i++) {
			action(proto, def[i]);
		}
	} else {
		action(proto, def);
	}
}

function maker(root, config, base) {
	if (!base) {
		base = function BmoorPrototype() {};

		if (config) {
			if (bmoor.isFunction(root)) {
				base = function BmoorPrototype() {
					root.apply(this, arguments);
				};

				base.prototype = Object.create(root.prototype);
			} else {
				base.prototype = Object.create(root);
			}
		} else {
			config = root;
		}
	}

	if (config.mixin) {
		proc(mixin, base.prototype, config.mixin);
	}

	if (config.decorate) {
		proc(decorate, base.prototype, config.decorate);
	}

	if (config.plugin) {
		proc(plugin, base.prototype, config.plugin);
	}

	return base;
}

maker.mixin = mixin;
maker.decorate = decorate;
maker.plugin = plugin;

module.exports = maker;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = __webpack_require__(5);

module.exports = function (to, from) {
	bmoor.iterate(from, function (val, key) {
		to[key] = val;
	});
};

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var bmoor = __webpack_require__(5);

function override(key, target, action, plugin) {
	var old = target[key];

	if (old === undefined) {
		if (bmoor.isFunction(action)) {
			target[key] = function () {
				return action.apply(plugin, arguments);
			};
		} else {
			target[key] = action;
		}
	} else {
		if (bmoor.isFunction(action)) {
			if (bmoor.isFunction(old)) {
				target[key] = function () {
					var backup = plugin.$old,
					    reference = plugin.$target,
					    rtn;

					plugin.$target = target;
					plugin.$old = function () {
						return old.apply(target, arguments);
					};

					rtn = action.apply(plugin, arguments);

					plugin.$old = backup;
					plugin.$target = reference;

					return rtn;
				};
			} else {
				console.log('attempting to plug-n-play ' + key + ' an instance of ' + (typeof old === 'undefined' ? 'undefined' : _typeof(old)));
			}
		} else {
			console.log('attempting to plug-n-play with ' + key + ' and instance of ' + (typeof action === 'undefined' ? 'undefined' : _typeof(action)));
		}
	}
}

module.exports = function (to, from, ctx) {
	bmoor.iterate(from, function (val, key) {
		override(key, to, val, ctx);
	});
};

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var bmoor = __webpack_require__(5);

function override(key, target, action) {
	var old = target[key];

	if (old === undefined) {
		target[key] = action;
	} else {
		if (bmoor.isFunction(action)) {
			if (bmoor.isFunction(old)) {
				target[key] = function () {
					var backup = this.$old,
					    rtn;

					this.$old = old;

					rtn = action.apply(this, arguments);

					this.$old = backup;

					return rtn;
				};
			} else {
				console.log('attempting to decorate ' + key + ' an instance of ' + (typeof old === 'undefined' ? 'undefined' : _typeof(old)));
			}
		} else {
			console.log('attempting to decorate with ' + key + ' and instance of ' + (typeof action === 'undefined' ? 'undefined' : _typeof(action)));
		}
	}
}

module.exports = function (to, from) {
	bmoor.iterate(from, function (val, key) {
		override(key, to, val);
	});
};

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Object helper functions
 * @module bmoor.object
 **/

var bmoor = __webpack_require__(5);

function values(obj) {
	var res = [];

	bmoor.naked(obj, function (v) {
		res.push(v);
	});

	return res;
}

function keys(obj) {
	var res = [];

	if (Object.keys) {
		return Object.keys(obj);
	} else {
		bmoor.naked(obj, function (v, key) {
			res.push(key);
		});

		return res;
	}
}

/**
 * Takes a hash and uses the indexs as namespaces to add properties to an objs
 *
 * @function explode
 * @param {object} target The object to map the variables onto
 * @param {object} mappings An object orientended as [ namespace ] => value
 * @return {object} The object that has had content mapped into it
 **/
function explode(target, mappings) {
	if (!mappings) {
		mappings = target;
		target = {};
	}

	bmoor.iterate(mappings, function (val, mapping) {
		bmoor.set(target, mapping, val);
	});

	return target;
}

function makeExploder(paths) {
	var fn;

	paths.forEach(function (path) {
		var old = fn,
		    setter = bmoor.makeSetter(path);

		if (old) {
			fn = function fn(ctx, obj) {
				setter(ctx, obj[path]);
				old(ctx, obj);
			};
		} else {
			fn = function fn(ctx, obj) {
				setter(ctx, obj[path]);
			};
		}
	});

	return function (obj) {
		var rtn = {};

		fn(rtn, obj);

		return rtn;
	};
}

function implode(obj, ignore) {
	var rtn = {};

	if (!ignore) {
		ignore = {};
	}

	bmoor.iterate(obj, function (val, key) {
		var t = ignore[key];

		if (bmoor.isObject(val)) {
			if (t === false) {
				rtn[key] = val;
			} else if (!t || bmoor.isObject(t)) {
				bmoor.iterate(implode(val, t), function (v, k) {
					rtn[key + '.' + k] = v;
				});
			}
		} else if (!t) {
			rtn[key] = val;
		}
	});

	return rtn;
}

/**
 * Create a new instance from an object and some arguments
 *
 * @function mask
 * @param {function} obj The basis for the constructor
 * @param {array} args The arguments to pass to the constructor
 * @return {object} The new object that has been constructed
 **/
function mask(obj) {
	if (Object.create) {
		var T = function Masked() {};

		T.prototype = obj;

		return new T();
	} else {
		return Object.create(obj);
	}
}

/**
 * Create a new instance from an object and some arguments.  This is a shallow copy to <- from[...]
 * 
 * @function extend
 * @param {object} to Destination object.
 * @param {...object} src Source object(s).
 * @returns {object} Reference to `dst`.
 **/
function extend(to) {
	bmoor.loop(arguments, function (cpy) {
		if (cpy !== to) {
			if (to && to.extend) {
				to.extend(cpy);
			} else {
				bmoor.iterate(cpy, function (value, key) {
					to[key] = value;
				});
			}
		}
	});

	return to;
}

function empty(to) {
	bmoor.iterate(to, function (v, k) {
		delete to[k]; // TODO : would it be ok to set it to undefined?
	});
}

function copy(to) {
	empty(to);

	return extend.apply(undefined, arguments);
}

// Deep copy version of extend
function merge(to) {
	var from,
	    i,
	    c,
	    m = function m(val, key) {
		to[key] = merge(to[key], val);
	};

	for (i = 1, c = arguments.length; i < c; i++) {
		from = arguments[i];

		if (to === from) {
			continue;
		} else if (to && to.merge) {
			to.merge(from);
		} else if (!bmoor.isObject(from)) {
			to = from;
		} else if (!bmoor.isObject(to)) {
			to = merge({}, from);
		} else {
			bmoor.safe(from, m);
		}
	}

	return to;
}

/**
 * A general comparison algorithm to test if two objects are equal
 *
 * @function equals
 * @param {object} obj1 The object to copy the content from
 * @param {object} obj2 The object into which to copy the content
 * @preturns {boolean}
 **/
function equals(obj1, obj2) {
	var t1 = typeof obj1 === 'undefined' ? 'undefined' : _typeof(obj1),
	    t2 = typeof obj2 === 'undefined' ? 'undefined' : _typeof(obj2),
	    c,
	    i,
	    keyCheck;

	if (obj1 === obj2) {
		return true;
	} else if (obj1 !== obj1 && obj2 !== obj2) {
		return true; // silly NaN
	} else if (obj1 === null || obj1 === undefined || obj2 === null || obj2 === undefined) {
		return false; // undefined or null
	} else if (obj1.equals) {
		return obj1.equals(obj2);
	} else if (obj2.equals) {
		return obj2.equals(obj1); // because maybe somene wants a class to be able to equal a simple object
	} else if (t1 === t2) {
		if (t1 === 'object') {
			if (bmoor.isArrayLike(obj1)) {
				if (!bmoor.isArrayLike(obj2)) {
					return false;
				}

				if ((c = obj1.length) === obj2.length) {
					for (i = 0; i < c; i++) {
						if (!equals(obj1[i], obj2[i])) {
							return false;
						}
					}

					return true;
				}
			} else if (!bmoor.isArrayLike(obj2)) {
				keyCheck = {};
				for (i in obj1) {
					if (obj1.hasOwnProperty(i)) {
						if (!equals(obj1[i], obj2[i])) {
							return false;
						}

						keyCheck[i] = true;
					}
				}

				for (i in obj2) {
					if (obj2.hasOwnProperty(i)) {
						if (!keyCheck && obj2[i] !== undefined) {
							return false;
						}
					}
				}
			}
		}
	}

	return false;
}

// TODO : property watch

module.exports = {
	keys: keys,
	values: values,
	explode: explode,
	makeExploder: makeExploder,
	implode: implode,
	mask: mask,
	extend: extend,
	empty: empty,
	copy: copy,
	merge: merge,
	equals: equals
};

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = __webpack_require__(5);

/**
 * Array helper functions
 * @module bmoor.string
 **/

function trim(str, chr) {
	if (!chr) {
		chr = '\\s';
	}
	return str.replace(new RegExp('^' + chr + '+|' + chr + '+$', 'g'), '');
}

function ltrim(str, chr) {
	if (!chr) {
		chr = '\\s';
	}
	return str.replace(new RegExp('^' + chr + '+', 'g'), '');
}

function rtrim(str, chr) {
	if (!chr) {
		chr = '\\s';
	}
	return str.replace(new RegExp(chr + '+$', 'g'), '');
}

// TODO : eventually I will make getCommands and getFormatter more complicated, but for now
//        they work by staying simple
function getCommands(str) {
	var commands = str.split('|');

	commands.forEach(function (command, key) {
		var args = command.split(':');

		args.forEach(function (arg, k) {
			args[k] = trim(arg);
		});

		commands[key] = {
			command: command,
			method: args.shift(),
			args: args
		};
	});

	return commands;
}

function stackFunctions(newer, older) {
	return function (o) {
		return older(newer(o));
	};
}

var filters = {
	precision: function precision(dec) {
		dec = parseInt(dec, 10);

		return function (num) {
			return parseFloat(num, 10).toFixed(dec);
		};
	},
	currency: function currency() {
		return function (num) {
			return '$' + num;
		};
	},
	url: function url() {
		return function (param) {
			return encodeURIComponent(param);
		};
	}
};

function doFilters(ters) {
	var fn, command, filter;

	while (ters.length) {
		command = ters.pop();
		fn = filters[command.method];

		if (fn) {
			fn = fn.apply(null, command.args);

			if (filter) {
				filter = stackFunctions(fn, filter);
			} else {
				filter = fn;
			}
		}
	}

	return filter;
}

function doVariable(lines) {
	var fn, rtn, dex, line, getter, command, commands, remainder;

	if (!lines.length) {
		return null;
	} else {
		line = lines.shift();
		dex = line.indexOf('}}');
		fn = doVariable(lines);

		if (dex === -1) {
			return function () {
				return '| no close |';
			};
		} else if (dex === 0) {
			// is looks like this {{}}
			remainder = line.substr(2);
			getter = function getter(o) {
				if (bmoor.isObject(o)) {
					return JSON.stringify(o);
				} else {
					return o;
				}
			};
		} else {
			commands = getCommands(line.substr(0, dex));
			command = commands.shift().command;
			remainder = line.substr(dex + 2);
			getter = bmoor.makeGetter(command);

			if (commands.length) {
				commands = doFilters(commands, getter);

				if (commands) {
					getter = stackFunctions(getter, commands);
				}
			}
		}

		//let's optimize this a bit
		if (fn) {
			// we have a child method
			rtn = function rtn(obj) {
				return getter(obj) + remainder + fn(obj);
			};
			rtn.$vars = fn.$vars;
		} else {
			// this is the last variable
			rtn = function rtn(obj) {
				return getter(obj) + remainder;
			};
			rtn.$vars = [];
		}

		if (command) {
			rtn.$vars.push(command);
		}

		return rtn;
	}
}

function getFormatter(str) {
	var fn,
	    rtn,
	    lines = str.split(/{{/g);

	if (lines.length > 1) {
		str = lines.shift();
		fn = doVariable(lines);
		rtn = function rtn(obj) {
			return str + fn(obj);
		};
		rtn.$vars = fn.$vars;
	} else {
		rtn = function rtn() {
			return str;
		};
		rtn.$vars = [];
	}

	return rtn;
}

getFormatter.filters = filters;

module.exports = {
	trim: trim,
	ltrim: ltrim,
	rtrim: rtrim,
	getCommands: getCommands,
	getFormatter: getFormatter
};

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var window = __webpack_require__(23);

function always(promise, func) {
	promise.then(func, func);
	return promise;
}

function stack(calls, settings) {

	if (!calls) {
		throw new Error('calling stack with no call?');
	}

	if (!settings) {
		settings = {};
	}

	var min = settings.min || 1,
	    max = settings.max || 10,
	    limit = settings.limit || 5,
	    update = window(settings.update || function () {}, min, max);

	return new Promise(function (resolve, reject) {
		var run,
		    timeout,
		    errors = [],
		    active = 0,
		    callStack = calls.slice(0);

		function registerError(err) {
			errors.push(err);
		}

		function next() {
			active--;

			update({ active: active, remaining: callStack.length });

			if (callStack.length) {
				if (!timeout) {
					timeout = setTimeout(run, 1);
				}
			} else if (!active) {
				if (errors.length) {
					reject(errors);
				} else {
					resolve();
				}
			}
		}

		run = function run() {
			timeout = null;

			while (active < limit && callStack.length) {
				var fn = callStack.pop();

				active++;

				fn().catch(registerError).then(next);
			}
		};

		run();
	});
}

function hash(obj) {
	var rtn = {};

	return Promise.all(Object.keys(obj).map(function (key) {
		var p = obj[key];

		if (p && p.then) {
			p.then(function (v) {
				rtn[key] = v;
			});
		} else {
			rtn[key] = p;
		}

		return p;
	})).then(function () {
		return rtn;
	});
}

module.exports = {
	hash: hash,
	stack: stack,
	always: always
};

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var master = {};

var Memory = function () {
	function Memory(name) {
		_classCallCheck(this, Memory);

		var index = {};

		this.name = name;
		this.get = function (name) {
			return index[name];
		};

		this.check = function (name) {
			console.log('Memory::check will soon removed');
			return index[name];
		};

		this.isSet = function (name) {
			return !!index[name];
		};

		this.register = function (name, obj) {
			index[name] = obj;
		};

		this.clear = function (name) {
			if (name in index) {
				delete index[name];
			}
		};

		this.keys = function () {
			return Object.keys(index);
		};
	}

	_createClass(Memory, [{
		key: 'import',
		value: function _import(json) {
			var _this = this;

			Object.keys(json).forEach(function (key) {
				_this.register(key, json[key]);
			});
		}
	}, {
		key: 'export',
		value: function _export() {
			var _this2 = this;

			return this.keys().reduce(function (rtn, key) {
				rtn[key] = _this2.get(key);

				return rtn;
			}, {});
		}
	}]);

	return Memory;
}();

module.exports = {
	Memory: Memory,
	use: function use(title) {
		var rtn = master[title];

		if (rtn) {
			throw new Error('Memory already exists ' + title);
		} else {
			rtn = master[title] = new Memory(title);
		}

		return rtn;
	}
};

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var core = __webpack_require__(5);
var flowWindow = __webpack_require__(23);
var Eventing = __webpack_require__(38);

var _require = __webpack_require__(24),
    equals = _require.equals;

var Observable = function (_Eventing) {
	_inherits(Observable, _Eventing);

	function Observable() {
		var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Observable);

		var _this = _possibleConstructorReturn(this, (Observable.__proto__ || Object.getPrototypeOf(Observable)).call(this));

		_this.settings = settings;

		_this._next = flowWindow(function () {
			var args = _this.currentArgs;

			_this.trigger.apply(_this, ['next'].concat(_toConsumableArray(args)));
		}, settings.windowMin || 0, settings.windowMax || 30);
		return _this;
	}

	_createClass(Observable, [{
		key: 'next',
		value: function next() {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			if (!args.length) {
				throw new Error('Observable::next, must be called with arguments');
			}

			this.currentArgs = args;

			this._next();
		}
	}, {
		key: 'subscribe',
		value: function subscribe(onNext, onError, onComplete) {
			var _this2 = this;

			var config = null;

			if (core.isFunction(onNext) || core.isArray(onNext)) {
				config = {
					next: onNext,
					error: onError ? onError : function () {
						// anything for default?
					},
					complete: onComplete ? onComplete : function () {
						_this2.destroy();
					}
				};
			} else {
				config = onNext;
			}

			var disconnect = _get(Observable.prototype.__proto__ || Object.getPrototypeOf(Observable.prototype), 'subscribe', this).call(this, config);

			if (this.currentArgs && config.next) {
				var fn = null;

				// make it act like a hot observable
				var _args = this.currentArgs;
				var cb = config.next;

				if (core.isArray(cb)) {
					if (cb.length) {
						if (this._next.active()) {
							fn = cb[0];

							var myArgs = _args;
							cb[0] = function () {
								for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
									params[_key2] = arguments[_key2];
								}

								if (equals(params, myArgs)) {
									// stub it for when next fires
									// there's a possible race condition with this, that a second value comes in as
									// the window is active... the second value will get eaten, so the else
									// blow tries to help there
								} else {
									var f = cb.shift();
									f.apply(undefined, params);
								}
							};
						} else {
							fn = cb.shift();
						}
					}
				} else {
					fn = cb;
				}

				fn.apply(undefined, _toConsumableArray(_args));
			}

			return disconnect;
		}

		// return back a promise that is active on the 'next'

	}, {
		key: 'promise',
		value: function promise() {
			var _this3 = this;

			if (!this.currentArgs || this._next.active()) {
				if (!this._promise) {
					this._promise = new Promise(function (resolve, reject) {
						var next = null;
						var error = null;

						next = _this3.once('next', function (val) {
							_this3._promise = null;

							error();
							resolve(val);
						});

						error = _this3.once('error', function (ex) {
							_this3._promise = null;

							next();
							reject(ex);
						});
					});
				}

				return this._promise;
			} else {
				var _args2 = this.currentArgs;

				return Promise.resolve.apply(Promise, _toConsumableArray(_args2));
			}
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			this.currentArgs = null;

			this.trigger('complete');
		}
	}]);

	return Observable;
}(Eventing);

module.exports = Observable;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.toSubscriber = toSubscriber;

var _Subscriber = __webpack_require__(4);

var _rxSubscriber = __webpack_require__(28);

var _Observer = __webpack_require__(41);

function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
        if (nextOrObserver instanceof _Subscriber.Subscriber) {
            return nextOrObserver;
        }
        if (nextOrObserver[_rxSubscriber.rxSubscriber]) {
            return nextOrObserver[_rxSubscriber.rxSubscriber]();
        }
    }
    if (!nextOrObserver && !error && !complete) {
        return new _Subscriber.Subscriber(_Observer.empty);
    }
    return new _Subscriber.Subscriber(nextOrObserver, error, complete);
}
//# sourceMappingURL=toSubscriber.js.map
/** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.connectableObservableDescriptor = exports.ConnectableObservable = undefined;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _Subject = __webpack_require__(9);

var _Observable = __webpack_require__(0);

var _Subscriber = __webpack_require__(4);

var _Subscription = __webpack_require__(3);

var _refCount = __webpack_require__(80);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/** PURE_IMPORTS_START tslib,_Subject,_Observable,_Subscriber,_Subscription,_operators_refCount PURE_IMPORTS_END */
var ConnectableObservable = /*@__PURE__*/function (_super) {
    tslib_1.__extends(ConnectableObservable, _super);
    function ConnectableObservable(source, subjectFactory) {
        var _this = _super.call(this) || this;
        _this.source = source;
        _this.subjectFactory = subjectFactory;
        _this._refCount = 0;
        _this._isComplete = false;
        return _this;
    }
    ConnectableObservable.prototype._subscribe = function (subscriber) {
        return this.getSubject().subscribe(subscriber);
    };
    ConnectableObservable.prototype.getSubject = function () {
        var subject = this._subject;
        if (!subject || subject.isStopped) {
            this._subject = this.subjectFactory();
        }
        return this._subject;
    };
    ConnectableObservable.prototype.connect = function () {
        var connection = this._connection;
        if (!connection) {
            this._isComplete = false;
            connection = this._connection = new _Subscription.Subscription();
            connection.add(this.source.subscribe(new ConnectableSubscriber(this.getSubject(), this)));
            if (connection.closed) {
                this._connection = null;
                connection = _Subscription.Subscription.EMPTY;
            }
        }
        return connection;
    };
    ConnectableObservable.prototype.refCount = function () {
        return (0, _refCount.refCount)()(this);
    };
    return ConnectableObservable;
}(_Observable.Observable);
exports.ConnectableObservable = ConnectableObservable;

var connectableProto = ConnectableObservable.prototype;
var connectableObservableDescriptor = exports.connectableObservableDescriptor = {
    operator: { value: null },
    _refCount: { value: 0, writable: true },
    _subject: { value: null, writable: true },
    _connection: { value: null, writable: true },
    _subscribe: { value: connectableProto._subscribe },
    _isComplete: { value: connectableProto._isComplete, writable: true },
    getSubject: { value: connectableProto.getSubject },
    connect: { value: connectableProto.connect },
    refCount: { value: connectableProto.refCount }
};
var ConnectableSubscriber = /*@__PURE__*/function (_super) {
    tslib_1.__extends(ConnectableSubscriber, _super);
    function ConnectableSubscriber(destination, connectable) {
        var _this = _super.call(this, destination) || this;
        _this.connectable = connectable;
        return _this;
    }
    ConnectableSubscriber.prototype._error = function (err) {
        this._unsubscribe();
        _super.prototype._error.call(this, err);
    };
    ConnectableSubscriber.prototype._complete = function () {
        this.connectable._isComplete = true;
        this._unsubscribe();
        _super.prototype._complete.call(this);
    };
    ConnectableSubscriber.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        if (connectable) {
            this.connectable = null;
            var connection = connectable._connection;
            connectable._refCount = 0;
            connectable._subject = null;
            connectable._connection = null;
            if (connection) {
                connection.unsubscribe();
            }
        }
    };
    return ConnectableSubscriber;
}(_Subject.SubjectSubscriber);
var RefCountOperator = /*@__PURE__*/function () {
    function RefCountOperator(connectable) {
        this.connectable = connectable;
    }
    RefCountOperator.prototype.call = function (subscriber, source) {
        var connectable = this.connectable;
        connectable._refCount++;
        var refCounter = new RefCountSubscriber(subscriber, connectable);
        var subscription = source.subscribe(refCounter);
        if (!refCounter.closed) {
            refCounter.connection = connectable.connect();
        }
        return subscription;
    };
    return RefCountOperator;
}();
var RefCountSubscriber = /*@__PURE__*/function (_super) {
    tslib_1.__extends(RefCountSubscriber, _super);
    function RefCountSubscriber(destination, connectable) {
        var _this = _super.call(this, destination) || this;
        _this.connectable = connectable;
        return _this;
    }
    RefCountSubscriber.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        if (!connectable) {
            this.connection = null;
            return;
        }
        this.connectable = null;
        var refCount = connectable._refCount;
        if (refCount <= 0) {
            this.connection = null;
            return;
        }
        connectable._refCount = refCount - 1;
        if (refCount > 1) {
            this.connection = null;
            return;
        }
        var connection = this.connection;
        var sharedConnection = connectable._connection;
        this.connection = null;
        if (sharedConnection && (!connection || sharedConnection === connection)) {
            sharedConnection.unsubscribe();
        }
    };
    return RefCountSubscriber;
}(_Subscriber.Subscriber);
//# sourceMappingURL=ConnectableObservable.js.map

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.refCount = refCount;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _Subscriber = __webpack_require__(4);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
function refCount() {
    return function refCountOperatorFunction(source) {
        return source.lift(new RefCountOperator(source));
    };
}
var RefCountOperator = /*@__PURE__*/function () {
    function RefCountOperator(connectable) {
        this.connectable = connectable;
    }
    RefCountOperator.prototype.call = function (subscriber, source) {
        var connectable = this.connectable;
        connectable._refCount++;
        var refCounter = new RefCountSubscriber(subscriber, connectable);
        var subscription = source.subscribe(refCounter);
        if (!refCounter.closed) {
            refCounter.connection = connectable.connect();
        }
        return subscription;
    };
    return RefCountOperator;
}();
var RefCountSubscriber = /*@__PURE__*/function (_super) {
    tslib_1.__extends(RefCountSubscriber, _super);
    function RefCountSubscriber(destination, connectable) {
        var _this = _super.call(this, destination) || this;
        _this.connectable = connectable;
        return _this;
    }
    RefCountSubscriber.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        if (!connectable) {
            this.connection = null;
            return;
        }
        this.connectable = null;
        var refCount = connectable._refCount;
        if (refCount <= 0) {
            this.connection = null;
            return;
        }
        connectable._refCount = refCount - 1;
        if (refCount > 1) {
            this.connection = null;
            return;
        }
        var connection = this.connection;
        var sharedConnection = connectable._connection;
        this.connection = null;
        if (sharedConnection && (!connection || sharedConnection === connection)) {
            sharedConnection.unsubscribe();
        }
    };
    return RefCountSubscriber;
}(_Subscriber.Subscriber);
//# sourceMappingURL=refCount.js.map

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GroupedObservable = undefined;
exports.groupBy = groupBy;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _Subscriber = __webpack_require__(4);

var _Subscription = __webpack_require__(3);

var _Observable = __webpack_require__(0);

var _Subject = __webpack_require__(9);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function groupBy(keySelector, elementSelector, durationSelector, subjectSelector) {
    return function (source) {
        return source.lift(new GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector));
    };
} /** PURE_IMPORTS_START tslib,_Subscriber,_Subscription,_Observable,_Subject PURE_IMPORTS_END */

var GroupByOperator = /*@__PURE__*/function () {
    function GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector) {
        this.keySelector = keySelector;
        this.elementSelector = elementSelector;
        this.durationSelector = durationSelector;
        this.subjectSelector = subjectSelector;
    }
    GroupByOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new GroupBySubscriber(subscriber, this.keySelector, this.elementSelector, this.durationSelector, this.subjectSelector));
    };
    return GroupByOperator;
}();
var GroupBySubscriber = /*@__PURE__*/function (_super) {
    tslib_1.__extends(GroupBySubscriber, _super);
    function GroupBySubscriber(destination, keySelector, elementSelector, durationSelector, subjectSelector) {
        var _this = _super.call(this, destination) || this;
        _this.keySelector = keySelector;
        _this.elementSelector = elementSelector;
        _this.durationSelector = durationSelector;
        _this.subjectSelector = subjectSelector;
        _this.groups = null;
        _this.attemptedToUnsubscribe = false;
        _this.count = 0;
        return _this;
    }
    GroupBySubscriber.prototype._next = function (value) {
        var key;
        try {
            key = this.keySelector(value);
        } catch (err) {
            this.error(err);
            return;
        }
        this._group(value, key);
    };
    GroupBySubscriber.prototype._group = function (value, key) {
        var groups = this.groups;
        if (!groups) {
            groups = this.groups = new Map();
        }
        var group = groups.get(key);
        var element;
        if (this.elementSelector) {
            try {
                element = this.elementSelector(value);
            } catch (err) {
                this.error(err);
            }
        } else {
            element = value;
        }
        if (!group) {
            group = this.subjectSelector ? this.subjectSelector() : new _Subject.Subject();
            groups.set(key, group);
            var groupedObservable = new GroupedObservable(key, group, this);
            this.destination.next(groupedObservable);
            if (this.durationSelector) {
                var duration = void 0;
                try {
                    duration = this.durationSelector(new GroupedObservable(key, group));
                } catch (err) {
                    this.error(err);
                    return;
                }
                this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
            }
        }
        if (!group.closed) {
            group.next(element);
        }
    };
    GroupBySubscriber.prototype._error = function (err) {
        var groups = this.groups;
        if (groups) {
            groups.forEach(function (group, key) {
                group.error(err);
            });
            groups.clear();
        }
        this.destination.error(err);
    };
    GroupBySubscriber.prototype._complete = function () {
        var groups = this.groups;
        if (groups) {
            groups.forEach(function (group, key) {
                group.complete();
            });
            groups.clear();
        }
        this.destination.complete();
    };
    GroupBySubscriber.prototype.removeGroup = function (key) {
        this.groups.delete(key);
    };
    GroupBySubscriber.prototype.unsubscribe = function () {
        if (!this.closed) {
            this.attemptedToUnsubscribe = true;
            if (this.count === 0) {
                _super.prototype.unsubscribe.call(this);
            }
        }
    };
    return GroupBySubscriber;
}(_Subscriber.Subscriber);
var GroupDurationSubscriber = /*@__PURE__*/function (_super) {
    tslib_1.__extends(GroupDurationSubscriber, _super);
    function GroupDurationSubscriber(key, group, parent) {
        var _this = _super.call(this, group) || this;
        _this.key = key;
        _this.group = group;
        _this.parent = parent;
        return _this;
    }
    GroupDurationSubscriber.prototype._next = function (value) {
        this.complete();
    };
    GroupDurationSubscriber.prototype._unsubscribe = function () {
        var _a = this,
            parent = _a.parent,
            key = _a.key;
        this.key = this.parent = null;
        if (parent) {
            parent.removeGroup(key);
        }
    };
    return GroupDurationSubscriber;
}(_Subscriber.Subscriber);
var GroupedObservable = /*@__PURE__*/function (_super) {
    tslib_1.__extends(GroupedObservable, _super);
    function GroupedObservable(key, groupSubject, refCountSubscription) {
        var _this = _super.call(this) || this;
        _this.key = key;
        _this.groupSubject = groupSubject;
        _this.refCountSubscription = refCountSubscription;
        return _this;
    }
    GroupedObservable.prototype._subscribe = function (subscriber) {
        var subscription = new _Subscription.Subscription();
        var _a = this,
            refCountSubscription = _a.refCountSubscription,
            groupSubject = _a.groupSubject;
        if (refCountSubscription && !refCountSubscription.closed) {
            subscription.add(new InnerRefCountSubscription(refCountSubscription));
        }
        subscription.add(groupSubject.subscribe(subscriber));
        return subscription;
    };
    return GroupedObservable;
}(_Observable.Observable);
exports.GroupedObservable = GroupedObservable;

var InnerRefCountSubscription = /*@__PURE__*/function (_super) {
    tslib_1.__extends(InnerRefCountSubscription, _super);
    function InnerRefCountSubscription(parent) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        parent.count++;
        return _this;
    }
    InnerRefCountSubscription.prototype.unsubscribe = function () {
        var parent = this.parent;
        if (!parent.closed && !this.closed) {
            _super.prototype.unsubscribe.call(this);
            parent.count -= 1;
            if (parent.count === 0 && parent.attemptedToUnsubscribe) {
                parent.unsubscribe();
            }
        }
    };
    return InnerRefCountSubscription;
}(_Subscription.Subscription);
//# sourceMappingURL=groupBy.js.map

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BehaviorSubject = undefined;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _Subject = __webpack_require__(9);

var _ObjectUnsubscribedError = __webpack_require__(19);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var BehaviorSubject = /*@__PURE__*/function (_super) {
    tslib_1.__extends(BehaviorSubject, _super);
    function BehaviorSubject(_value) {
        var _this = _super.call(this) || this;
        _this._value = _value;
        return _this;
    }
    Object.defineProperty(BehaviorSubject.prototype, "value", {
        get: function get() {
            return this.getValue();
        },
        enumerable: true,
        configurable: true
    });
    BehaviorSubject.prototype._subscribe = function (subscriber) {
        var subscription = _super.prototype._subscribe.call(this, subscriber);
        if (subscription && !subscription.closed) {
            subscriber.next(this._value);
        }
        return subscription;
    };
    BehaviorSubject.prototype.getValue = function () {
        if (this.hasError) {
            throw this.thrownError;
        } else if (this.closed) {
            throw new _ObjectUnsubscribedError.ObjectUnsubscribedError();
        } else {
            return this._value;
        }
    };
    BehaviorSubject.prototype.next = function (value) {
        _super.prototype.next.call(this, this._value = value);
    };
    return BehaviorSubject;
}(_Subject.Subject); /** PURE_IMPORTS_START tslib,_Subject,_util_ObjectUnsubscribedError PURE_IMPORTS_END */
exports.BehaviorSubject = BehaviorSubject;
//# sourceMappingURL=BehaviorSubject.js.map

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ReplaySubject = undefined;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _Subject = __webpack_require__(9);

var _queue = __webpack_require__(45);

var _Subscription = __webpack_require__(3);

var _observeOn = __webpack_require__(87);

var _ObjectUnsubscribedError = __webpack_require__(19);

var _SubjectSubscription = __webpack_require__(44);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var ReplaySubject = /*@__PURE__*/function (_super) {
    tslib_1.__extends(ReplaySubject, _super);
    function ReplaySubject(bufferSize, windowTime, scheduler) {
        if (bufferSize === void 0) {
            bufferSize = Number.POSITIVE_INFINITY;
        }
        if (windowTime === void 0) {
            windowTime = Number.POSITIVE_INFINITY;
        }
        var _this = _super.call(this) || this;
        _this.scheduler = scheduler;
        _this._events = [];
        _this._infiniteTimeWindow = false;
        _this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
        _this._windowTime = windowTime < 1 ? 1 : windowTime;
        if (windowTime === Number.POSITIVE_INFINITY) {
            _this._infiniteTimeWindow = true;
            _this.next = _this.nextInfiniteTimeWindow;
        } else {
            _this.next = _this.nextTimeWindow;
        }
        return _this;
    }
    ReplaySubject.prototype.nextInfiniteTimeWindow = function (value) {
        var _events = this._events;
        _events.push(value);
        if (_events.length > this._bufferSize) {
            _events.shift();
        }
        _super.prototype.next.call(this, value);
    };
    ReplaySubject.prototype.nextTimeWindow = function (value) {
        this._events.push(new ReplayEvent(this._getNow(), value));
        this._trimBufferThenGetEvents();
        _super.prototype.next.call(this, value);
    };
    ReplaySubject.prototype._subscribe = function (subscriber) {
        var _infiniteTimeWindow = this._infiniteTimeWindow;
        var _events = _infiniteTimeWindow ? this._events : this._trimBufferThenGetEvents();
        var scheduler = this.scheduler;
        var len = _events.length;
        var subscription;
        if (this.closed) {
            throw new _ObjectUnsubscribedError.ObjectUnsubscribedError();
        } else if (this.isStopped || this.hasError) {
            subscription = _Subscription.Subscription.EMPTY;
        } else {
            this.observers.push(subscriber);
            subscription = new _SubjectSubscription.SubjectSubscription(this, subscriber);
        }
        if (scheduler) {
            subscriber.add(subscriber = new _observeOn.ObserveOnSubscriber(subscriber, scheduler));
        }
        if (_infiniteTimeWindow) {
            for (var i = 0; i < len && !subscriber.closed; i++) {
                subscriber.next(_events[i]);
            }
        } else {
            for (var i = 0; i < len && !subscriber.closed; i++) {
                subscriber.next(_events[i].value);
            }
        }
        if (this.hasError) {
            subscriber.error(this.thrownError);
        } else if (this.isStopped) {
            subscriber.complete();
        }
        return subscription;
    };
    ReplaySubject.prototype._getNow = function () {
        return (this.scheduler || _queue.queue).now();
    };
    ReplaySubject.prototype._trimBufferThenGetEvents = function () {
        var now = this._getNow();
        var _bufferSize = this._bufferSize;
        var _windowTime = this._windowTime;
        var _events = this._events;
        var eventsCount = _events.length;
        var spliceCount = 0;
        while (spliceCount < eventsCount) {
            if (now - _events[spliceCount].time < _windowTime) {
                break;
            }
            spliceCount++;
        }
        if (eventsCount > _bufferSize) {
            spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
        }
        if (spliceCount > 0) {
            _events.splice(0, spliceCount);
        }
        return _events;
    };
    return ReplaySubject;
}(_Subject.Subject); /** PURE_IMPORTS_START tslib,_Subject,_scheduler_queue,_Subscription,_operators_observeOn,_util_ObjectUnsubscribedError,_SubjectSubscription PURE_IMPORTS_END */
exports.ReplaySubject = ReplaySubject;

var ReplayEvent = /*@__PURE__*/function () {
    function ReplayEvent(time, value) {
        this.time = time;
        this.value = value;
    }
    return ReplayEvent;
}();
//# sourceMappingURL=ReplaySubject.js.map

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.QueueAction = undefined;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _AsyncAction = __webpack_require__(13);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */
var QueueAction = /*@__PURE__*/function (_super) {
    tslib_1.__extends(QueueAction, _super);
    function QueueAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        return _this;
    }
    QueueAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (delay > 0) {
            return _super.prototype.schedule.call(this, state, delay);
        }
        this.delay = delay;
        this.state = state;
        this.scheduler.flush(this);
        return this;
    };
    QueueAction.prototype.execute = function (state, delay) {
        return delay > 0 || this.closed ? _super.prototype.execute.call(this, state, delay) : this._execute(state, delay);
    };
    QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (delay !== null && delay > 0 || delay === null && this.delay > 0) {
            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
        }
        return scheduler.flush(this);
    };
    return QueueAction;
}(_AsyncAction.AsyncAction);
exports.QueueAction = QueueAction;
//# sourceMappingURL=QueueAction.js.map

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Action = undefined;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _Subscription = __webpack_require__(3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
var Action = /*@__PURE__*/function (_super) {
    tslib_1.__extends(Action, _super);
    function Action(scheduler, work) {
        return _super.call(this) || this;
    }
    Action.prototype.schedule = function (state, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        return this;
    };
    return Action;
}(_Subscription.Subscription);
exports.Action = Action;
//# sourceMappingURL=Action.js.map

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.QueueScheduler = undefined;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _AsyncScheduler = __webpack_require__(14);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
var QueueScheduler = /*@__PURE__*/function (_super) {
    tslib_1.__extends(QueueScheduler, _super);
    function QueueScheduler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueueScheduler;
}(_AsyncScheduler.AsyncScheduler);
exports.QueueScheduler = QueueScheduler;
//# sourceMappingURL=QueueScheduler.js.map

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ObserveOnMessage = exports.ObserveOnSubscriber = exports.ObserveOnOperator = undefined;
exports.observeOn = observeOn;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _Subscriber = __webpack_require__(4);

var _Notification = __webpack_require__(47);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function observeOn(scheduler, delay) {
    if (delay === void 0) {
        delay = 0;
    }
    return function observeOnOperatorFunction(source) {
        return source.lift(new ObserveOnOperator(scheduler, delay));
    };
} /** PURE_IMPORTS_START tslib,_Subscriber,_Notification PURE_IMPORTS_END */

var ObserveOnOperator = /*@__PURE__*/function () {
    function ObserveOnOperator(scheduler, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        this.scheduler = scheduler;
        this.delay = delay;
    }
    ObserveOnOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ObserveOnSubscriber(subscriber, this.scheduler, this.delay));
    };
    return ObserveOnOperator;
}();
exports.ObserveOnOperator = ObserveOnOperator;

var ObserveOnSubscriber = /*@__PURE__*/function (_super) {
    tslib_1.__extends(ObserveOnSubscriber, _super);
    function ObserveOnSubscriber(destination, scheduler, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        var _this = _super.call(this, destination) || this;
        _this.scheduler = scheduler;
        _this.delay = delay;
        return _this;
    }
    ObserveOnSubscriber.dispatch = function (arg) {
        var notification = arg.notification,
            destination = arg.destination;
        notification.observe(destination);
        this.unsubscribe();
    };
    ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
        var destination = this.destination;
        destination.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
    };
    ObserveOnSubscriber.prototype._next = function (value) {
        this.scheduleMessage(_Notification.Notification.createNext(value));
    };
    ObserveOnSubscriber.prototype._error = function (err) {
        this.scheduleMessage(_Notification.Notification.createError(err));
        this.unsubscribe();
    };
    ObserveOnSubscriber.prototype._complete = function () {
        this.scheduleMessage(_Notification.Notification.createComplete());
        this.unsubscribe();
    };
    return ObserveOnSubscriber;
}(_Subscriber.Subscriber);
exports.ObserveOnSubscriber = ObserveOnSubscriber;

var ObserveOnMessage = /*@__PURE__*/function () {
    function ObserveOnMessage(notification, destination) {
        this.notification = notification;
        this.destination = destination;
    }
    return ObserveOnMessage;
}();
exports.ObserveOnMessage = ObserveOnMessage;
//# sourceMappingURL=observeOn.js.map

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asap = undefined;

var _AsapAction = __webpack_require__(89);

var _AsapScheduler = __webpack_require__(91);

/** PURE_IMPORTS_START _AsapAction,_AsapScheduler PURE_IMPORTS_END */
var asap = /*@__PURE__*/exports.asap = new _AsapScheduler.AsapScheduler(_AsapAction.AsapAction);
//# sourceMappingURL=asap.js.map

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AsapAction = undefined;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _Immediate = __webpack_require__(90);

var _AsyncAction = __webpack_require__(13);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var AsapAction = /*@__PURE__*/function (_super) {
    tslib_1.__extends(AsapAction, _super);
    function AsapAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        return _this;
    }
    AsapAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (delay !== null && delay > 0) {
            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
        }
        scheduler.actions.push(this);
        return scheduler.scheduled || (scheduler.scheduled = _Immediate.Immediate.setImmediate(scheduler.flush.bind(scheduler, null)));
    };
    AsapAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (delay !== null && delay > 0 || delay === null && this.delay > 0) {
            return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
        }
        if (scheduler.actions.length === 0) {
            _Immediate.Immediate.clearImmediate(id);
            scheduler.scheduled = undefined;
        }
        return undefined;
    };
    return AsapAction;
}(_AsyncAction.AsyncAction); /** PURE_IMPORTS_START tslib,_util_Immediate,_AsyncAction PURE_IMPORTS_END */
exports.AsapAction = AsapAction;
//# sourceMappingURL=AsapAction.js.map

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var nextHandle = 1;
var tasksByHandle = {};
function runIfPresent(handle) {
    var cb = tasksByHandle[handle];
    if (cb) {
        cb();
    }
}
var Immediate = exports.Immediate = {
    setImmediate: function setImmediate(cb) {
        var handle = nextHandle++;
        tasksByHandle[handle] = cb;
        Promise.resolve().then(function () {
            return runIfPresent(handle);
        });
        return handle;
    },
    clearImmediate: function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }
};
//# sourceMappingURL=Immediate.js.map

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AsapScheduler = undefined;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _AsyncScheduler = __webpack_require__(14);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
var AsapScheduler = /*@__PURE__*/function (_super) {
    tslib_1.__extends(AsapScheduler, _super);
    function AsapScheduler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AsapScheduler.prototype.flush = function (action) {
        this.active = true;
        this.scheduled = undefined;
        var actions = this.actions;
        var error;
        var index = -1;
        var count = actions.length;
        action = action || actions.shift();
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (++index < count && (action = actions.shift()));
        this.active = false;
        if (error) {
            while (++index < count && (action = actions.shift())) {
                action.unsubscribe();
            }
            throw error;
        }
    };
    return AsapScheduler;
}(_AsyncScheduler.AsyncScheduler);
exports.AsapScheduler = AsapScheduler;
//# sourceMappingURL=AsapScheduler.js.map

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.animationFrame = undefined;

var _AnimationFrameAction = __webpack_require__(93);

var _AnimationFrameScheduler = __webpack_require__(94);

/** PURE_IMPORTS_START _AnimationFrameAction,_AnimationFrameScheduler PURE_IMPORTS_END */
var animationFrame = /*@__PURE__*/exports.animationFrame = new _AnimationFrameScheduler.AnimationFrameScheduler(_AnimationFrameAction.AnimationFrameAction);
//# sourceMappingURL=animationFrame.js.map

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnimationFrameAction = undefined;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _AsyncAction = __webpack_require__(13);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */
var AnimationFrameAction = /*@__PURE__*/function (_super) {
    tslib_1.__extends(AnimationFrameAction, _super);
    function AnimationFrameAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        return _this;
    }
    AnimationFrameAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (delay !== null && delay > 0) {
            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
        }
        scheduler.actions.push(this);
        return scheduler.scheduled || (scheduler.scheduled = requestAnimationFrame(function () {
            return scheduler.flush(null);
        }));
    };
    AnimationFrameAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (delay !== null && delay > 0 || delay === null && this.delay > 0) {
            return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
        }
        if (scheduler.actions.length === 0) {
            cancelAnimationFrame(id);
            scheduler.scheduled = undefined;
        }
        return undefined;
    };
    return AnimationFrameAction;
}(_AsyncAction.AsyncAction);
exports.AnimationFrameAction = AnimationFrameAction;
//# sourceMappingURL=AnimationFrameAction.js.map

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnimationFrameScheduler = undefined;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _AsyncScheduler = __webpack_require__(14);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
var AnimationFrameScheduler = /*@__PURE__*/function (_super) {
    tslib_1.__extends(AnimationFrameScheduler, _super);
    function AnimationFrameScheduler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimationFrameScheduler.prototype.flush = function (action) {
        this.active = true;
        this.scheduled = undefined;
        var actions = this.actions;
        var error;
        var index = -1;
        var count = actions.length;
        action = action || actions.shift();
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (++index < count && (action = actions.shift()));
        this.active = false;
        if (error) {
            while (++index < count && (action = actions.shift())) {
                action.unsubscribe();
            }
            throw error;
        }
    };
    return AnimationFrameScheduler;
}(_AsyncScheduler.AsyncScheduler);
exports.AnimationFrameScheduler = AnimationFrameScheduler;
//# sourceMappingURL=AnimationFrameScheduler.js.map

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.VirtualAction = exports.VirtualTimeScheduler = undefined;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _AsyncAction = __webpack_require__(13);

var _AsyncScheduler = __webpack_require__(14);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var VirtualTimeScheduler = /*@__PURE__*/function (_super) {
    tslib_1.__extends(VirtualTimeScheduler, _super);
    function VirtualTimeScheduler(SchedulerAction, maxFrames) {
        if (SchedulerAction === void 0) {
            SchedulerAction = VirtualAction;
        }
        if (maxFrames === void 0) {
            maxFrames = Number.POSITIVE_INFINITY;
        }
        var _this = _super.call(this, SchedulerAction, function () {
            return _this.frame;
        }) || this;
        _this.maxFrames = maxFrames;
        _this.frame = 0;
        _this.index = -1;
        return _this;
    }
    VirtualTimeScheduler.prototype.flush = function () {
        var _a = this,
            actions = _a.actions,
            maxFrames = _a.maxFrames;
        var error, action;
        while ((action = actions[0]) && action.delay <= maxFrames) {
            actions.shift();
            this.frame = action.delay;
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        }
        if (error) {
            while (action = actions.shift()) {
                action.unsubscribe();
            }
            throw error;
        }
    };
    VirtualTimeScheduler.frameTimeFactor = 10;
    return VirtualTimeScheduler;
}(_AsyncScheduler.AsyncScheduler); /** PURE_IMPORTS_START tslib,_AsyncAction,_AsyncScheduler PURE_IMPORTS_END */
exports.VirtualTimeScheduler = VirtualTimeScheduler;

var VirtualAction = /*@__PURE__*/function (_super) {
    tslib_1.__extends(VirtualAction, _super);
    function VirtualAction(scheduler, work, index) {
        if (index === void 0) {
            index = scheduler.index += 1;
        }
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        _this.index = index;
        _this.active = true;
        _this.index = scheduler.index = index;
        return _this;
    }
    VirtualAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (!this.id) {
            return _super.prototype.schedule.call(this, state, delay);
        }
        this.active = false;
        var action = new VirtualAction(this.scheduler, this.work);
        this.add(action);
        return action.schedule(state, delay);
    };
    VirtualAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        this.delay = scheduler.frame + delay;
        var actions = scheduler.actions;
        actions.push(this);
        actions.sort(VirtualAction.sortActions);
        return true;
    };
    VirtualAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        return undefined;
    };
    VirtualAction.prototype._execute = function (state, delay) {
        if (this.active === true) {
            return _super.prototype._execute.call(this, state, delay);
        }
    };
    VirtualAction.sortActions = function (a, b) {
        if (a.delay === b.delay) {
            if (a.index === b.index) {
                return 0;
            } else if (a.index > b.index) {
                return 1;
            } else {
                return -1;
            }
        } else if (a.delay > b.delay) {
            return 1;
        } else {
            return -1;
        }
    };
    return VirtualAction;
}(_AsyncAction.AsyncAction);
exports.VirtualAction = VirtualAction;
//# sourceMappingURL=VirtualTimeScheduler.js.map

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isObservable = isObservable;

var _Observable = __webpack_require__(0);

function isObservable(obj) {
    return !!obj && (obj instanceof _Observable.Observable || typeof obj.lift === 'function' && typeof obj.subscribe === 'function');
}
//# sourceMappingURL=isObservable.js.map
/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function ArgumentOutOfRangeErrorImpl() {
    Error.call(this);
    this.message = 'argument out of range';
    this.name = 'ArgumentOutOfRangeError';
    return this;
}
ArgumentOutOfRangeErrorImpl.prototype = /*@__PURE__*/Object.create(Error.prototype);
var ArgumentOutOfRangeError = exports.ArgumentOutOfRangeError = ArgumentOutOfRangeErrorImpl;
//# sourceMappingURL=ArgumentOutOfRangeError.js.map

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function EmptyErrorImpl() {
    Error.call(this);
    this.message = 'no elements in sequence';
    this.name = 'EmptyError';
    return this;
}
EmptyErrorImpl.prototype = /*@__PURE__*/Object.create(Error.prototype);
var EmptyError = exports.EmptyError = EmptyErrorImpl;
//# sourceMappingURL=EmptyError.js.map

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function TimeoutErrorImpl() {
    Error.call(this);
    this.message = 'Timeout has occurred';
    this.name = 'TimeoutError';
    return this;
}
TimeoutErrorImpl.prototype = /*@__PURE__*/Object.create(Error.prototype);
var TimeoutError = exports.TimeoutError = TimeoutErrorImpl;
//# sourceMappingURL=TimeoutError.js.map

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.bindCallback = bindCallback;

var _Observable = __webpack_require__(0);

var _AsyncSubject = __webpack_require__(32);

var _map = __webpack_require__(11);

var _canReportError = __webpack_require__(25);

var _isArray = __webpack_require__(6);

var _isScheduler = __webpack_require__(7);

/** PURE_IMPORTS_START _Observable,_AsyncSubject,_operators_map,_util_canReportError,_util_isArray,_util_isScheduler PURE_IMPORTS_END */
function bindCallback(callbackFunc, resultSelector, scheduler) {
    if (resultSelector) {
        if ((0, _isScheduler.isScheduler)(resultSelector)) {
            scheduler = resultSelector;
        } else {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return bindCallback(callbackFunc, scheduler).apply(void 0, args).pipe((0, _map.map)(function (args) {
                    return (0, _isArray.isArray)(args) ? resultSelector.apply(void 0, args) : resultSelector(args);
                }));
            };
        }
    }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var context = this;
        var subject;
        var params = {
            context: context,
            subject: subject,
            callbackFunc: callbackFunc,
            scheduler: scheduler
        };
        return new _Observable.Observable(function (subscriber) {
            if (!scheduler) {
                if (!subject) {
                    subject = new _AsyncSubject.AsyncSubject();
                    var handler = function handler() {
                        var innerArgs = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            innerArgs[_i] = arguments[_i];
                        }
                        subject.next(innerArgs.length <= 1 ? innerArgs[0] : innerArgs);
                        subject.complete();
                    };
                    try {
                        callbackFunc.apply(context, args.concat([handler]));
                    } catch (err) {
                        if ((0, _canReportError.canReportError)(subject)) {
                            subject.error(err);
                        } else {
                            console.warn(err);
                        }
                    }
                }
                return subject.subscribe(subscriber);
            } else {
                var state = {
                    args: args, subscriber: subscriber, params: params
                };
                return scheduler.schedule(dispatch, 0, state);
            }
        });
    };
}
function dispatch(state) {
    var _this = this;
    var self = this;
    var args = state.args,
        subscriber = state.subscriber,
        params = state.params;
    var callbackFunc = params.callbackFunc,
        context = params.context,
        scheduler = params.scheduler;
    var subject = params.subject;
    if (!subject) {
        subject = params.subject = new _AsyncSubject.AsyncSubject();
        var handler = function handler() {
            var innerArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                innerArgs[_i] = arguments[_i];
            }
            var value = innerArgs.length <= 1 ? innerArgs[0] : innerArgs;
            _this.add(scheduler.schedule(dispatchNext, 0, { value: value, subject: subject }));
        };
        try {
            callbackFunc.apply(context, args.concat([handler]));
        } catch (err) {
            subject.error(err);
        }
    }
    this.add(subject.subscribe(subscriber));
}
function dispatchNext(state) {
    var value = state.value,
        subject = state.subject;
    subject.next(value);
    subject.complete();
}
function dispatchError(state) {
    var err = state.err,
        subject = state.subject;
    subject.error(err);
}
//# sourceMappingURL=bindCallback.js.map

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.bindNodeCallback = bindNodeCallback;

var _Observable = __webpack_require__(0);

var _AsyncSubject = __webpack_require__(32);

var _map = __webpack_require__(11);

var _canReportError = __webpack_require__(25);

var _isScheduler = __webpack_require__(7);

var _isArray = __webpack_require__(6);

/** PURE_IMPORTS_START _Observable,_AsyncSubject,_operators_map,_util_canReportError,_util_isScheduler,_util_isArray PURE_IMPORTS_END */
function bindNodeCallback(callbackFunc, resultSelector, scheduler) {
    if (resultSelector) {
        if ((0, _isScheduler.isScheduler)(resultSelector)) {
            scheduler = resultSelector;
        } else {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return bindNodeCallback(callbackFunc, scheduler).apply(void 0, args).pipe((0, _map.map)(function (args) {
                    return (0, _isArray.isArray)(args) ? resultSelector.apply(void 0, args) : resultSelector(args);
                }));
            };
        }
    }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var params = {
            subject: undefined,
            args: args,
            callbackFunc: callbackFunc,
            scheduler: scheduler,
            context: this
        };
        return new _Observable.Observable(function (subscriber) {
            var context = params.context;
            var subject = params.subject;
            if (!scheduler) {
                if (!subject) {
                    subject = params.subject = new _AsyncSubject.AsyncSubject();
                    var handler = function handler() {
                        var innerArgs = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            innerArgs[_i] = arguments[_i];
                        }
                        var err = innerArgs.shift();
                        if (err) {
                            subject.error(err);
                            return;
                        }
                        subject.next(innerArgs.length <= 1 ? innerArgs[0] : innerArgs);
                        subject.complete();
                    };
                    try {
                        callbackFunc.apply(context, args.concat([handler]));
                    } catch (err) {
                        if ((0, _canReportError.canReportError)(subject)) {
                            subject.error(err);
                        } else {
                            console.warn(err);
                        }
                    }
                }
                return subject.subscribe(subscriber);
            } else {
                return scheduler.schedule(dispatch, 0, { params: params, subscriber: subscriber, context: context });
            }
        });
    };
}
function dispatch(state) {
    var _this = this;
    var params = state.params,
        subscriber = state.subscriber,
        context = state.context;
    var callbackFunc = params.callbackFunc,
        args = params.args,
        scheduler = params.scheduler;
    var subject = params.subject;
    if (!subject) {
        subject = params.subject = new _AsyncSubject.AsyncSubject();
        var handler = function handler() {
            var innerArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                innerArgs[_i] = arguments[_i];
            }
            var err = innerArgs.shift();
            if (err) {
                _this.add(scheduler.schedule(dispatchError, 0, { err: err, subject: subject }));
            } else {
                var value = innerArgs.length <= 1 ? innerArgs[0] : innerArgs;
                _this.add(scheduler.schedule(dispatchNext, 0, { value: value, subject: subject }));
            }
        };
        try {
            callbackFunc.apply(context, args.concat([handler]));
        } catch (err) {
            this.add(scheduler.schedule(dispatchError, 0, { err: err, subject: subject }));
        }
    }
    this.add(subject.subscribe(subscriber));
}
function dispatchNext(arg) {
    var value = arg.value,
        subject = arg.subject;
    subject.next(value);
    subject.complete();
}
function dispatchError(arg) {
    var err = arg.err,
        subject = arg.subject;
    subject.error(err);
}
//# sourceMappingURL=bindNodeCallback.js.map

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CombineLatestSubscriber = exports.CombineLatestOperator = undefined;
exports.combineLatest = combineLatest;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _isScheduler = __webpack_require__(7);

var _isArray = __webpack_require__(6);

var _OuterSubscriber = __webpack_require__(20);

var _subscribeToResult = __webpack_require__(21);

var _fromArray = __webpack_require__(15);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/** PURE_IMPORTS_START tslib,_util_isScheduler,_util_isArray,_OuterSubscriber,_util_subscribeToResult,_fromArray PURE_IMPORTS_END */
var NONE = {};
function combineLatest() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i] = arguments[_i];
    }
    var resultSelector = null;
    var scheduler = null;
    if ((0, _isScheduler.isScheduler)(observables[observables.length - 1])) {
        scheduler = observables.pop();
    }
    if (typeof observables[observables.length - 1] === 'function') {
        resultSelector = observables.pop();
    }
    if (observables.length === 1 && (0, _isArray.isArray)(observables[0])) {
        observables = observables[0];
    }
    return (0, _fromArray.fromArray)(observables, scheduler).lift(new CombineLatestOperator(resultSelector));
}
var CombineLatestOperator = /*@__PURE__*/function () {
    function CombineLatestOperator(resultSelector) {
        this.resultSelector = resultSelector;
    }
    CombineLatestOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new CombineLatestSubscriber(subscriber, this.resultSelector));
    };
    return CombineLatestOperator;
}();
exports.CombineLatestOperator = CombineLatestOperator;

var CombineLatestSubscriber = /*@__PURE__*/function (_super) {
    tslib_1.__extends(CombineLatestSubscriber, _super);
    function CombineLatestSubscriber(destination, resultSelector) {
        var _this = _super.call(this, destination) || this;
        _this.resultSelector = resultSelector;
        _this.active = 0;
        _this.values = [];
        _this.observables = [];
        return _this;
    }
    CombineLatestSubscriber.prototype._next = function (observable) {
        this.values.push(NONE);
        this.observables.push(observable);
    };
    CombineLatestSubscriber.prototype._complete = function () {
        var observables = this.observables;
        var len = observables.length;
        if (len === 0) {
            this.destination.complete();
        } else {
            this.active = len;
            this.toRespond = len;
            for (var i = 0; i < len; i++) {
                var observable = observables[i];
                this.add((0, _subscribeToResult.subscribeToResult)(this, observable, observable, i));
            }
        }
    };
    CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
        if ((this.active -= 1) === 0) {
            this.destination.complete();
        }
    };
    CombineLatestSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var values = this.values;
        var oldVal = values[outerIndex];
        var toRespond = !this.toRespond ? 0 : oldVal === NONE ? --this.toRespond : this.toRespond;
        values[outerIndex] = innerValue;
        if (toRespond === 0) {
            if (this.resultSelector) {
                this._tryResultSelector(values);
            } else {
                this.destination.next(values.slice());
            }
        }
    };
    CombineLatestSubscriber.prototype._tryResultSelector = function (values) {
        var result;
        try {
            result = this.resultSelector.apply(this, values);
        } catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return CombineLatestSubscriber;
}(_OuterSubscriber.OuterSubscriber);
exports.CombineLatestSubscriber = CombineLatestSubscriber;
//# sourceMappingURL=combineLatest.js.map

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.subscribeToPromise = undefined;

var _hostReportError = __webpack_require__(26);

var subscribeToPromise = exports.subscribeToPromise = function subscribeToPromise(promise) {
    return function (subscriber) {
        promise.then(function (value) {
            if (!subscriber.closed) {
                subscriber.next(value);
                subscriber.complete();
            }
        }, function (err) {
            return subscriber.error(err);
        }).then(null, _hostReportError.hostReportError);
        return subscriber;
    };
};
//# sourceMappingURL=subscribeToPromise.js.map
/** PURE_IMPORTS_START _hostReportError PURE_IMPORTS_END */

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.subscribeToIterable = undefined;

var _iterator = __webpack_require__(16);

var subscribeToIterable = exports.subscribeToIterable = function subscribeToIterable(iterable) {
    return function (subscriber) {
        var iterator = iterable[_iterator.iterator]();
        do {
            var item = iterator.next();
            if (item.done) {
                subscriber.complete();
                break;
            }
            subscriber.next(item.value);
            if (subscriber.closed) {
                break;
            }
        } while (true);
        if (typeof iterator.return === 'function') {
            subscriber.add(function () {
                if (iterator.return) {
                    iterator.return();
                }
            });
        }
        return subscriber;
    };
};
//# sourceMappingURL=subscribeToIterable.js.map
/** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.subscribeToObservable = undefined;

var _observable = __webpack_require__(8);

var subscribeToObservable = exports.subscribeToObservable = function subscribeToObservable(obj) {
    return function (subscriber) {
        var obs = obj[_observable.observable]();
        if (typeof obs.subscribe !== 'function') {
            throw new TypeError('Provided object does not correctly implement Symbol.observable');
        } else {
            return obs.subscribe(subscriber);
        }
    };
};
//# sourceMappingURL=subscribeToObservable.js.map
/** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.concat = concat;

var _of = __webpack_require__(30);

var _concatAll = __webpack_require__(107);

/** PURE_IMPORTS_START _of,_operators_concatAll PURE_IMPORTS_END */
function concat() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i] = arguments[_i];
    }
    return (0, _concatAll.concatAll)()(_of.of.apply(void 0, observables));
}
//# sourceMappingURL=concat.js.map

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.concatAll = concatAll;

var _mergeAll = __webpack_require__(53);

function concatAll() {
    return (0, _mergeAll.mergeAll)(1);
}
//# sourceMappingURL=concatAll.js.map
/** PURE_IMPORTS_START _mergeAll PURE_IMPORTS_END */

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MergeMapSubscriber = exports.MergeMapOperator = undefined;
exports.mergeMap = mergeMap;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _subscribeToResult = __webpack_require__(21);

var _OuterSubscriber = __webpack_require__(20);

var _InnerSubscriber = __webpack_require__(50);

var _map = __webpack_require__(11);

var _from = __webpack_require__(12);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/** PURE_IMPORTS_START tslib,_util_subscribeToResult,_OuterSubscriber,_InnerSubscriber,_map,_observable_from PURE_IMPORTS_END */
function mergeMap(project, resultSelector, concurrent) {
    if (concurrent === void 0) {
        concurrent = Number.POSITIVE_INFINITY;
    }
    if (typeof resultSelector === 'function') {
        return function (source) {
            return source.pipe(mergeMap(function (a, i) {
                return (0, _from.from)(project(a, i)).pipe((0, _map.map)(function (b, ii) {
                    return resultSelector(a, b, i, ii);
                }));
            }, concurrent));
        };
    } else if (typeof resultSelector === 'number') {
        concurrent = resultSelector;
    }
    return function (source) {
        return source.lift(new MergeMapOperator(project, concurrent));
    };
}
var MergeMapOperator = /*@__PURE__*/function () {
    function MergeMapOperator(project, concurrent) {
        if (concurrent === void 0) {
            concurrent = Number.POSITIVE_INFINITY;
        }
        this.project = project;
        this.concurrent = concurrent;
    }
    MergeMapOperator.prototype.call = function (observer, source) {
        return source.subscribe(new MergeMapSubscriber(observer, this.project, this.concurrent));
    };
    return MergeMapOperator;
}();
exports.MergeMapOperator = MergeMapOperator;

var MergeMapSubscriber = /*@__PURE__*/function (_super) {
    tslib_1.__extends(MergeMapSubscriber, _super);
    function MergeMapSubscriber(destination, project, concurrent) {
        if (concurrent === void 0) {
            concurrent = Number.POSITIVE_INFINITY;
        }
        var _this = _super.call(this, destination) || this;
        _this.project = project;
        _this.concurrent = concurrent;
        _this.hasCompleted = false;
        _this.buffer = [];
        _this.active = 0;
        _this.index = 0;
        return _this;
    }
    MergeMapSubscriber.prototype._next = function (value) {
        if (this.active < this.concurrent) {
            this._tryNext(value);
        } else {
            this.buffer.push(value);
        }
    };
    MergeMapSubscriber.prototype._tryNext = function (value) {
        var result;
        var index = this.index++;
        try {
            result = this.project(value, index);
        } catch (err) {
            this.destination.error(err);
            return;
        }
        this.active++;
        this._innerSub(result, value, index);
    };
    MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
        var innerSubscriber = new _InnerSubscriber.InnerSubscriber(this, undefined, undefined);
        var destination = this.destination;
        destination.add(innerSubscriber);
        (0, _subscribeToResult.subscribeToResult)(this, ish, value, index, innerSubscriber);
    };
    MergeMapSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            this.destination.complete();
        }
        this.unsubscribe();
    };
    MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    };
    MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
        var buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        } else if (this.active === 0 && this.hasCompleted) {
            this.destination.complete();
        }
    };
    return MergeMapSubscriber;
}(_OuterSubscriber.OuterSubscriber);
exports.MergeMapSubscriber = MergeMapSubscriber;
//# sourceMappingURL=mergeMap.js.map

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.scheduleObservable = scheduleObservable;

var _Observable = __webpack_require__(0);

var _Subscription = __webpack_require__(3);

var _observable = __webpack_require__(8);

function scheduleObservable(input, scheduler) {
    return new _Observable.Observable(function (subscriber) {
        var sub = new _Subscription.Subscription();
        sub.add(scheduler.schedule(function () {
            var observable = input[_observable.observable]();
            sub.add(observable.subscribe({
                next: function next(value) {
                    sub.add(scheduler.schedule(function () {
                        return subscriber.next(value);
                    }));
                },
                error: function error(err) {
                    sub.add(scheduler.schedule(function () {
                        return subscriber.error(err);
                    }));
                },
                complete: function complete() {
                    sub.add(scheduler.schedule(function () {
                        return subscriber.complete();
                    }));
                }
            }));
        }));
        return sub;
    });
}
//# sourceMappingURL=scheduleObservable.js.map
/** PURE_IMPORTS_START _Observable,_Subscription,_symbol_observable PURE_IMPORTS_END */

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.schedulePromise = schedulePromise;

var _Observable = __webpack_require__(0);

var _Subscription = __webpack_require__(3);

/** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
function schedulePromise(input, scheduler) {
    return new _Observable.Observable(function (subscriber) {
        var sub = new _Subscription.Subscription();
        sub.add(scheduler.schedule(function () {
            return input.then(function (value) {
                sub.add(scheduler.schedule(function () {
                    subscriber.next(value);
                    sub.add(scheduler.schedule(function () {
                        return subscriber.complete();
                    }));
                }));
            }, function (err) {
                sub.add(scheduler.schedule(function () {
                    return subscriber.error(err);
                }));
            });
        }));
        return sub;
    });
}
//# sourceMappingURL=schedulePromise.js.map

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.scheduleIterable = scheduleIterable;

var _Observable = __webpack_require__(0);

var _Subscription = __webpack_require__(3);

var _iterator = __webpack_require__(16);

function scheduleIterable(input, scheduler) {
    if (!input) {
        throw new Error('Iterable cannot be null');
    }
    return new _Observable.Observable(function (subscriber) {
        var sub = new _Subscription.Subscription();
        var iterator;
        sub.add(function () {
            if (iterator && typeof iterator.return === 'function') {
                iterator.return();
            }
        });
        sub.add(scheduler.schedule(function () {
            iterator = input[_iterator.iterator]();
            sub.add(scheduler.schedule(function () {
                if (subscriber.closed) {
                    return;
                }
                var value;
                var done;
                try {
                    var result = iterator.next();
                    value = result.value;
                    done = result.done;
                } catch (err) {
                    subscriber.error(err);
                    return;
                }
                if (done) {
                    subscriber.complete();
                } else {
                    subscriber.next(value);
                    this.schedule();
                }
            }));
        }));
        return sub;
    });
}
//# sourceMappingURL=scheduleIterable.js.map
/** PURE_IMPORTS_START _Observable,_Subscription,_symbol_iterator PURE_IMPORTS_END */

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isInteropObservable = isInteropObservable;

var _observable = __webpack_require__(8);

function isInteropObservable(input) {
    return input && typeof input[_observable.observable] === 'function';
}
//# sourceMappingURL=isInteropObservable.js.map
/** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isIterable = isIterable;

var _iterator = __webpack_require__(16);

function isIterable(input) {
    return input && typeof input[_iterator.iterator] === 'function';
}
//# sourceMappingURL=isIterable.js.map
/** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.forkJoin = forkJoin;

var _Observable = __webpack_require__(0);

var _isArray = __webpack_require__(6);

var _map = __webpack_require__(11);

var _isObject = __webpack_require__(27);

var _from = __webpack_require__(12);

function forkJoin() {
    var sources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sources[_i] = arguments[_i];
    }
    if (sources.length === 1) {
        var first_1 = sources[0];
        if ((0, _isArray.isArray)(first_1)) {
            return forkJoinInternal(first_1, null);
        }
        if ((0, _isObject.isObject)(first_1) && Object.getPrototypeOf(first_1) === Object.prototype) {
            var keys = Object.keys(first_1);
            return forkJoinInternal(keys.map(function (key) {
                return first_1[key];
            }), keys);
        }
    }
    if (typeof sources[sources.length - 1] === 'function') {
        var resultSelector_1 = sources.pop();
        sources = sources.length === 1 && (0, _isArray.isArray)(sources[0]) ? sources[0] : sources;
        return forkJoinInternal(sources, null).pipe((0, _map.map)(function (args) {
            return resultSelector_1.apply(void 0, args);
        }));
    }
    return forkJoinInternal(sources, null);
} /** PURE_IMPORTS_START _Observable,_util_isArray,_operators_map,_util_isObject,_from PURE_IMPORTS_END */

function forkJoinInternal(sources, keys) {
    return new _Observable.Observable(function (subscriber) {
        var len = sources.length;
        if (len === 0) {
            subscriber.complete();
            return;
        }
        var values = new Array(len);
        var completed = 0;
        var emitted = 0;
        var _loop_1 = function _loop_1(i) {
            var source = (0, _from.from)(sources[i]);
            var hasValue = false;
            subscriber.add(source.subscribe({
                next: function next(value) {
                    if (!hasValue) {
                        hasValue = true;
                        emitted++;
                    }
                    values[i] = value;
                },
                error: function error(err) {
                    return subscriber.error(err);
                },
                complete: function complete() {
                    completed++;
                    if (completed === len || !hasValue) {
                        if (emitted === len) {
                            subscriber.next(keys ? keys.reduce(function (result, key, i) {
                                return result[key] = values[i], result;
                            }, {}) : values);
                        }
                        subscriber.complete();
                    }
                }
            }));
        };
        for (var i = 0; i < len; i++) {
            _loop_1(i);
        }
    });
}
//# sourceMappingURL=forkJoin.js.map

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fromEvent = fromEvent;

var _Observable = __webpack_require__(0);

var _isArray = __webpack_require__(6);

var _isFunction = __webpack_require__(17);

var _map = __webpack_require__(11);

/** PURE_IMPORTS_START _Observable,_util_isArray,_util_isFunction,_operators_map PURE_IMPORTS_END */
var toString = Object.prototype.toString;
function fromEvent(target, eventName, options, resultSelector) {
    if ((0, _isFunction.isFunction)(options)) {
        resultSelector = options;
        options = undefined;
    }
    if (resultSelector) {
        return fromEvent(target, eventName, options).pipe((0, _map.map)(function (args) {
            return (0, _isArray.isArray)(args) ? resultSelector.apply(void 0, args) : resultSelector(args);
        }));
    }
    return new _Observable.Observable(function (subscriber) {
        function handler(e) {
            if (arguments.length > 1) {
                subscriber.next(Array.prototype.slice.call(arguments));
            } else {
                subscriber.next(e);
            }
        }
        setupSubscription(target, eventName, handler, subscriber, options);
    });
}
function setupSubscription(sourceObj, eventName, handler, subscriber, options) {
    var unsubscribe;
    if (isEventTarget(sourceObj)) {
        var source_1 = sourceObj;
        sourceObj.addEventListener(eventName, handler, options);
        unsubscribe = function unsubscribe() {
            return source_1.removeEventListener(eventName, handler, options);
        };
    } else if (isJQueryStyleEventEmitter(sourceObj)) {
        var source_2 = sourceObj;
        sourceObj.on(eventName, handler);
        unsubscribe = function unsubscribe() {
            return source_2.off(eventName, handler);
        };
    } else if (isNodeStyleEventEmitter(sourceObj)) {
        var source_3 = sourceObj;
        sourceObj.addListener(eventName, handler);
        unsubscribe = function unsubscribe() {
            return source_3.removeListener(eventName, handler);
        };
    } else if (sourceObj && sourceObj.length) {
        for (var i = 0, len = sourceObj.length; i < len; i++) {
            setupSubscription(sourceObj[i], eventName, handler, subscriber, options);
        }
    } else {
        throw new TypeError('Invalid event target');
    }
    subscriber.add(unsubscribe);
}
function isNodeStyleEventEmitter(sourceObj) {
    return sourceObj && typeof sourceObj.addListener === 'function' && typeof sourceObj.removeListener === 'function';
}
function isJQueryStyleEventEmitter(sourceObj) {
    return sourceObj && typeof sourceObj.on === 'function' && typeof sourceObj.off === 'function';
}
function isEventTarget(sourceObj) {
    return sourceObj && typeof sourceObj.addEventListener === 'function' && typeof sourceObj.removeEventListener === 'function';
}
//# sourceMappingURL=fromEvent.js.map

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fromEventPattern = fromEventPattern;

var _Observable = __webpack_require__(0);

var _isArray = __webpack_require__(6);

var _isFunction = __webpack_require__(17);

var _map = __webpack_require__(11);

/** PURE_IMPORTS_START _Observable,_util_isArray,_util_isFunction,_operators_map PURE_IMPORTS_END */
function fromEventPattern(addHandler, removeHandler, resultSelector) {
    if (resultSelector) {
        return fromEventPattern(addHandler, removeHandler).pipe((0, _map.map)(function (args) {
            return (0, _isArray.isArray)(args) ? resultSelector.apply(void 0, args) : resultSelector(args);
        }));
    }
    return new _Observable.Observable(function (subscriber) {
        var handler = function handler() {
            var e = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                e[_i] = arguments[_i];
            }
            return subscriber.next(e.length === 1 ? e[0] : e);
        };
        var retValue;
        try {
            retValue = addHandler(handler);
        } catch (err) {
            subscriber.error(err);
            return undefined;
        }
        if (!(0, _isFunction.isFunction)(removeHandler)) {
            return undefined;
        }
        return function () {
            return removeHandler(handler, retValue);
        };
    });
}
//# sourceMappingURL=fromEventPattern.js.map

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.generate = generate;

var _Observable = __webpack_require__(0);

var _identity = __webpack_require__(34);

var _isScheduler = __webpack_require__(7);

function generate(initialStateOrOptions, condition, iterate, resultSelectorOrObservable, scheduler) {
    var resultSelector;
    var initialState;
    if (arguments.length == 1) {
        var options = initialStateOrOptions;
        initialState = options.initialState;
        condition = options.condition;
        iterate = options.iterate;
        resultSelector = options.resultSelector || _identity.identity;
        scheduler = options.scheduler;
    } else if (resultSelectorOrObservable === undefined || (0, _isScheduler.isScheduler)(resultSelectorOrObservable)) {
        initialState = initialStateOrOptions;
        resultSelector = _identity.identity;
        scheduler = resultSelectorOrObservable;
    } else {
        initialState = initialStateOrOptions;
        resultSelector = resultSelectorOrObservable;
    }
    return new _Observable.Observable(function (subscriber) {
        var state = initialState;
        if (scheduler) {
            return scheduler.schedule(dispatch, 0, {
                subscriber: subscriber,
                iterate: iterate,
                condition: condition,
                resultSelector: resultSelector,
                state: state
            });
        }
        do {
            if (condition) {
                var conditionResult = void 0;
                try {
                    conditionResult = condition(state);
                } catch (err) {
                    subscriber.error(err);
                    return undefined;
                }
                if (!conditionResult) {
                    subscriber.complete();
                    break;
                }
            }
            var value = void 0;
            try {
                value = resultSelector(state);
            } catch (err) {
                subscriber.error(err);
                return undefined;
            }
            subscriber.next(value);
            if (subscriber.closed) {
                break;
            }
            try {
                state = iterate(state);
            } catch (err) {
                subscriber.error(err);
                return undefined;
            }
        } while (true);
        return undefined;
    });
} /** PURE_IMPORTS_START _Observable,_util_identity,_util_isScheduler PURE_IMPORTS_END */

function dispatch(state) {
    var subscriber = state.subscriber,
        condition = state.condition;
    if (subscriber.closed) {
        return undefined;
    }
    if (state.needIterate) {
        try {
            state.state = state.iterate(state.state);
        } catch (err) {
            subscriber.error(err);
            return undefined;
        }
    } else {
        state.needIterate = true;
    }
    if (condition) {
        var conditionResult = void 0;
        try {
            conditionResult = condition(state.state);
        } catch (err) {
            subscriber.error(err);
            return undefined;
        }
        if (!conditionResult) {
            subscriber.complete();
            return undefined;
        }
        if (subscriber.closed) {
            return undefined;
        }
    }
    var value;
    try {
        value = state.resultSelector(state.state);
    } catch (err) {
        subscriber.error(err);
        return undefined;
    }
    if (subscriber.closed) {
        return undefined;
    }
    subscriber.next(value);
    if (subscriber.closed) {
        return undefined;
    }
    return this.schedule(state);
}
//# sourceMappingURL=generate.js.map

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.iif = iif;

var _defer = __webpack_require__(55);

var _empty = __webpack_require__(10);

/** PURE_IMPORTS_START _defer,_empty PURE_IMPORTS_END */
function iif(condition, trueResult, falseResult) {
    if (trueResult === void 0) {
        trueResult = _empty.EMPTY;
    }
    if (falseResult === void 0) {
        falseResult = _empty.EMPTY;
    }
    return (0, _defer.defer)(function () {
        return condition() ? trueResult : falseResult;
    });
}
//# sourceMappingURL=iif.js.map

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.interval = interval;

var _Observable = __webpack_require__(0);

var _async = __webpack_require__(33);

var _isNumeric = __webpack_require__(56);

function interval(period, scheduler) {
    if (period === void 0) {
        period = 0;
    }
    if (scheduler === void 0) {
        scheduler = _async.async;
    }
    if (!(0, _isNumeric.isNumeric)(period) || period < 0) {
        period = 0;
    }
    if (!scheduler || typeof scheduler.schedule !== 'function') {
        scheduler = _async.async;
    }
    return new _Observable.Observable(function (subscriber) {
        subscriber.add(scheduler.schedule(dispatch, period, { subscriber: subscriber, counter: 0, period: period }));
        return subscriber;
    });
} /** PURE_IMPORTS_START _Observable,_scheduler_async,_util_isNumeric PURE_IMPORTS_END */

function dispatch(state) {
    var subscriber = state.subscriber,
        counter = state.counter,
        period = state.period;
    subscriber.next(counter);
    this.schedule({ subscriber: subscriber, counter: counter + 1, period: period }, period);
}
//# sourceMappingURL=interval.js.map

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.merge = merge;

var _Observable = __webpack_require__(0);

var _isScheduler = __webpack_require__(7);

var _mergeAll = __webpack_require__(53);

var _fromArray = __webpack_require__(15);

/** PURE_IMPORTS_START _Observable,_util_isScheduler,_operators_mergeAll,_fromArray PURE_IMPORTS_END */
function merge() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i] = arguments[_i];
    }
    var concurrent = Number.POSITIVE_INFINITY;
    var scheduler = null;
    var last = observables[observables.length - 1];
    if ((0, _isScheduler.isScheduler)(last)) {
        scheduler = observables.pop();
        if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
            concurrent = observables.pop();
        }
    } else if (typeof last === 'number') {
        concurrent = observables.pop();
    }
    if (scheduler === null && observables.length === 1 && observables[0] instanceof _Observable.Observable) {
        return observables[0];
    }
    return (0, _mergeAll.mergeAll)(concurrent)((0, _fromArray.fromArray)(observables, scheduler));
}
//# sourceMappingURL=merge.js.map

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NEVER = undefined;
exports.never = never;

var _Observable = __webpack_require__(0);

var _noop = __webpack_require__(29);

/** PURE_IMPORTS_START _Observable,_util_noop PURE_IMPORTS_END */
var NEVER = /*@__PURE__*/exports.NEVER = new _Observable.Observable(_noop.noop);
function never() {
    return NEVER;
}
//# sourceMappingURL=never.js.map

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.onErrorResumeNext = onErrorResumeNext;

var _Observable = __webpack_require__(0);

var _from = __webpack_require__(12);

var _isArray = __webpack_require__(6);

var _empty = __webpack_require__(10);

/** PURE_IMPORTS_START _Observable,_from,_util_isArray,_empty PURE_IMPORTS_END */
function onErrorResumeNext() {
    var sources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sources[_i] = arguments[_i];
    }
    if (sources.length === 0) {
        return _empty.EMPTY;
    }
    var first = sources[0],
        remainder = sources.slice(1);
    if (sources.length === 1 && (0, _isArray.isArray)(first)) {
        return onErrorResumeNext.apply(void 0, first);
    }
    return new _Observable.Observable(function (subscriber) {
        var subNext = function subNext() {
            return subscriber.add(onErrorResumeNext.apply(void 0, remainder).subscribe(subscriber));
        };
        return (0, _from.from)(first).subscribe({
            next: function next(value) {
                subscriber.next(value);
            },
            error: subNext,
            complete: subNext
        });
    });
}
//# sourceMappingURL=onErrorResumeNext.js.map

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pairs = pairs;
exports.dispatch = dispatch;

var _Observable = __webpack_require__(0);

var _Subscription = __webpack_require__(3);

/** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
function pairs(obj, scheduler) {
    if (!scheduler) {
        return new _Observable.Observable(function (subscriber) {
            var keys = Object.keys(obj);
            for (var i = 0; i < keys.length && !subscriber.closed; i++) {
                var key = keys[i];
                if (obj.hasOwnProperty(key)) {
                    subscriber.next([key, obj[key]]);
                }
            }
            subscriber.complete();
        });
    } else {
        return new _Observable.Observable(function (subscriber) {
            var keys = Object.keys(obj);
            var subscription = new _Subscription.Subscription();
            subscription.add(scheduler.schedule(dispatch, 0, { keys: keys, index: 0, subscriber: subscriber, subscription: subscription, obj: obj }));
            return subscription;
        });
    }
}
function dispatch(state) {
    var keys = state.keys,
        index = state.index,
        subscriber = state.subscriber,
        subscription = state.subscription,
        obj = state.obj;
    if (!subscriber.closed) {
        if (index < keys.length) {
            var key = keys[index];
            subscriber.next([key, obj[key]]);
            subscription.add(this.schedule({ keys: keys, index: index + 1, subscriber: subscriber, subscription: subscription, obj: obj }));
        } else {
            subscriber.complete();
        }
    }
}
//# sourceMappingURL=pairs.js.map

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.partition = partition;

var _not = __webpack_require__(125);

var _subscribeTo = __webpack_require__(35);

var _filter = __webpack_require__(126);

var _Observable = __webpack_require__(0);

/** PURE_IMPORTS_START _util_not,_util_subscribeTo,_operators_filter,_Observable PURE_IMPORTS_END */
function partition(source, predicate, thisArg) {
    return [(0, _filter.filter)(predicate, thisArg)(new _Observable.Observable((0, _subscribeTo.subscribeTo)(source))), (0, _filter.filter)((0, _not.not)(predicate, thisArg))(new _Observable.Observable((0, _subscribeTo.subscribeTo)(source)))];
}
//# sourceMappingURL=partition.js.map

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.not = not;
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function not(pred, thisArg) {
    function notPred() {
        return !notPred.pred.apply(notPred.thisArg, arguments);
    }
    notPred.pred = pred;
    notPred.thisArg = thisArg;
    return notPred;
}
//# sourceMappingURL=not.js.map

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.filter = filter;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _Subscriber = __webpack_require__(4);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
function filter(predicate, thisArg) {
    return function filterOperatorFunction(source) {
        return source.lift(new FilterOperator(predicate, thisArg));
    };
}
var FilterOperator = /*@__PURE__*/function () {
    function FilterOperator(predicate, thisArg) {
        this.predicate = predicate;
        this.thisArg = thisArg;
    }
    FilterOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
    };
    return FilterOperator;
}();
var FilterSubscriber = /*@__PURE__*/function (_super) {
    tslib_1.__extends(FilterSubscriber, _super);
    function FilterSubscriber(destination, predicate, thisArg) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.thisArg = thisArg;
        _this.count = 0;
        return _this;
    }
    FilterSubscriber.prototype._next = function (value) {
        var result;
        try {
            result = this.predicate.call(this.thisArg, value, this.count++);
        } catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            this.destination.next(value);
        }
    };
    return FilterSubscriber;
}(_Subscriber.Subscriber);
//# sourceMappingURL=filter.js.map

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RaceSubscriber = exports.RaceOperator = undefined;
exports.race = race;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _isArray = __webpack_require__(6);

var _fromArray = __webpack_require__(15);

var _OuterSubscriber = __webpack_require__(20);

var _subscribeToResult = __webpack_require__(21);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function race() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i] = arguments[_i];
    }
    if (observables.length === 1) {
        if ((0, _isArray.isArray)(observables[0])) {
            observables = observables[0];
        } else {
            return observables[0];
        }
    }
    return (0, _fromArray.fromArray)(observables, undefined).lift(new RaceOperator());
} /** PURE_IMPORTS_START tslib,_util_isArray,_fromArray,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

var RaceOperator = /*@__PURE__*/function () {
    function RaceOperator() {}
    RaceOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new RaceSubscriber(subscriber));
    };
    return RaceOperator;
}();
exports.RaceOperator = RaceOperator;

var RaceSubscriber = /*@__PURE__*/function (_super) {
    tslib_1.__extends(RaceSubscriber, _super);
    function RaceSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.hasFirst = false;
        _this.observables = [];
        _this.subscriptions = [];
        return _this;
    }
    RaceSubscriber.prototype._next = function (observable) {
        this.observables.push(observable);
    };
    RaceSubscriber.prototype._complete = function () {
        var observables = this.observables;
        var len = observables.length;
        if (len === 0) {
            this.destination.complete();
        } else {
            for (var i = 0; i < len && !this.hasFirst; i++) {
                var observable = observables[i];
                var subscription = (0, _subscribeToResult.subscribeToResult)(this, observable, observable, i);
                if (this.subscriptions) {
                    this.subscriptions.push(subscription);
                }
                this.add(subscription);
            }
            this.observables = null;
        }
    };
    RaceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (!this.hasFirst) {
            this.hasFirst = true;
            for (var i = 0; i < this.subscriptions.length; i++) {
                if (i !== outerIndex) {
                    var subscription = this.subscriptions[i];
                    subscription.unsubscribe();
                    this.remove(subscription);
                }
            }
            this.subscriptions = null;
        }
        this.destination.next(innerValue);
    };
    return RaceSubscriber;
}(_OuterSubscriber.OuterSubscriber);
exports.RaceSubscriber = RaceSubscriber;
//# sourceMappingURL=race.js.map

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.range = range;
exports.dispatch = dispatch;

var _Observable = __webpack_require__(0);

function range(start, count, scheduler) {
    if (start === void 0) {
        start = 0;
    }
    return new _Observable.Observable(function (subscriber) {
        if (count === undefined) {
            count = start;
            start = 0;
        }
        var index = 0;
        var current = start;
        if (scheduler) {
            return scheduler.schedule(dispatch, 0, {
                index: index, count: count, start: start, subscriber: subscriber
            });
        } else {
            do {
                if (index++ >= count) {
                    subscriber.complete();
                    break;
                }
                subscriber.next(current++);
                if (subscriber.closed) {
                    break;
                }
            } while (true);
        }
        return undefined;
    });
} /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
function dispatch(state) {
    var start = state.start,
        index = state.index,
        count = state.count,
        subscriber = state.subscriber;
    if (index >= count) {
        subscriber.complete();
        return;
    }
    subscriber.next(start);
    if (subscriber.closed) {
        return;
    }
    state.index = index + 1;
    state.start = start + 1;
    this.schedule(state);
}
//# sourceMappingURL=range.js.map

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.timer = timer;

var _Observable = __webpack_require__(0);

var _async = __webpack_require__(33);

var _isNumeric = __webpack_require__(56);

var _isScheduler = __webpack_require__(7);

/** PURE_IMPORTS_START _Observable,_scheduler_async,_util_isNumeric,_util_isScheduler PURE_IMPORTS_END */
function timer(dueTime, periodOrScheduler, scheduler) {
    if (dueTime === void 0) {
        dueTime = 0;
    }
    var period = -1;
    if ((0, _isNumeric.isNumeric)(periodOrScheduler)) {
        period = Number(periodOrScheduler) < 1 && 1 || Number(periodOrScheduler);
    } else if ((0, _isScheduler.isScheduler)(periodOrScheduler)) {
        scheduler = periodOrScheduler;
    }
    if (!(0, _isScheduler.isScheduler)(scheduler)) {
        scheduler = _async.async;
    }
    return new _Observable.Observable(function (subscriber) {
        var due = (0, _isNumeric.isNumeric)(dueTime) ? dueTime : +dueTime - scheduler.now();
        return scheduler.schedule(dispatch, due, {
            index: 0, period: period, subscriber: subscriber
        });
    });
}
function dispatch(state) {
    var index = state.index,
        period = state.period,
        subscriber = state.subscriber;
    subscriber.next(index);
    if (subscriber.closed) {
        return;
    } else if (period === -1) {
        return subscriber.complete();
    }
    state.index = index + 1;
    this.schedule(state, period);
}
//# sourceMappingURL=timer.js.map

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.using = using;

var _Observable = __webpack_require__(0);

var _from = __webpack_require__(12);

var _empty = __webpack_require__(10);

function using(resourceFactory, observableFactory) {
    return new _Observable.Observable(function (subscriber) {
        var resource;
        try {
            resource = resourceFactory();
        } catch (err) {
            subscriber.error(err);
            return undefined;
        }
        var result;
        try {
            result = observableFactory(resource);
        } catch (err) {
            subscriber.error(err);
            return undefined;
        }
        var source = result ? (0, _from.from)(result) : _empty.EMPTY;
        var subscription = source.subscribe(subscriber);
        return function () {
            subscription.unsubscribe();
            if (resource) {
                resource.unsubscribe();
            }
        };
    });
}
//# sourceMappingURL=using.js.map
/** PURE_IMPORTS_START _Observable,_from,_empty PURE_IMPORTS_END */

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ZipSubscriber = exports.ZipOperator = undefined;
exports.zip = zip;

var _tslib = __webpack_require__(1);

var tslib_1 = _interopRequireWildcard(_tslib);

var _fromArray = __webpack_require__(15);

var _isArray = __webpack_require__(6);

var _Subscriber = __webpack_require__(4);

var _OuterSubscriber = __webpack_require__(20);

var _subscribeToResult = __webpack_require__(21);

var _iterator = __webpack_require__(16);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function zip() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i] = arguments[_i];
    }
    var resultSelector = observables[observables.length - 1];
    if (typeof resultSelector === 'function') {
        observables.pop();
    }
    return (0, _fromArray.fromArray)(observables, undefined).lift(new ZipOperator(resultSelector));
} /** PURE_IMPORTS_START tslib,_fromArray,_util_isArray,_Subscriber,_OuterSubscriber,_util_subscribeToResult,_.._internal_symbol_iterator PURE_IMPORTS_END */

var ZipOperator = /*@__PURE__*/function () {
    function ZipOperator(resultSelector) {
        this.resultSelector = resultSelector;
    }
    ZipOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ZipSubscriber(subscriber, this.resultSelector));
    };
    return ZipOperator;
}();
exports.ZipOperator = ZipOperator;

var ZipSubscriber = /*@__PURE__*/function (_super) {
    tslib_1.__extends(ZipSubscriber, _super);
    function ZipSubscriber(destination, resultSelector, values) {
        if (values === void 0) {
            values = Object.create(null);
        }
        var _this = _super.call(this, destination) || this;
        _this.iterators = [];
        _this.active = 0;
        _this.resultSelector = typeof resultSelector === 'function' ? resultSelector : null;
        _this.values = values;
        return _this;
    }
    ZipSubscriber.prototype._next = function (value) {
        var iterators = this.iterators;
        if ((0, _isArray.isArray)(value)) {
            iterators.push(new StaticArrayIterator(value));
        } else if (typeof value[_iterator.iterator] === 'function') {
            iterators.push(new StaticIterator(value[_iterator.iterator]()));
        } else {
            iterators.push(new ZipBufferIterator(this.destination, this, value));
        }
    };
    ZipSubscriber.prototype._complete = function () {
        var iterators = this.iterators;
        var len = iterators.length;
        this.unsubscribe();
        if (len === 0) {
            this.destination.complete();
            return;
        }
        this.active = len;
        for (var i = 0; i < len; i++) {
            var iterator = iterators[i];
            if (iterator.stillUnsubscribed) {
                var destination = this.destination;
                destination.add(iterator.subscribe(iterator, i));
            } else {
                this.active--;
            }
        }
    };
    ZipSubscriber.prototype.notifyInactive = function () {
        this.active--;
        if (this.active === 0) {
            this.destination.complete();
        }
    };
    ZipSubscriber.prototype.checkIterators = function () {
        var iterators = this.iterators;
        var len = iterators.length;
        var destination = this.destination;
        for (var i = 0; i < len; i++) {
            var iterator = iterators[i];
            if (typeof iterator.hasValue === 'function' && !iterator.hasValue()) {
                return;
            }
        }
        var shouldComplete = false;
        var args = [];
        for (var i = 0; i < len; i++) {
            var iterator = iterators[i];
            var result = iterator.next();
            if (iterator.hasCompleted()) {
                shouldComplete = true;
            }
            if (result.done) {
                destination.complete();
                return;
            }
            args.push(result.value);
        }
        if (this.resultSelector) {
            this._tryresultSelector(args);
        } else {
            destination.next(args);
        }
        if (shouldComplete) {
            destination.complete();
        }
    };
    ZipSubscriber.prototype._tryresultSelector = function (args) {
        var result;
        try {
            result = this.resultSelector.apply(this, args);
        } catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return ZipSubscriber;
}(_Subscriber.Subscriber);
exports.ZipSubscriber = ZipSubscriber;

var StaticIterator = /*@__PURE__*/function () {
    function StaticIterator(iterator) {
        this.iterator = iterator;
        this.nextResult = iterator.next();
    }
    StaticIterator.prototype.hasValue = function () {
        return true;
    };
    StaticIterator.prototype.next = function () {
        var result = this.nextResult;
        this.nextResult = this.iterator.next();
        return result;
    };
    StaticIterator.prototype.hasCompleted = function () {
        var nextResult = this.nextResult;
        return nextResult && nextResult.done;
    };
    return StaticIterator;
}();
var StaticArrayIterator = /*@__PURE__*/function () {
    function StaticArrayIterator(array) {
        this.array = array;
        this.index = 0;
        this.length = 0;
        this.length = array.length;
    }
    StaticArrayIterator.prototype[_iterator.iterator] = function () {
        return this;
    };
    StaticArrayIterator.prototype.next = function (value) {
        var i = this.index++;
        var array = this.array;
        return i < this.length ? { value: array[i], done: false } : { value: null, done: true };
    };
    StaticArrayIterator.prototype.hasValue = function () {
        return this.array.length > this.index;
    };
    StaticArrayIterator.prototype.hasCompleted = function () {
        return this.array.length === this.index;
    };
    return StaticArrayIterator;
}();
var ZipBufferIterator = /*@__PURE__*/function (_super) {
    tslib_1.__extends(ZipBufferIterator, _super);
    function ZipBufferIterator(destination, parent, observable) {
        var _this = _super.call(this, destination) || this;
        _this.parent = parent;
        _this.observable = observable;
        _this.stillUnsubscribed = true;
        _this.buffer = [];
        _this.isComplete = false;
        return _this;
    }
    ZipBufferIterator.prototype[_iterator.iterator] = function () {
        return this;
    };
    ZipBufferIterator.prototype.next = function () {
        var buffer = this.buffer;
        if (buffer.length === 0 && this.isComplete) {
            return { value: null, done: true };
        } else {
            return { value: buffer.shift(), done: false };
        }
    };
    ZipBufferIterator.prototype.hasValue = function () {
        return this.buffer.length > 0;
    };
    ZipBufferIterator.prototype.hasCompleted = function () {
        return this.buffer.length === 0 && this.isComplete;
    };
    ZipBufferIterator.prototype.notifyComplete = function () {
        if (this.buffer.length > 0) {
            this.isComplete = true;
            this.parent.notifyInactive();
        } else {
            this.destination.complete();
        }
    };
    ZipBufferIterator.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.buffer.push(innerValue);
        this.parent.checkIterators();
    };
    ZipBufferIterator.prototype.subscribe = function (value, index) {
        return (0, _subscribeToResult.subscribeToResult)(this, this.observable, this, index);
    };
    return ZipBufferIterator;
}(_OuterSubscriber.OuterSubscriber);
//# sourceMappingURL=zip.js.map

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bmoor = __webpack_require__(2),
    Eventing = bmoor.Eventing,
    getUid = bmoor.data.getUid,
    makeGetter = bmoor.makeGetter,
    Mapper = __webpack_require__(133).Mapper;

var Pool = function (_Eventing) {
	_inherits(Pool, _Eventing);

	function Pool() {
		_classCallCheck(this, Pool);

		var _this = _possibleConstructorReturn(this, (Pool.__proto__ || Object.getPrototypeOf(Pool)).call(this));

		bmoor.data.setUid(_this);

		_this.data = [];
		_this.feeds = {};
		_this.index = {};
		return _this;
	}

	_createClass(Pool, [{
		key: 'addFeed',
		value: function addFeed(feed, index, readings) {
			var dex = makeGetter(index),
			    uid = getUid(feed),
			    data = this.data,
			    dexs = this.index,
			    mapper = new Mapper(readings).go,
			    trigger = this.trigger.bind(this);

			function read(datum) {
				var i = dex(datum),
				    // identity
				d = dexs[i];

				if (!d) {
					d = dexs[i] = {
						_: i
					};
					data.push(d);
				}

				mapper(d, datum);

				trigger('update');
			}

			if (!this.feeds[uid]) {
				this.feeds[uid] = feed.on('insert', read);
			}
		}
	}]);

	return Pool;
}(Eventing);

module.exports = Pool;

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	encode: __webpack_require__(134),
	Generator: __webpack_require__(137),
	Path: __webpack_require__(36),
	validate: __webpack_require__(139)
};

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    bmoorSchema: __webpack_require__(135).default,
    jsonSchema: __webpack_require__(136).default
};

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var bmoor = __webpack_require__(2),
    ops;

function parse(def, path, val) {
	var method;

	if (val === null || val === undefined) {
		return;
	}

	if (bmoor.isArray(val)) {
		method = 'array';
	} else {
		method = typeof val === 'undefined' ? 'undefined' : _typeof(val);
	}

	ops[method](def, path.slice(0), val);
}

function formatProperty(prop, escaped) {
	if (prop.charAt(0) !== '[' && prop.search(escaped) !== -1) {
		prop = '["' + prop + '"]';
	}

	return prop;
}

function join(path, escaped) {
	var rtn = '';

	if (path && path.length) {
		rtn = formatProperty(path.shift(), escaped);

		while (path.length) {
			var prop = formatProperty(path.shift(), escaped),
			    nextChar = prop[0];

			if (nextChar !== '[') {
				rtn += '.';
			}

			rtn += prop;
		}
	}

	return rtn;
}

ops = {
	array: function array(def, path, val) {
		// always encode first value of array
		var next = val[0];

		path.push('[]');

		parse(def, path, next);
	},
	object: function object(def, path, val) {
		var pos = path.length;

		Object.keys(val).forEach(function (key) {
			path[pos] = key;

			parse(def, path, val[key]);
		});
	},
	number: function number(def, path, val) {
		def.push({
			path: path,
			type: 'number',
			sample: val
		});
	},
	boolean: function boolean(def, path, val) {
		def.push({
			path: path,
			type: 'boolean',
			sample: val
		});
	},
	string: function string(def, path, val) {
		def.push({
			path: path,
			type: 'string',
			sample: val
		});
	}
};

function encode(json, escaped) {
	var t = [];

	if (!escaped) {
		escaped = /[\W]/;
	}

	if (json) {
		parse(t, [], json);

		t.forEach(function (d) {
			return d.path = join(d.path, escaped);
		});

		return t;
	} else {
		return json;
	}
}

module.exports = {
	default: encode,
	types: ops
};

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Tokenizer = __webpack_require__(57).default;

var go;

function buildLeaf(info, token, prior) {
	var t = {},
	    types = [info.type];

	if (info.sensitivity && info.sensitivity === 'ignore') {
		t.ignore = true;
		types.push('null');
	} else if (info.sensitivity && info.sensitivity === 'required') {
		prior.push(token);
	} else {
		types.push('null');
	}

	t.type = types;

	if (info.encrypted) {
		t.encrypted = true;
	}

	return t;
}

function decorateObject(tokens, obj, info) {
	// could also be blank object coming from 
	if (!obj.type) {
		obj.type = ['object', 'null'];
	}

	if (!obj.required) {
		obj.required = [];
	}

	if (!obj.properties) {
		obj.properties = {};
	}

	go(tokens, obj.properties, info, obj.required);
}

function decorateArray(tokens, obj, token, info) {
	var path = token.value,
	    next = token.next;

	if (!obj.type) {
		obj.type = ['array', 'null'];
	}

	if (!obj.items) {
		obj.items = {};
	}

	if (info.sensitivity === 'required') {
		obj.minItems = 1;
	}

	if (next) {
		if (next.charAt(0) === '[') {
			decorateArray(tokens, obj.items, tokens.next(), info);
		} else {
			decorateObject(tokens, obj.items, info);
		}
	} else {
		obj.items = buildLeaf(info, path, []);
	}
}

go = function go(tokens, root, info, prior) {
	var token = tokens.next(),
	    path = token.value,
	    pos = path.indexOf('['),
	    next = token.next;

	if (pos !== -1 && path.charAt(pos + 1) === ']') {
		// this is an array
		var prop = path.substr(0, pos),
		    t = root[prop];

		if (!t) {
			t = root[prop] = {};
		}

		decorateArray(tokens, t, token, info);
	} else {
		if (pos === 0) {
			path = path.substring(2, path.length - 2);
		}

		if (next) {
			var _t = root[path];

			if (!_t) {
				_t = root[path] = {};
			}

			decorateObject(tokens, _t, info);
		} else {
			root[path] = buildLeaf(info, path, prior);
		}
	}
};

function encode(fields, shift, extra) {
	var root = {},
	    reqs = [];

	if (shift) {
		shift += '.';
	} else {
		shift = '';
	}

	fields.map(function (field) {
		var path = shift + field.path;

		try {
			var tokens = new Tokenizer(path);

			go(tokens, root, field, reqs);
		} catch (ex) {
			console.log('-------');
			console.log(path);
			console.log(ex.message);
			console.log(ex);
		}
	});

	return Object.assign({
		'$schema': 'http://json-schema.org/schema#',
		type: 'object',
		required: reqs,
		properties: root
	}, extra || {});
}

module.exports = {
	default: encode
};

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(2);
var Path = __webpack_require__(36).default;
var Writer = __webpack_require__(138).default;

var generators = {
	constant: function constant(cfg) {
		var value = cfg.value;
		return function () {
			return value;
		};
	},
	string: {
		random: function random() {
			return function () {
				return 'random string';
			};
		}
	},
	number: {
		index: function index() {
			var count = 1;
			return function () {
				return count++;
			};
		},
		random: function random(cfg) {
			if (!cfg) {
				cfg = {};
			}

			if (!cfg.min) {
				cfg.min = 1;
			}

			if (!cfg.max) {
				cfg.max = 100;
			}

			return function () {
				var val = Math.random() * (cfg.max - cfg.min);

				return val + cfg.min;
			};
		}
	},
	boolean: {
		random: function random() {
			return function () {
				return Math.random() * 10 % 2 === 0;
			};
		}
	},
	array: function array(cfg) {
		return function () {
			var count = cfg.length || 1;

			if (count < 1) {
				count = 1;
			}

			var rtn = [];

			while (count) {
				rtn.push({});
				count--;
			}

			return rtn;
		};
	}
};

var Generator = function () {
	function Generator(config) {
		var _this = this;

		_classCallCheck(this, Generator);

		this.fields = {};

		config.forEach(function (cfg) {
			_this.addField(new Path(cfg.path), cfg.generator, cfg.options);
		});
	}

	/*
 	path:
 	---
 	string: generator
 	object: options
 	||
 	any: value
 	||
 	function: factory
 */

	_createClass(Generator, [{
		key: 'addField',
		value: function addField(path, generator, options) {
			if (bmoor.isString(generator)) {
				generator = bmoor.get(generators, generator)(options);
			}

			var accessors = path.tokenizer.getAccessors();
			var name = accessors[0].join('.');
			var field = this.fields[accessors[0]];

			if (field) {
				field.addPath(path, generator);
			} else {
				field = new Writer(accessors.shift());

				field.addChild(accessors, generator);

				this.fields[name] = field;
			}
		}
	}, {
		key: 'generate',
		value: function generate() {
			var rtn = {};

			for (var f in this.fields) {
				var field = this.fields[f];

				field.generateOn(rtn);
			}

			return rtn;
		}
	}]);

	return Generator;
}();

module.exports = {
	default: Generator,
	generators: generators
};

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var makeSetter = __webpack_require__(2).makeSetter;

var Writer = function () {
	function Writer(accessor) {
		_classCallCheck(this, Writer);

		this.accessor = accessor;

		this.set = makeSetter(accessor);
	}

	_createClass(Writer, [{
		key: '_makeChild',
		value: function _makeChild(accessor) {
			return new this.constructor(accessor);
		}
	}, {
		key: 'addChild',
		value: function addChild(accessors, generator) {
			if (accessors.length) {
				var next = accessors.shift();

				if (!this.children) {
					this.children = {};

					if (!this.generator) {
						this.setGenerator(function () {
							return [{}];
						});
					}
				}

				var value = next.join('.');
				var child = this.children[value];

				if (!child) {
					child = this.children[value] = this._makeChild(next);
				}

				child.addChild(accessors, generator);
			} else {
				this.setGenerator(generator);
			}
		}
	}, {
		key: 'addPath',
		value: function addPath(path, generator) {
			var accessors = path.tokenizer.getAccessors();

			// TODO : better way to do this right?
			if (accessors[0].join('.') !== this.accessor.join('.')) {
				throw new Error('can not add path that does not ' + 'have matching first accessor');
			}

			accessors.shift();

			this.addChild(accessors, generator);
		}
	}, {
		key: 'setGenerator',
		value: function setGenerator(fn) {
			this.generator = fn;
		}
	}, {
		key: 'generateOn',
		value: function generateOn(obj) {
			var _this = this;

			var val = this.generator();

			this.set(obj, val);

			if (this.children) {
				val.forEach(function (datum) {
					for (var p in _this.children) {
						var child = _this.children[p];

						child.generateOn(datum);
					}
				});
			}
		}
	}]);

	return Writer;
}();

module.exports = {
	default: Writer
};

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Path = __webpack_require__(36).default;

var tests = [function (def, v, errors) {
	if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) !== def.type && (def.required || v !== undefined)) {
		errors.push({
			path: def.path,
			type: 'type',
			value: v,
			expect: def.type
		});
	}
}];

function validate(schema, obj) {
	var errors = [];

	schema.forEach(function (def) {
		var arr = new Path(def.path).flatten(obj);

		if (def.required && arr.length === 1 && arr[0] === undefined) {
			errors.push({
				path: def.path,
				type: 'missing',
				value: undefined,
				expect: def.type
			});
		} else if (arr.length) {
			arr.forEach(function (v) {
				tests.forEach(function (fn) {
					fn(def, v, errors);
				});
			});
		}
	});

	if (errors.length) {
		return errors;
	} else {
		return null;
	}
}

validate.$ops = tests;

module.exports = {
	default: validate,
	tests: tests
};

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bmoor = __webpack_require__(2),
    Hash = __webpack_require__(59),
    Test = __webpack_require__(60),
    routeFn = __webpack_require__(141).fn,
    indexFn = __webpack_require__(142).fn,
    filterFn = __webpack_require__(143).fn,
    sortedFn = __webpack_require__(144).fn,
    mappedFn = __webpack_require__(145).fn,
    testStack = __webpack_require__(146).test,
    memorized = __webpack_require__(147).memorized;

// NOTE : this class is a temporary class that will be removed eventually
//   this is to support backwards compatibility, so I am creating it now, but 
//   will depricate immediately in next version

var Feed = __webpack_require__(22);

var _require = __webpack_require__(39),
    Subject = _require.Subject;

var Actionable = function (_Feed) {
	_inherits(Actionable, _Feed);

	function Actionable(parent, fn, settings) {
		_classCallCheck(this, Actionable);

		var _this = _possibleConstructorReturn(this, (Actionable.__proto__ || Object.getPrototypeOf(Actionable)).call(this, null, settings));

		_this.go = function () {
			_this.data = fn(parent.data);

			_this.next();
		};

		_this.subscription = parent.subscribe(_this.go);
		return _this;
	}

	_createClass(Actionable, [{
		key: 'index',
		value: function index(search, settings) {
			var _this2 = this;

			return memorized(this, 'indexes', search instanceof Hash ? search : new Hash(search, settings), indexFn, function (fn) {
				var rtn = new Subject();

				var disconnect = _this2.subscribe(function (data) {
					var dex = fn(data);

					dex.disconnect = disconnect;

					rtn.data = dex;
					rtn.next();
				});

				return rtn;
			}, settings);
		}

		//--- child generators

	}, {
		key: 'route',
		value: function route(search, settings) {
			var _this3 = this;

			return memorized(this, 'routes', search instanceof Hash ? search : new Hash(search, settings), function (dex, parent) {
				return routeFn(dex, parent, function () {
					return new Feed();
				});
			}, function (fn) {
				var rtn = new Subject();

				var disconnect = _this3.subscribe(function (data) {
					var dex = fn(data);

					dex.disconnect = disconnect;

					rtn.data = dex;
					rtn.next();
				});

				return rtn;
			}, settings);
		}

		// TODO : create the Compare class, then memorize this

	}, {
		key: 'sorted',
		value: function sorted(sortFn, settings) {
			var _this4 = this;

			return memorized(this, 'sorts', {
				hash: sortFn.toString(),
				go: sortFn
			}, sortedFn, function (fn) {
				return new Actionable(_this4, fn);
			}, settings);
		}
	}, {
		key: 'map',
		value: function map(mapFn, settings) {
			var _this5 = this;

			return memorized(this, 'maps', {
				hash: mapFn.toString(),
				go: mapFn
			}, mappedFn, function (fn) {
				return new Actionable(_this5, fn);
			}, settings);
		}
	}, {
		key: '_filter',
		value: function _filter(search, settings) {
			var _this6 = this;

			return memorized(this, 'filters', search instanceof Test ? search : new Test(search, settings), filterFn, function (fn) {
				return new Actionable(_this6, fn);
			}, settings);
		}
	}, {
		key: 'filter',
		value: function filter(search, settings) {
			return this._filter(search, settings);
		}
	}, {
		key: 'select',
		value: function select(settings) {
			var ctx, test;

			for (var i = settings.tests.length - 1; i !== -1; i--) {
				test = testStack(test, settings.tests[i]);
			}

			var hash = settings.hash || 'search:' + Date.now();

			return this._filter(function (datum) {
				if (!datum.$normalized) {
					datum.$normalized = {};
				}

				var cache = datum.$normalized[hash];
				if (!cache) {
					cache = settings.normalizeDatum(datum);
					datum.$normalized[hash] = cache;
				}

				return test(cache, ctx);
			}, Object.assign(settings, {
				before: function before() {
					ctx = settings.normalizeContext();
				},
				hash: hash
			}));
		}
	}, {
		key: 'search',
		value: function search(settings) {
			console.warn('Collection::search, will be removed soon');
			return this.select(settings);
		}

		// settings { size }

	}, {
		key: 'paginate',
		value: function paginate(settings) {
			var _this7 = this;

			var child = null;

			var parent = this;
			var origSize = settings.size;

			var nav = {
				pos: settings.start || 0,
				goto: function goto(pos) {
					if (bmoor.isObject(pos)) {
						var tPos = parent.data.indexOf(pos);

						if (tPos === -1) {
							pos = 0;
						} else {
							pos = Math.floor(tPos / settings.size);
						}
					}

					if (pos < 0) {
						pos = 0;
					}

					if (pos !== this.pos) {
						this.pos = pos;
						child.go();
					}
				},
				hasNext: function hasNext() {
					return this.stop < this.count;
				},
				next: function next() {
					this.goto(this.pos + 1);
				},
				hasPrev: function hasPrev() {
					return !!this.start;
				},
				prev: function prev() {
					this.goto(this.pos - 1);
				},
				setSize: function setSize(size) {
					this.pos = -1;
					settings.size = size;
					this.goto(0);
				},
				maxSize: function maxSize() {
					this.setSize(child.parent.data.length);
				},
				resetSize: function resetSize() {
					this.setSize(origSize);
				}
			};

			child = new Feed();
			child.nav = nav;
			child.go = function () {
				var data = _this7.data;

				var span = settings.size,
				    length = data.length,
				    steps = Math.ceil(length / span);

				nav.span = span;
				nav.steps = steps;
				nav.count = length;

				var start = nav.pos * span;
				var stop = start + span;

				nav.start = start;
				if (stop > length) {
					stop = length;
				}
				nav.stop = stop;

				var inside = [];
				for (var i = start; i < stop; i++) {
					inside.push(data[i]);
				}

				child.data = inside;
				child.next();
			};

			this.subscribe(child.go);

			return child;
		}
	}]);

	return Actionable;
}(Feed);

module.exports = Actionable;

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	fn: function route(dex, parent, factory) {
		var index = {};

		function _get(key) {
			var collection = index[key];

			if (!collection) {
				collection = factory();
				index[key] = collection;
			}

			return collection;
		}

		function add(datum) {
			_get(dex.go(datum)).add(datum);
		}

		function go() {
			for (var k in index) {
				index[k].empty();
			}

			for (var i = 0, c = parent.data.length; i < c; i++) {
				add(parent.data[i]);
			}
		}

		return function makeRouter() {
			go();

			return {
				go: go,
				get: function get(search) {
					return _get(dex.parse(search));
				},
				keys: function keys() {
					return Object.keys(index);
				}
			};
		};
	}
};

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	fn: function indexer(dex, parent) {
		var index = null;

		function go() {
			var data = parent.data;

			index = {};

			for (var i = 0, c = data.length; i < c; i++) {
				var datum = data[i];
				var key = dex.go(datum);

				index[key] = datum;
			}
		}

		return function makeIndex() {
			go();

			return {
				go: go,
				get: function get(search) {
					return index[dex.parse(search)];
				},
				keys: function keys() {
					return Object.keys(index);
				}
			};
		};
	}
};

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	fn: function fn(dex, parent, settings) {
		return function (data) {
			if (settings.before) {
				settings.before();
			}

			var rtn = data.filter(function (datum) {
				return dex.go(datum);
			});

			if (settings.after) {
				settings.after();
			}

			return rtn;
		};
	}
};

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	fn: function fn(dex, parent, settings) {
		return function (data) {
			if (settings.before) {
				settings.before();
			}

			var rtn = data.slice(0);
			rtn.sort(dex.go);

			if (settings.after) {
				settings.after();
			}

			return rtn;
		};
	}
};

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	fn: function fn(dex, parent, settings) {
		return function (data) {
			if (settings.before) {
				settings.before();
			}

			var rtn = data.map(function (datum) {
				return dex.go(datum);
			});

			if (settings.after) {
				settings.after();
			}

			return rtn;
		};
	}
};

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	test: function test(old, fn) {
		if (old) {
			return function () {
				if (fn.apply(this, arguments)) {
					return true;
				} else {
					return old.apply(this, arguments);
				}
			};
		} else {
			return fn;
		}
	}
};

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	memorized: function memorized(parent, cache, expressor, generator, chainFn, settings) {
		var child, index, oldDisconnect;

		if (!parent[cache]) {
			parent[cache] = {};
		}

		index = parent[cache];

		child = index[expressor.hash];

		if (!child) {
			if (!settings) {
				settings = {};
			}

			if (settings.disconnect) {
				oldDisconnect = settings.disconnect;
			}

			child = chainFn(generator(expressor, parent, settings));

			index[expressor.hash] = child;
		}

		return child;
	}
};

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataProxy = __webpack_require__(37),
    DataCollection = __webpack_require__(58);

var defaultSettings = {
	proxyFactory: function proxyFactory(datum) {
		return new DataProxy(datum);
	}
};

function configSettings(settings) {
	if (!settings) {
		settings = {};
	}

	if (!('massage' in settings)) {
		settings.massage = function (proxy) {
			return proxy.getDatum();
		};
	}

	return settings;
}

var Proxied = function (_DataCollection) {
	_inherits(Proxied, _DataCollection);

	function Proxied(src, settings) {
		_classCallCheck(this, Proxied);

		var _this = _possibleConstructorReturn(this, (Proxied.__proto__ || Object.getPrototypeOf(Proxied)).call(this, src, settings));

		if (src) {
			_this.data.forEach(function (datum, i) {
				_this.data[i] = _this._wrap(datum);
			});
		}
		return _this;
	}

	//--- array methods


	_createClass(Proxied, [{
		key: 'indexOf',
		value: function indexOf(obj, start) {
			if (!start) {
				start = 0;
			}

			if (obj instanceof DataProxy) {
				return _get(Proxied.prototype.__proto__ || Object.getPrototypeOf(Proxied.prototype), 'indexOf', this).call(this, obj, start);
			} else {
				var c = this.data.length;
				while (start < c && this.data[start].getDatum() !== obj) {
					start++;
				}

				if (this.data.length !== start) {
					return start;
				} else {
					return -1;
				}
			}
		}
	}, {
		key: 'mergeChanges',
		value: function mergeChanges() {
			return this.data.map(function (p) {
				p.merge();

				return p.getDatum();
			});
		}
	}, {
		key: 'flattenAll',
		value: function flattenAll() {
			return this.data.map(function (p) {
				return p.flatten();
			});
		}

		//--- collection methods

	}, {
		key: '_wrap',
		value: function _wrap(datum) {
			var proxy;

			if (datum instanceof DataProxy) {
				proxy = datum;
			} else {
				var factory = this.settings.proxyFactory || defaultSettings.proxyFactory;
				proxy = factory(datum);
			}

			return proxy;
		}
	}, {
		key: '_add',
		value: function _add(datum) {
			var proxy = this._wrap(datum);

			return _get(Proxied.prototype.__proto__ || Object.getPrototypeOf(Proxied.prototype), '_add', this).call(this, proxy);
		}
	}, {
		key: 'index',
		value: function index(search, settings) {
			settings = configSettings(settings);

			return _get(Proxied.prototype.__proto__ || Object.getPrototypeOf(Proxied.prototype), 'index', this).call(this, search, settings);
		}

		//--- child generators 

	}, {
		key: 'route',
		value: function route(search, settings) {
			settings = configSettings(settings);

			return _get(Proxied.prototype.__proto__ || Object.getPrototypeOf(Proxied.prototype), 'route', this).call(this, search, settings);
		}
	}, {
		key: 'filter',
		value: function filter(search, settings) {
			settings = configSettings(settings);

			return _get(Proxied.prototype.__proto__ || Object.getPrototypeOf(Proxied.prototype), 'filter', this).call(this, search, settings);
		}
	}, {
		key: 'search',
		value: function search(settings) {
			return this.select(settings);
		}
	}, {
		key: 'select',
		value: function select(settings) {
			settings = configSettings(settings);

			return _get(Proxied.prototype.__proto__ || Object.getPrototypeOf(Proxied.prototype), 'select', this).call(this, settings);
		}
	}]);

	return Proxied;
}(DataCollection);

Proxied.settings = defaultSettings;

module.exports = Proxied;

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(2),
    schema = __webpack_require__(61),
    Join = __webpack_require__(150).Join;

/*
/models
 - name
 - properties [prop name]
  - read
  - write
  - update
 - relationships [prop name]
  - type (toOne, toMany)
  - model 
  - foreignKey
  - through []
    - model
    - incoming
    - outgoing
*/

function normalizeProperty(prop) {
	if (!('read' in prop)) {
		prop.read = true;
	}

	if (!('write' in prop)) {
		prop.write = false;
	}

	if (!('update' in prop)) {
		prop.update = false;
	}

	return prop;
}

var Model = function () {
	function Model(name, settings) {
		var _this = this;

		_classCallCheck(this, Model);

		this.name = name;

		this.id = settings.id || 'id';

		this.schema = schema.get(settings.schema || 'default');
		this.schema.register(name, this);

		/*
  [ name ] => {
  	read
  	write
  	update
  }
  */
		this.selectFields = settings.selectFields || [];
		this.createFields = settings.createFields || [];
		this.updateFields = settings.updateFields || [];

		this.properties = Object.keys(settings.properties).reduce(function (props, p) {
			var prop,
			    v = settings.properties[p];

			if (bmoor.isBoolean(v)) {
				prop = normalizeProperty({
					read: v,
					write: v,
					update: v
				});
			} else if (v === null) {
				prop = normalizeProperty({
					read: true,
					write: false,
					update: false
				});
			} else {
				prop = normalizeProperty(v);
			}

			props[p] = prop;

			if (prop.read) {
				_this.selectFields.push(p);
			}

			if (prop.write) {
				_this.createFields.push(p);
			}

			if (prop.update) {
				_this.updateFields.push(p);
			}

			return props;
		}, {});

		/*
  [ targetModel ] => {
  	type: 'toMany' || 'toOne'
  	key,
  	model:
  	foreignKey:
  	through: [{
  		model: 
  		incoming:
  		outgoing:
  	}]
  }
  */
		this.relationships = settings.relationships;
	}

	_createClass(Model, [{
		key: 'getJoin',
		value: function getJoin(target) {
			var relationship = this.relationships[target];

			if (relationship) {
				// right now I'm not handling cross schema stuff
				return new Join(relationship.type, {
					model: this.name,
					key: relationship.key
				}, {
					model: relationship.model,
					key: relationship.foreignKey
				}, relationship.through);
			} else {
				throw new Error('connection missing to ' + target);
			}
		}
	}]);

	return Model;
}();

module.exports = {
	Model: Model
};

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Join = function Join(type, begin, end, through) {
	var _this = this;

	_classCallCheck(this, Join);

	this.type = type;
	this.path = [];

	var curr = {
		fromModel: begin.model,
		fromKey: begin.key
	};

	if (through) {
		through.forEach(function (r) {
			curr.toModel = r.model;
			curr.toKey = r.incoming;

			_this.path.push(curr);

			curr = {
				fromModel: r.model,
				fromKey: r.outgoing
			};
		});
	}

	curr.toModel = end.model;
	curr.toKey = end.key;

	this.path.push(curr);
};

module.exports = {
	Join: Join
};

/***/ })
/******/ ]);