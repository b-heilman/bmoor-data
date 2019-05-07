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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = Object.create(__webpack_require__(1));

bmoor.dom = __webpack_require__(13);
bmoor.data = __webpack_require__(14);
bmoor.flow = __webpack_require__(15);
bmoor.array = __webpack_require__(18);
bmoor.build = __webpack_require__(19);
bmoor.object = __webpack_require__(23);
bmoor.string = __webpack_require__(24);
bmoor.promise = __webpack_require__(25);

bmoor.Memory = __webpack_require__(26);
bmoor.Eventing = __webpack_require__(27);

module.exports = bmoor;

/***/ }),
/* 1 */
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(0),
    makeGetter = bmoor.makeGetter,

// makeSetter = bmoor.makeSetter,
// Writer = require('./path/Writer.js').default,
// Reader = require('./path/Reader.js').default,
Tokenizer = __webpack_require__(5).default;

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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bmoor = __webpack_require__(0),
    Eventing = bmoor.Eventing,
    setUid = bmoor.data.setUid,
    oldPush = Array.prototype.push;

// designed for one way data flows.
// src -> feed -> target

var Feed = function (_Eventing) {
	_inherits(Feed, _Eventing);

	function Feed(src) {
		var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		_classCallCheck(this, Feed);

		var _this = _possibleConstructorReturn(this, (Feed.__proto__ || Object.getPrototypeOf(Feed)).call(this));

		_this.settings = settings;

		// need to define next here because _track can call it
		_this.next = bmoor.flow.window(function () {
			_this.trigger('next', _this);
		}, settings.windowMin || 0, settings.windowMax || 30);

		if (src) {
			src.push = src.unshift = _this.add.bind(_this);

			src.forEach(function (datum) {
				_this._track(datum);
			});
		} else {
			src = [];
		}

		setUid(_this);

		_this.data = src;
		_this.cold = !src.length;
		return _this;
	}

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

			this.goHot();

			return added;
		}
	}, {
		key: 'consume',
		value: function consume(arr) {
			for (var i = 0, c = arr.length; i < c; i++) {
				this._add(arr[i]);
			}

			this.goHot();
		}
	}, {
		key: 'empty',
		value: function empty() {
			this.data.length = 0;

			this.goHot();
		}
	}, {
		key: 'go',
		value: function go(parent) {
			this.empty();

			this.consume(parent.data);
		}
	}, {
		key: 'goHot',
		value: function goHot() {
			this.cold = false;
			this.next();
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			this.cold = true;
			this.data = null;
			this.disconnect();

			this.trigger('complete');
		}
	}, {
		key: 'subscribe',
		value: function subscribe(onNext, onError, onComplete) {
			var config = null;

			if (bmoor.isFunction(onNext)) {
				config = {
					next: onNext,
					error: onError || function () {
						// anything for default?
					},
					complete: onComplete || function () {
						// anything for default?
					}
				};
			} else {
				config = onNext;
			}

			if (!this.cold && config.next) {
				// make it act like a hot observable
				config.next(this);
			}

			return _get(Feed.prototype.__proto__ || Object.getPrototypeOf(Feed.prototype), 'subscribe', this).call(this, config);
		}

		// return back a promise that is active on the 'next'

	}, {
		key: 'promise',
		value: function promise() {
			var _this2 = this;

			if (this.next.active() || this.cold) {
				if (this._promise) {
					return this._promise;
				} else {
					this._promise = new Promise(function (resolve, reject) {
						var next = null;
						var error = null;

						next = _this2.once('next', function (collection) {
							_this2._promise = null;

							error();
							resolve(collection);
						});
						error = _this2.once('error', function (ex) {
							_this2._promise = null;

							next();
							reject(ex);
						});
					});
				}

				return this._promise;
			} else {
				return Promise.resolve(this);
			}
		}
	}, {
		key: 'follow',
		value: function follow(parent, settings) {
			var _this3 = this;

			var disconnect = parent.subscribe(Object.assign({
				next: function next(source) {
					_this3.go(source);
				},
				complete: function complete() {
					_this3.destroy();
				},
				error: function error() {
					// TODO : what to call?
				}
			}, settings));

			if (this.disconnect) {
				var old = this.disconnect;
				this.disconnect = function () {
					old();
					disconnect();
				};
			} else {
				this.disconnect = function () {
					disconnect();

					if (settings.disconnect) {
						settings.disconnect();
					}
				};
			}
		}

		// I want to remove this

	}, {
		key: 'sort',
		value: function sort(fn) {
			console.warn('Feed::sort, will be removed soon');
			this.data.sort(fn);
		}
	}]);

	return Feed;
}(Eventing);

module.exports = Feed;

