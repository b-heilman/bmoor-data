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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = Object.create(__webpack_require__(1));

bmoor.dom = __webpack_require__(10);
bmoor.data = __webpack_require__(11);
bmoor.flow = __webpack_require__(12);
bmoor.array = __webpack_require__(15);
bmoor.build = __webpack_require__(16);
bmoor.object = __webpack_require__(20);
bmoor.string = __webpack_require__(21);
bmoor.promise = __webpack_require__(22);

bmoor.Memory = __webpack_require__(23);
bmoor.Eventing = __webpack_require__(24);

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
    makeSetter = bmoor.makeSetter;

var Path = function () {
	// normal path: foo.bar
	// array path : foo[]bar
	function Path(path) {
		_classCallCheck(this, Path);

		var end,
		    dex = path.indexOf('['),
		    args;

		this.raw = path;

		if (dex === -1) {
			this.type = 'linear';
		} else {
			this.type = 'array';

			end = path.indexOf(']', dex);

			this.op = path.substring(dex + 1, end);
			args = this.op.indexOf(':');

			if (path.charAt(end + 1) === '.') {
				end++;
			}

			this.remainder = path.substr(end + 1);

			if (args === -1) {
				this.args = '';
			} else {
				this.args = this.op.substr(args + 1);
				this.op = this.op.substring(0, args);
			}

			path = path.substr(0, dex);
		}

		this.leading = path;

		if (path === '') {
			this.path = [];
		} else {
			this.path = path.split('.');
			this.set = makeSetter(this.path);
		}

		// if we want to, we can optimize path performance
		this.get = makeGetter(this.path);
	}

	_createClass(Path, [{
		key: 'flatten',
		value: function flatten(obj) {
			var t, rtn, next;

			if (this.remainder === undefined) {
				return [this.get(obj)];
			} else {
				t = this.get(obj);
				rtn = [];
				next = new Path(this.remainder);
				t.forEach(function (o) {
					rtn = rtn.concat(next.flatten(o));
				});

				return rtn;
			}
		}
	}, {
		key: 'exec',
		value: function exec(obj, fn) {
			this.flatten(obj).forEach(function (o) {
				fn(o);
			});
		}
	}]);

	return Path;
}();