/***/ }),
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(0);

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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bmoor = __webpack_require__(0),
    Feed = __webpack_require__(3),
    Hash = __webpack_require__(7),
    Test = __webpack_require__(8),
    _route = __webpack_require__(36).fn,
    _index = __webpack_require__(37).fn,
    filter = __webpack_require__(38).fn,
    _sorted = __webpack_require__(39).fn,
    mapped = __webpack_require__(40).fn,
    testStack = __webpack_require__(41).test,
    memorized = __webpack_require__(42).memorized;

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
			if (datum.on) {
				datum.on[this.$$bmoorUid] = datum.on('update', this.next);
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

				if (datum.on) {
					var fn = datum.on[this.$$bmoorUid];

					if (fn) {
						fn();
						datum.on[this.$$bmoorUid] = null;
					}
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
	}, {
		key: 'makeChild',
		value: function makeChild(settings, goFn) {
			var ChildClass = (settings ? settings.childClass : null) || this.constructor;
			var child = new ChildClass(null, settings);

			child.parent = this;

			if (goFn) {
				child.go = goFn;
			}

			child.follow(this, settings);

			return child;
		}
	}, {
		key: 'index',
		value: function index(search, settings) {
			return memorized(this, 'indexes', search instanceof Hash ? search : new Hash(search, settings), _index, settings);
		}
	}, {
		key: 'get',
		value: function get(search, settings) {
			return this.index(search, settings).get(search);
		}

		//--- child generators

	}, {
		key: 'route',
		value: function route(search, settings) {
			return memorized(this, 'routes', search instanceof Hash ? search : new Hash(search, settings), _route, settings);
		}

		// TODO : create the Compare class, then memorize this

	}, {
		key: 'sorted',
		value: function sorted(sortFn, settings) {
			return memorized(this, 'sorts', {
				hash: sortFn.toString(),
				go: sortFn
			}, _sorted, settings);
		}
	}, {
		key: 'map',
		value: function map(mapFn, settings) {
			return memorized(this, 'maps', {
				hash: mapFn.toString(),
				go: mapFn
			}, mapped, settings);
		}
	}, {
		key: '_filter',
		value: function _filter(search, settings) {
			return memorized(this, 'filters', search instanceof Test ? search : new Test(search, settings), filter, settings);
		}
	}, {
		key: 'filter',
		value: function filter(search, settings) {
			return this._filter(search, settings);
		}

		// TODO::migration search -> select

	}, {
		key: 'search',
		value: function search(settings) {
			console.warn('Collection::search, will be removed soon');
			return this.select(settings);
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

		// settings { size }

	}, {
		key: 'paginate',
		value: function paginate(settings) {
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

			child = this.makeChild(settings, function () {
				var span = settings.size,
				    length = parent.data.length,
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

				this.empty();

				for (var i = start; i < stop; i++) {
					this.add(this.parent.data[i]);
				}

				this.next();
			});

			child.nav = nav;

			return child;
		}
	}]);

	return Collection;
}(Feed);

module.exports = Collection;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(0);

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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(0);

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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bmoor = __webpack_require__(0),
    Eventing = bmoor.Eventing;

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

var Proxy = function (_Eventing) {
	_inherits(Proxy, _Eventing);

	function Proxy(obj) {
		_classCallCheck(this, Proxy);

		var _this = _possibleConstructorReturn(this, (Proxy.__proto__ || Object.getPrototypeOf(Proxy)).call(this));

		_this.getDatum = function () {
			return obj;
		};
		return _this;
	}

	// a 'deep copy' of the datum, but using mask() to have the original
	// as the object's prototype.


	_createClass(Proxy, [{
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
				this.trigger('update', delta);
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
		key: 'trigger',
		value: function trigger() {
			// always make the datum be the last argument passed
			arguments[arguments.length] = this.getDatum();
			arguments.length++;

			_get(Proxy.prototype.__proto__ || Object.getPrototypeOf(Proxy.prototype), 'trigger', this).apply(this, arguments);
		}
	}, {
		key: 'toJson',
		value: function toJson() {
			return JSON.stringify(this.getDatum());
		}
	}]);

	return Proxy;
}(Eventing);

Proxy.map = _map;
Proxy.isDirty = _isDirty;
Proxy.flatten = _flatten;
Proxy.getChanges = _getChanges;

module.exports = Proxy;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Memory = __webpack_require__(0).Memory,
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(12);

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	Feed: __webpack_require__(3),
	Pool: __webpack_require__(28),
	Collection: __webpack_require__(6),
	collection: {
		Proxied: __webpack_require__(43)
	},
	stream: {
		Converter: __webpack_require__(44)
	},
	object: {
		Proxy: __webpack_require__(9),
		Test: __webpack_require__(8),
		Hash: __webpack_require__(7)
	},
	structure: {
		Model: __webpack_require__(45).default,
		Schema: __webpack_require__(10).default
	}
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = __webpack_require__(1),
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
/* 14 */
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	soon: __webpack_require__(16),
	debounce: __webpack_require__(17),
	window: __webpack_require__(4)
};

/***/ }),
/* 16 */
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
/* 17 */
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Array helper functions
 * @module bmoor.array
 **/

var bmoor = __webpack_require__(1);

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
	watch: watch
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = __webpack_require__(1),
    mixin = __webpack_require__(20),
    plugin = __webpack_require__(21),
    decorate = __webpack_require__(22);

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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = __webpack_require__(1);

module.exports = function (to, from) {
	bmoor.iterate(from, function (val, key) {
		to[key] = val;
	});
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var bmoor = __webpack_require__(1);

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
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var bmoor = __webpack_require__(1);

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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Object helper functions
 * @module bmoor.object
 **/

var bmoor = __webpack_require__(1);

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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = __webpack_require__(1);

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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var window = __webpack_require__(4);

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
/* 26 */
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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Eventing = function () {
	function Eventing() {
		_classCallCheck(this, Eventing);

		this._listeners = {};
	}

	_createClass(Eventing, [{
		key: "on",
		value: function on(event, cb) {
			var listeners;

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
		key: "once",
		value: function once(event, cb) {
			var clear,
			    fn = function fn() {
				clear();
				cb.apply(this, arguments);
			};

			clear = this.on(event, fn);

			return clear;
		}
	}, {
		key: "subscribe",
		value: function subscribe(subscriptions) {
			var dis = this,
			    kills = [],
			    events = Object.keys(subscriptions);

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
		key: "trigger",
		value: function trigger(event) {
			var _this = this;

			var args = Array.prototype.slice.call(arguments, 1);

			if (this.hasWaiting(event)) {
				this._listeners[event].slice(0).forEach(function (cb) {
					cb.apply(_this, args);
				});
			}
		}
	}, {
		key: "hasWaiting",
		value: function hasWaiting(event) {
			return !!this._listeners[event];
		}
	}]);

	return Eventing;
}();

module.exports = Eventing;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bmoor = __webpack_require__(0),
    Eventing = bmoor.Eventing,
    getUid = bmoor.data.getUid,
    makeGetter = bmoor.makeGetter,
    Mapper = __webpack_require__(29).Mapper;

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
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	encode: __webpack_require__(30),
	Generator: __webpack_require__(33),
	Path: __webpack_require__(2),
	validate: __webpack_require__(35)
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    bmoorSchema: __webpack_require__(31).default,
    jsonSchema: __webpack_require__(32).default
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var bmoor = __webpack_require__(0),
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
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Tokenizer = __webpack_require__(5).default;

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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(0);
var Path = __webpack_require__(2).default;
var Writer = __webpack_require__(34).default;

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
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var makeSetter = __webpack_require__(0).makeSetter;

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
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Path = __webpack_require__(2).default;

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
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = __webpack_require__(0),
    setUid = bmoor.data.setUid;

module.exports = {
	fn: function route(dex, parent) {
		var old = null;
		var index = {};

		var _get = function _get(key) {
			var collection = index[key];

			if (!collection) {
				collection = parent.makeChild({}, function () {
					// I don't want the children to do anything
					// the parent will copy data down
				});
				index[key] = collection;
			}

			return collection;
		};

		function add(datum) {
			var d = dex.go(datum);

			old[setUid(datum)] = d;

			_get(d).add(datum);
		}

		function remove(datum) {
			var dex = setUid(datum);

			if (dex in old) {
				_get(old[dex]).remove(datum);
			}
		}

		function makeRouter() {
			old = {};

			for (var k in index) {
				index[k].empty();
			}

			for (var i = 0, c = parent.data.length; i < c; i++) {
				add(parent.data[i]);
			}
		}

		makeRouter();

		var _disconnect = parent.subscribe({
			next: makeRouter
		});

		return {
			get: function get(search) {
				return _get(dex.parse(search));
			},
			reroute: function reroute(datum) {
				remove(datum);
				add(datum);
			},
			keys: function keys() {
				return Object.keys(index);
			},
			disconnect: function disconnect() {
				_disconnect();
			}
		};
	}
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	fn: function indexer(dex, parent) {
		var index = null;

		function makeIndex() {
			index = {};

			if (parent.data) {
				for (var i = 0, c = parent.data.length; i < c; i++) {
					var datum = parent.data[i],
					    key = dex.go(datum);

					index[key] = datum;
				}
			}
		}

		makeIndex();

		var _disconnect = parent.subscribe({
			next: makeIndex
		});

		return {
			get: function get(search) {
				var key = dex.parse(search);
				return index[key];
			},
			keys: function keys() {
				return Object.keys(index);
			},
			disconnect: function disconnect() {
				_disconnect();
			}
		};
	}
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	fn: function fn(dex, parent, settings) {
		return parent.makeChild(settings, function () {
			var _this = this;

			this.empty(); // empty calls next

			if (settings.before) {
				settings.before();
			}

			parent.data.forEach(function (datum) {
				if (dex.go(datum)) {
					_this.add(datum);
				}
			});

			if (settings.after) {
				settings.after();
			}
		});
	}
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	fn: function fn(dex, parent, settings) {
		return parent.makeChild(settings, function () {
			this.empty();

			if (settings.before) {
				settings.before();
			}

			this.consume(parent.data);
			this.data.sort(dex.go);

			if (settings.after) {
				settings.after();
			}
		});
	}
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	fn: function fn(dex, parent, settings) {
		var child = parent.makeChild(settings);

		child.go = function () {
			var arr = parent.data;

			child.empty();

			if (settings.before) {
				settings.before();
			}

			for (var i = 0, c = arr.length; i < c; i++) {
				var datum = arr[i];

				child.add(dex.go(datum));
			}

			if (settings.after) {
				settings.after();
			}
		};

		child.go();

		return child;
	}
};

/***/ }),
/* 41 */
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
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	memorized: function memorized(parent, cache, expressor, generator, settings) {
		var rtn, index, oldDisconnect;

		if (!parent[cache]) {
			parent[cache] = {};
		}

		index = parent[cache];

		rtn = index[expressor.hash];

		if (!rtn) {
			if (!settings) {
				settings = {};
			}

			if (settings.disconnect) {
				oldDisconnect = settings.disconnect;
			}

			settings.disconnect = function () {
				if (oldDisconnect) {
					oldDisconnect();
				}

				index[expressor.hash] = null;
			};

			rtn = generator(expressor, parent, settings);

			index[expressor.hash] = rtn;
		}

		return rtn;
	}
};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataProxy = __webpack_require__(9),
    DataCollection = __webpack_require__(6);

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
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bmoor = __webpack_require__(0),
    Eventing = bmoor.Eventing;