module.exports = Path;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
		_classCallCheck(this, Feed);

		var _this = _possibleConstructorReturn(this, (Feed.__proto__ || Object.getPrototypeOf(Feed)).call(this));

		if (!src) {
			src = [];
		} else {
			src.push = src.unshift = _this.add.bind(_this);
		}

		setUid(_this);

		_this.data = src;
		return _this;
	}

	_createClass(Feed, [{
		key: 'add',
		value: function add(datum) {
			oldPush.call(this.data, datum);

			this.trigger('insert', datum);

			this.trigger('update');
		}
	}, {
		key: 'consume',
		value: function consume(arr) {
			var i, c;

			oldPush.apply(this.data, arr);

			if (this.hasWaiting('insert')) {
				for (i = 0, c = arr.length; i < c; i++) {
					this.trigger('insert', arr[i]);
				}
			}

			this.trigger('update');
		}
	}, {
		key: 'follow',
		value: function follow(parent, settings) {
			var _this2 = this;

			parent.subscribe(Object.assign({
				insert: function insert(datum) {
					_this2.add(datum);
				},
				remove: function remove(datum) {
					_this2.remove(datum);
				},
				process: function process() {
					_this2.go();
				},
				destroy: function destroy() {
					_this2.destroy();
				}
			}, settings));
		}
	}, {
		key: 'sort',
		value: function sort(fn) {
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

	return fn;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Path = __webpack_require__(2);

function all(next) {
	return function (toObj, fromObj) {
		var i, c, dex, t;

		for (i = 0, c = fromObj.length; i < c; i++) {
			t = {};
			dex = toObj.length;

			toObj.push(t);

			next(t, fromObj[i], toObj, dex);
		}
	};
}

var arrayMethods = {
	'': all,
	'*': all,
	'merge': function merge(next) {
		return function (toObj, fromObj, toRoot, toVar) {
			var i, c, dex, t;

			if (fromObj.length) {
				next(toObj, fromObj[0], toRoot, toVar);

				for (i = 1, c = fromObj.length; i < c; i++) {
					t = {};
					dex = toRoot.length;

					toRoot.push(t);

					next(t, fromObj[i], toRoot, dex);
				}
			}
		};
	},
	'first': function first(next) {
		return function (toObj, fromObj, toRoot, toVar) {
			var t = {};

			toRoot[toVar] = t;

			next(t, fromObj[0], toRoot, toVar);
		};
	},
	'last': function last(next) {
		return function (toObj, fromObj, toRoot, toVar) {
			var t = {};

			toRoot[toVar] = t;

			next(t, fromObj[fromObj.length - 1], toRoot, toVar);
		};
	},
	'pick': function pick(next, args) {
		return function (toObj, fromObj, toRoot, toVar) {
			var t = {},
			    dex = parseInt(args, 10);

			toRoot[toVar] = t;

			next(t, fromObj[dex], toRoot, toVar);
		};
	}
};

function buildArrayMap(to, from, next) {
	var fn = arrayMethods[to.op](next, to.args);

	if (to.path.length) {
		return function (toObj, fromObj) {
			var t = [],
			    parent = to.set(toObj, t);

			fn(t, from.get(fromObj), parent, to.path[to.path.length - 1]);
		};
	} else {
		return function (toObj, fromObj, toRoot, toVar) {
			var t = [],
			    myRoot;

			if (toRoot) {
				t = [];
				toRoot[toVar] = t;
				myRoot = toRoot;
			} else {
				// this must be when an array leads
				myRoot = t = toObj;
			}

			fn(t, from.get(fromObj), myRoot, toVar);
		};
	}
}

function stackChildren(old, fn) {
	if (old) {
		return function (toObj, fromObj, toRoot, toVar) {
			fn(toObj, fromObj, toRoot, toVar);
			old(toObj, fromObj, toRoot, toVar);
		};
	} else {
		return fn;
	}
}

var Mapping = function () {
	function Mapping(toPath, fromPath) {
		var _this = this;

		_classCallCheck(this, Mapping);

		var to = toPath instanceof Path ? toPath : new Path(toPath),
		    from = fromPath instanceof Path ? fromPath : new Path(fromPath);

		this.chidren = {};

		if (to.type === 'linear' && from.type === to.type) {
			if (to.path.length) {
				this.go = function (toObj, fromObj) {
					to.set(toObj, from.get(fromObj));
				};
			} else if (from.path.length) {
				this.go = function (ignore, fromObj, toRoot, i) {
					toRoot[i] = from.get(fromObj);
				};
			} else {
				this.go = function (ignore, value, toRoot, i) {
					toRoot[i] = value;
				};
			}
		} else if (to.type === 'array' && from.type === to.type) {
			this.addChild(to.remainder, from.remainder);
			this.go = buildArrayMap(to, from, function (toObj, fromObj, toRoot, toVar) {
				_this.callChildren(toObj, fromObj, toRoot, toVar);
			});
		} else {
			throw new Error('both paths needs same amount of array hooks');
		}
	}

	_createClass(Mapping, [{
		key: 'addChild',
		value: function addChild(toPath, fromPath) {
			var child,
			    to = new Path(toPath),
			    from = new Path(fromPath),
			    dex = to.leading + '-' + from.leading;

			child = this.chidren[dex];

			if (child) {
				child.addChild(to.remainder, from.remainder);
			} else {
				child = new Mapping(to, from);
				this.callChildren = stackChildren(this.callChildren, child.go);
			}
		}
	}]);

	return Mapping;
}();

module.exports = Mapping;

/***/ }),
/* 6 */
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
	this.go = function (search) {
		if (!bmoor.isObject(search)) {
			return search;
		} else {
			if (settings.massage) {
				search = settings.massage(search);
			}

			return fn(search);
		}
	};
};

module.exports = Hash;

/***/ }),
/* 7 */
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
	this.go = function (search) {
		if (settings.massage) {
			search = settings.massage(search);
		}

		return fn(search);
	};
};

module.exports = Test;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoorData = __webpack_require__(9);
function run(count) {
	var i, c, t, arr;

	console.time('collection-init:' + count);
	arr = [];
	for (i = 0, c = count; i < c; i++) {
		arr.push({ id: i, type: i % 10, junk: 'woot', foo: 'bar' });
	}

	t = new bmoorData.Collection(arr);
	console.timeEnd('collection-init:' + count);
	console.log(t.data.length === count ? 'valid' : 'failed: ' + t.data.length);

	//--------

	console.time('collection-consume:' + count);
	arr = [];
	for (i = 0, c = count; i < c; i++) {
		arr.push({ id: i, type: i % 10, junk: 'woot', foo: 'bar' });
	}

	t = new bmoorData.Collection();
	t.consume(arr);
	console.timeEnd('collection-consume:' + count);
	console.log(t.data.length === count ? 'valid' : 'failed: ' + t.data.length);

	//--------

	console.time('collection-add:' + count);
	arr = [];
	t = new bmoorData.Collection();
	for (i = 0, c = count; i < c; i++) {
		t.add({ id: i, type: i % 10, junk: 'woot', foo: 'bar' });
	}
	console.timeEnd('collection-add:' + count);
	console.log(t.data.length === count ? 'valid' : 'failed: ' + t.data.length);

	//--------

	console.time('collection-push:' + count);
	arr = [];
	t = new bmoorData.Collection(arr);
	for (i = 0, c = count; i < c; i++) {
		arr.push({ id: i, type: i % 10, junk: 'woot', foo: 'bar' });
	}
	console.timeEnd('collection-push:' + count);
	console.log(t.data.length === count ? 'valid' : 'failed: ' + t.data.length);

	//--------

	console.time('collection-filter:' + count);
	arr = t.filter(function (d) {
		return d.id % 2;
	});
	console.timeEnd('collection-filter:' + count);
	console.log(arr.data.length * 2 === count ? 'valid' : 'failed: ' + arr.data.length);

	//--------

	console.time('collection-index:' + count);
	arr = t.index(function (d) {
		return d.id;
	});

	console.timeEnd('collection-index:' + count);
	console.log(arr.keys().length === count ? 'valid' : 'failed: ' + arr.keys().length);

	//--------

	console.time('collection-route:' + count);
	arr = t.route(function (d) {
		return d.type;
	});
	console.timeEnd('collection-route:' + count);
	console.log(arr.get(0).data.length * 10 === count ? 'valid' : 'failed: ' + arr.get(0).data.length);
}