function _datumStack(fn, old) {
	if (old) {
		return function (datum, orig) {
			return fn(old(datum, orig), orig);
		};
	} else {
		return function (orig) {
			return fn(orig, orig);
		};
	}
}

function datumStack(fns) {
	var i, c, fn;

	for (i = 0, c = fns.length; i < c; i++) {
		fn = _datumStack(fns[i], fn);
	}

	return fn;
}

function _arrStack(fn, old) {
	if (old) {
		return function (src) {
			return fn(old(src));
		};
	} else {
		return fn;
	}
}

function arrStack(fns) {
	var i, c, fn;

	for (i = 0, c = fns.length; i < c; i++) {
		fn = _arrStack(fns[i], fn);
	}

	return fn;
}

// array wrapper that allows for watching a feed 

var Converter = function (_Eventing) {
	_inherits(Converter, _Eventing);

	function Converter(arrFn, datumFn) {
		_classCallCheck(this, Converter);

		var _this = _possibleConstructorReturn(this, (Converter.__proto__ || Object.getPrototypeOf(Converter)).call(this));

		bmoor.data.setUid(_this);

		_this.data = [];

		_this.setArrayCriteria(arrFn);
		_this.setDatumCriteria(datumFn);
		return _this;
	}

	_createClass(Converter, [{
		key: 'setArrayCriteria',
		value: function setArrayCriteria(fns) {
			if (fns) {
				this.arrParse = arrStack(fns);
			} else {
				this.arrParse = null;
			}
		}
	}, {
		key: 'setDatumCriteria',
		value: function setDatumCriteria(fns) {
			if (fns) {
				this.datumParse = datumStack(fns);
			} else {
				this.datumParse = null;
			}
		}

		// I don't want to force it to be Feed, just needs .on and .data
		// technically converters can stack

	}, {
		key: 'setFeed',
		value: function setFeed(feed) {
			var dis = this;

			if (this.disconnect) {
				this.disconnect();
			}

			function readAll(changes) {
				var i, c, arr;

				if (changes && changes.length) {
					if (dis.arrParse) {
						arr = dis.arrParse(changes);
					} else {
						arr = changes.slice(0);
					}

					if (dis.datumParse) {
						for (i = 0, c = arr.length; i < c; i++) {
							arr[i] = dis.datumParse(arr[i]);
						}
					}

					dis.data = dis.data.concat(arr);
					dis.trigger('insert', arr);
				}
			}

			readAll(feed.data);
			this.disconnect = feed.on('insert', readAll);
		}
	}]);

	return Converter;
}(Eventing);

module.exports = Converter;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(0),
    schema = __webpack_require__(10),
    Join = __webpack_require__(46).Join;

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
/* 46 */
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