window.stressTest = function () {
	console.log('===== 1000 =====');
	run(1000);

	console.log('===== 10000 =====');
	run(10000);

	console.log('===== 100000 =====');
	run(100000);
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	Feed: __webpack_require__(3),
	Pool: __webpack_require__(25),
	Collection: __webpack_require__(31),
	stream: {
		Converter: __webpack_require__(32)
	},
	object: {
		Proxy: __webpack_require__(33),
		Test: __webpack_require__(7),
		Hash: __webpack_require__(6)
	}
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = __webpack_require__(1),
    regex = {};

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

function triggerEvent(elements, eventName, eventData) {
	var i, c, doc, node, event, EventClass;

	elements = massage(elements);

	for (i = 0, c = elements.length; i < c; i++) {
		node = elements[i];

		// Make sure we use the ownerDocument from the provided node to avoid cross-window problems
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

		if (node.dispatchEvent) {
			try {
				// modern, except for IE still? https://developer.mozilla.org/en-US/docs/Web/API/Event
				// I ain't doing them all
				// slightly older style, give some backwards compatibility
				switch (eventName) {
					case 'click':
					case 'mousedown':
					case 'mouseup':
						EventClass = MouseEvent;
						break;

					case 'focus':
					case 'blur':
						EventClass = FocusEvent; // jshint ignore:line
						break;

					case 'change':
					case 'select':
						EventClass = UIEvent; // jshint ignore:line
						break;

					default:
						EventClass = CustomEvent;
				}

				if (!eventData) {
					eventData = { 'view': window, 'bubbles': true, 'cancelable': true };
				} else {
					if (eventData.bubbles === undefined) {
						eventData.bubbles = true;
					}
					if (eventData.cancelable === undefined) {
						eventData.cancelable = true;
					}
				}

				event = new EventClass(eventName, eventData);
			} catch (ex) {
				// slightly older style, give some backwards compatibility
				switch (eventName) {
					case 'click':
					case 'mousedown':
					case 'mouseup':
						EventClass = 'MouseEvents';
						break;

					case 'focus':
					case 'change':
					case 'blur':
					case 'select':
						EventClass = 'HTMLEvents';
						break;

					default:
						EventClass = 'CustomEvent';
				}
				event = doc.createEvent(EventClass);
				event.initEvent(eventName, true, true);
			}

			event.$synthetic = true; // allow detection of synthetic events

			node.dispatchEvent(event);
		} else if (node.fireEvent) {
			// IE-old school style
			event = doc.createEventObject();
			event.$synthetic = true; // allow detection of synthetic events
			node.fireEvent('on' + eventName, event);
		}
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

module.exports = {
	getScrollPosition: getScrollPosition,
	getBoundryBox: getBoundryBox,
	getDomElement: getDomElement,
	getDomCollection: getDomCollection,
	showOn: showOn,
	centerOn: centerOn,
	addClass: addClass,
	removeClass: removeClass,
	triggerEvent: triggerEvent,
	bringForward: bringForward
};

/***/ }),
/* 11 */
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	soon: __webpack_require__(13),
	debounce: __webpack_require__(14),
	window: __webpack_require__(4)
};

/***/ }),
/* 13 */
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

	return fn;
};

/***/ }),
/* 14 */
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

	return fn;
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Array helper functions
 * @module bmoor.array
 **/

var bmoor = __webpack_require__(1);

/**
 * Search an array for an element, starting at the begining or a specified location
 *
 * @function indexOf
 * @param {array} arr An array to be searched
 * @param {*} searchElement Content for which to be searched
 * @param {integer} fromIndex The begining index from which to begin the search, defaults to 0
 * @return {integer} -1 if not found, otherwise the location of the element
 **/
function indexOf(arr, searchElement, fromIndex) {
	if (arr.indexOf) {
		return arr.indexOf(searchElement, fromIndex);
	} else {
		var length = parseInt(arr.length, 0);

		fromIndex = +fromIndex || 0;

		if (Math.abs(fromIndex) === Infinity) {
			fromIndex = 0;
		}

		if (fromIndex < 0) {
			fromIndex += length;
			if (fromIndex < 0) {
				fromIndex = 0;
			}
		}

		for (; fromIndex < length; fromIndex++) {
			if (arr[fromIndex] === searchElement) {
				return fromIndex;
			}
		}

		return -1;
	}
}

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
	var pos = indexOf(arr, searchElement, fromIndex);

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
	    pos = indexOf(arr, searchElement, fromIndex);

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
 * Generate a new array whose content is a subset of the intial array, but satisfies the supplied function
 *
 * @function remove
 * @param {array} arr An array to be searched
 * @param {*} searchElement Content for which to be searched
 * @param {integer} fromIndex The begining index from which to begin the search, defaults to 0
 * @return {integer} number of elements removed
 **/
function filter(arr, func, thisArg) {
	if (arr.filter) {
		return arr.filter(func, thisArg);
	} else {
		var i,
		    val,
		    t = Object(this),
		    // jshint ignore:line
		c = parseInt(t.length, 10),
		    res = [];

		if (!bmoor.isFunction(func)) {
			throw new Error('func needs to be a function');
		}

		for (i = 0; i < c; i++) {
			if (i in t) {
				val = t[i];

				if (func.call(thisArg, val, i, t)) {
					res.push(val);
				}
			}
		}

		return res;
	}
}

/**
 * Compare two arrays, 
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

module.exports = {
	indexOf: indexOf,
	remove: remove,
	removeAll: removeAll,
	bisect: bisect,
	filter: filter,
	compare: compare
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = __webpack_require__(1),
    mixin = __webpack_require__(17),
    plugin = __webpack_require__(18),
    decorate = __webpack_require__(19);

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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = __webpack_require__(1);

module.exports = function (to, from) {
	bmoor.iterate(from, function (val, key) {
		to[key] = val;
	});
};

/***/ }),
/* 18 */
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
/* 19 */
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
/* 20 */
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

		if (to === from || !from) {
			continue;
		} else if (to && to.merge) {
			to.merge(from);
		} else if (!bmoor.isObject(to)) {
			if (bmoor.isObject(from)) {
				to = merge({}, from);
			} else {
				to = from;
			}
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
/* 21 */
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
/* 22 */
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

module.exports = {
	always: always,
	stack: stack
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var master = {};

var Memory = function () {
	function Memory() {
		_classCallCheck(this, Memory);

		var index = {};

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
/* 24 */
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
/* 25 */
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
    Mapper = __webpack_require__(26).Mapper;

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
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	encode: __webpack_require__(27),
	Mapper: __webpack_require__(28),
	Mapping: __webpack_require__(5),
	Path: __webpack_require__(2),
	translate: __webpack_require__(29),
	validate: __webpack_require__(30)
};

/***/ }),
/* 27 */
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

	ops[method](def, path, val);
}

ops = {
	array: function array(def, path, val) {
		var next = val[0];

		parse(def, path + '[]', next);
	},
	object: function object(def, path, val) {
		if (path.length) {
			path += '.';
		}

		Object.keys(val).forEach(function (key) {
			parse(def, path + key, val[key]);
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

function encode(json) {
	var t = [];

	if (json) {
		parse(t, '', json);

		return t;
	} else {
		return json;
	}
}

encode.$ops = ops;

module.exports = encode;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Path = __webpack_require__(2),
    bmoor = __webpack_require__(0),
    Mapping = __webpack_require__(5);

function stack(fn, old) {
	if (old) {
		return function (to, from) {
			old(to, from);
			fn(to, from);
		};
	} else {
		return fn;
	}
}

// TODO : merging arrays

// converts one object structure to another

var Mapper = function () {
	function Mapper(settings) {
		var _this = this;

		_classCallCheck(this, Mapper);

		this.mappings = {};

		// this.run is defined via recursive stacks
		if (settings) {
			Object.keys(settings).forEach(function (to) {
				var from = settings[to];

				if (bmoor.isObject(from)) {
					// so it's an object, parent is an array
					if (from.to) {
						to = from.to;
					}

					if (from.from) {
						from = from.from;
					} else {
						throw new Error('I can not find a from clause');
					}
				}

				_this.addMapping(to, from);
			});
		}
	}

	_createClass(Mapper, [{
		key: 'addMapping',
		value: function addMapping(toPath, fromPath) {
			var to = new Path(toPath),
			    from = new Path(fromPath),
			    dex = to.leading + '-' + from.leading,
			    mapping = this.mappings[dex];

			if (mapping) {
				mapping.addChild(to.remainder, from.remainder);
			} else {
				mapping = new Mapping(to, from);
				this.mappings[dex] = mapping;

				this.go = stack(mapping.go, this.go);
			}
		}
	}]);

	return Mapper;
}();

module.exports = Mapper;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function go(from, root, info) {
	var cur = from.shift();

	if (cur[cur.length - 1] === ']') {
		cur = cur.substr(0, cur.length - 2);

		if (cur === '') {
			// don't think anything...
		} else {
			if (!root[cur]) {
				root[cur] = {
					type: 'array'
				};
			}
			root = root[cur];
		}
		cur = 'items';
	}

	if (from.length) {
		if (!root[cur]) {
			root[cur] = {
				type: 'object',
				properties: {}
			};
		}
		go(from, root[cur].properties, info);
	} else {
		root[cur] = info;
	}
}

function split(str) {
	return str.replace(/]([^\.$])/g, '].$1').split('.');
}

function encode(schema) {
	var i,
	    c,
	    d,
	    t,
	    rtn,
	    root,
	    path = schema[0].to || schema[0].path;

	if (split(path)[0] === '[]') {
		rtn = { type: 'array' };
		root = rtn;
	} else {
		rtn = { type: 'object', properties: {} };
		root = rtn.properties;
	}

	for (i = 0, c = schema.length; i < c; i++) {
		d = schema[i];

		path = d.to || d.path;

		t = { type: d.type };

		if (d.from) {
			t.alias = d.from;
		}

		go(split(path), root, t);
	}

	return rtn;
}

module.exports = encode;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Path = __webpack_require__(2);

var tests = [function (def, v, errors) {
	if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) !== def.type) {
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
		new Path(def.path).exec(obj, function (v) {
			tests.forEach(function (fn) {
				fn(def, v, errors);
			});
		});
	});

	if (errors.length) {
		return errors;
	} else {
		return null;
	}
}

validate.$ops = tests;

module.exports = validate;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bmoor = __webpack_require__(0),
    Feed = __webpack_require__(3),
    Hash = __webpack_require__(6),
    Test = __webpack_require__(7),
    setUid = bmoor.data.setUid;

function testStack(old, fn) {
	if (old) {
		return function (massaged, ctx) {
			if (fn(massaged, ctx)) {
				return true;
			} else {
				return old(massaged, ctx);
			}
		};
	} else {
		return fn;
	}
}

function memorized(parent, cache, expressor, generator, settings) {
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

function _route(dex, parent) {
	var old = {},
	    index = {},
	    _get = function _get(key) {
		var collection = index[key];

		if (!collection) {
			collection = parent.getChild(false);
			index[key] = collection;
		}

		return collection;
	};

	function add(datum) {
		var d = dex.go(datum);

		old[setUid(datum)] = d;

		_get(d).add(datum);
	}

	function _remove(datum) {
		var dex = setUid(datum);

		if (dex in old) {
			_get(old[dex]).remove(datum);
		}
	}

	for (var i = 0, c = parent.data.length; i < c; i++) {
		add(parent.data[i]);
	}

	var _disconnect = parent.subscribe({
		insert: function insert(datum) {
			add(datum);
		},
		remove: function remove(datum) {
			_remove(datum);
		}
	});

	return {
		get: function get(search) {
			return _get(dex.go(search));
		},
		reroute: function reroute(datum) {
			_remove(datum);
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

function _index(dex, parent) {
	var index = {};

	for (var i = 0, c = parent.data.length; i < c; i++) {
		var datum = parent.data[i],
		    key = dex.go(datum);

		index[key] = datum;
	}

	var _disconnect2 = parent.subscribe({
		insert: function insert(datum) {
			var key = dex.go(datum);
			index[key] = datum;
		},
		remove: function remove(datum) {
			var key = dex.go(datum);
			delete index[key];
		}
	});

	return {
		get: function get(search) {
			var key = dex.go(search);
			return index[key];
		},
		keys: function keys() {
			return Object.keys(index);
		},
		disconnect: function disconnect() {
			_disconnect2();
		}
	};
}

function _filter(dex, parent, settings) {
	var child;

	settings = Object.assign({}, {
		insert: function insert(datum) {
			if (dex.go(datum)) {
				child.add(datum);
			}
		}
	}, settings);

	child = parent.getChild(settings);

	child.go = bmoor.flow.window(function () {
		var datum,
		    insert,
		    arr = parent.data;

		child.empty();

		if (settings.before) {
			settings.before();
		}

		if (child.hasWaiting('insert')) {
			// performance optimization
			insert = function insert(datum) {
				Array.prototype.push.call(child.data, datum);
				child.trigger('insert', datum);
			};
		} else {
			insert = function insert(datum) {
				Array.prototype.push.call(child.data, datum);
			};
		}

		for (var i = 0, c = arr.length; i < c; i++) {
			datum = arr[i];
			if (dex.go(datum)) {
				insert(datum);
			}
		}

		if (settings.after) {
			settings.after();
		}

		child.trigger('process');
	}, settings.min || 5, settings.max || 30);

	child.go.flush();

	return child;
}

var Collection = function (_Feed) {
	_inherits(Collection, _Feed);

	function Collection() {
		_classCallCheck(this, Collection);

		return _possibleConstructorReturn(this, (Collection.__proto__ || Object.getPrototypeOf(Collection)).apply(this, arguments));
	}

	_createClass(Collection, [{
		key: 'remove',


		// remove a datum from the collection
		value: function remove(datum) {
			var dex = this.data.indexOf(datum);

			if (dex !== -1) {
				this.data.splice(dex, 1);

				this.trigger('remove', datum);

				this.trigger('update');
			}
		}

		// remove all datums from the collection

	}, {
		key: 'empty',
		value: function empty() {
			var arr = this.data;

			if (this.hasWaiting('remove')) {
				for (var i = 0, c = arr.length; i < c; i++) {
					this.trigger('remove', arr[i]);
				}
			}

			this.trigger('update');

			arr.length = 0;
		}

		// follow a parent collection

	}, {
		key: 'follow',
		value: function follow(parent, settings) {
			var _this2 = this;

			var disconnect = parent.subscribe(Object.assign({
				insert: function insert(datum) {
					_this2.add(datum);
				},
				remove: function remove(datum) {
					_this2.remove(datum);
				},
				process: function process() {
					_this2.go();
				},
				destroy: function destroy() {
					_this2.destroy();
				}
			}, settings));

			if (this.disconnect) {
				var old = this.disconnect;
				this.disconnect = function () {
					old();
					disconnect();
				};
			} else {
				this.disconnect = disconnect;
			}

			// if you just want to disconnect form this one
			// you can later be specific
			return disconnect;
		}
	}, {
		key: 'getChild',
		value: function getChild(settings) {
			var child = new this.constructor(null, settings);

			child.parent = this;

			if (settings !== false) {
				child.follow(this, settings);
				var done = child.disconnect;

				child.disconnect = function () {
					if (settings.disconnect) {
						settings.disconnect();
					}

					done();
				};

				child.destroy = function () {
					child.disconnect();

					child.trigger('destroy');
				};
			}

			return child;
		}
	}, {
		key: 'index',
		value: function index(search, settings) {
			return memorized(this, 'indexes', search instanceof Hash ? search : new Hash(search, settings), _index);
		}
	}, {
		key: 'get',
		value: function get(search, settings) {
			this.index(search, settings).get(search);
		}
	}, {
		key: 'route',
		value: function route(search, settings) {
			return memorized(this, 'routes', search instanceof Hash ? search : new Hash(search, settings), _route);
		}
	}, {
		key: 'filter',
		value: function filter(search, settings) {
			return memorized(this, 'filters', search instanceof Test ? search : new Test(search, settings), _filter, settings);
		}
	}, {
		key: 'sorted',
		value: function sorted(sorter, settings) {
			// TODO : create the Compare class, then memorize this
			var child,
			    parent = this;

			settings = Object.assign({}, {
				insert: function insert(datum) {
					child.add(datum);
					child.go();
				},
				update: function update() {
					child.go();
				}
			}, settings);

			child = parent.getChild(settings);

			child.go = bmoor.flow.window(function () {
				child.data.sort(sorter);

				child.trigger('process');
			}, settings.min || 5, settings.max || 30);

			child.go.flush();

			return child;
		}
	}, {
		key: 'search',
		value: function search(settings) {
			var ctx, test;

			for (var i = settings.tests.length - 1; i !== -1; i--) {
				test = testStack(test, settings.tests[i]);
			}

			return this.filter(function (datum) {
				if (!datum.$massaged) {
					datum.$massaged = settings.massage(datum);
				}

				return test(datum.$massaged, ctx);
			}, {
				before: function before() {
					ctx = settings.normalize();
				},
				hash: 'search:' + Date.now()
			});
		}

		// settings { size }

	}, {
		key: 'paginate',
		value: function paginate(settings) {
			var child,
			    parent = this;

			settings = Object.assign({}, {
				insert: function insert(datum) {
					child.add(datum);

					child.go();
				},
				remove: function remove(datum) {
					child.remove(datum);

					child.go();
				},
				process: function process() {
					child.go();
				}
			}, settings);

			child = this.getChild(settings);

			var origSize = settings.size;

			child.go = bmoor.flow.window(function () {
				var span = settings.size,
				    length = parent.data.length,
				    steps = Math.ceil(length / span);

				this.nav.span = span;
				this.nav.steps = steps;
				this.nav.count = length;

				var start = this.nav.pos * span,
				    stop = start + span;

				this.nav.start = start;
				if (stop > length) {
					stop = length;
				}
				this.nav.stop = stop;

				this.empty();

				for (var i = start; i < stop; i++) {
					this.add(this.parent.data[i]);
				}

				child.trigger('process');
			}, settings.min || 5, settings.max || 30, { context: child });

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

					if (pos !== this.pos) {
						this.pos = pos;
						child.go();
					}
				},
				hasNext: function hasNext() {
					return this.stop < this.count;
				},
				next: function next() {
					this.pos++;
					child.go();
				},
				hasPrev: function hasPrev() {
					return !!this.start;
				},
				prev: function prev() {
					this.pos--;
					child.go();
				},
				setSize: function setSize(size) {
					settings.size = size;
				},
				maxSize: function maxSize() {
					this.setSize(child.parent.data.length);
				},
				resetSize: function resetSize() {
					this.setSize(origSize);
				}
			};

			child.nav = nav;
			child.go.flush();

			return child;
		}
	}]);

	return Collection;
}(Feed);

module.exports = Collection;

/***/ }),
/* 32 */
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
/* 33 */
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
	var mask = bmoor.isArray(target) ? target.slice(0) : Object.create(target);

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

			if ((!(k in mask) || !bothObj) && o !== m) {
				mask[k] = o;
			}
		});
	}

	return mask;
}

function _isDirty(obj) {
	var i,
	    c,
	    t,
	    keys = Object.keys(obj);

	for (i = 0, c = keys.length; i < c; i++) {
		t = obj[keys[i]];

		if (!bmoor.isObject(t) || _isDirty(t)) {
			return true;
		}
	}

	return false;
}

function _getChanges(obj) {
	var rtn = {},
	    valid = false;

	Object.keys(obj).forEach(function (k) {
		var d = obj[k];

		if (bmoor.isObject(d)) {
			d = _getChanges(d);
			if (d) {
				valid = true;
				rtn[k] = d;
			}
		} else {
			valid = true;
			rtn[k] = d;
		}
	});

	if (valid) {
		return rtn;
	}
}

function _map(delta, obj) {
	Object.keys(delta).forEach(function (k) {
		var d = delta[k],
		    o = obj[k];

		if (d !== o) {
			if (bmoor.isObject(d) && bmoor.isObject(o)) {
				_map(d, o);
			} else {
				obj[k] = d;
			}
		}
	});
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

	_createClass(Proxy, [{
		key: 'getMask',
		value: function getMask(override) {
			if (!this.mask || override) {
				this.mask = makeMask(this.getDatum(), override);
			}

			return this.mask;
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

			_map(delta, mask);

			return mask;
		}
	}, {
		key: 'merge',
		value: function merge(delta) {
			if (!delta) {
				delta = this.mask;
			}

			bmoor.object.merge(this.getDatum(), delta);

			this.mask = null;
			this.trigger('update', delta);
		}
	}, {
		key: 'trigger',
		value: function trigger() {
			// always make the datum be the last argument passed
			arguments[arguments.length] = this.getDatum();
			arguments.length++;

			_get(Proxy.prototype.__proto__ || Object.getPrototypeOf(Proxy.prototype), 'trigger', this).apply(this, arguments);
		}
	}]);

	return Proxy;
}(Eventing);

Proxy.isDirty = _isDirty;
Proxy.getChanges = _getChanges;

module.exports = Proxy;

/***/ })
/******/ ]);