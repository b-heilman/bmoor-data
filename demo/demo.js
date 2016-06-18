var bmoorData =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var bmoor = __webpack_require__(1);

	module.exports = bmoor;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
		Collection: __webpack_require__(2),
		Hasher: __webpack_require__(19),
		HashedCollection: __webpack_require__(20),
		Index: __webpack_require__(21),
		GridIndex: __webpack_require__(22),
		Bucketer: __webpack_require__(23),
		Composite: __webpack_require__(18),
		Observor: __webpack_require__(17),
		Table: __webpack_require__(24)
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var proto = Array.prototype,
	    bmoor = __webpack_require__(3),
	    getUid = bmoor.data.getUid,
	    Observor = __webpack_require__(17);

	function manageFilter(collection, datum, filter) {
		var isIn = filter(datum);

		collection._addRegistration(datum, datum.$observe.on('update', function CollectionDatumWatch() {
			var nowIs = filter(datum);

			if (isIn !== nowIs) {
				if (nowIs) {
					collection.insert(datum);
				} else {
					collection.remove(datum);
				}

				isIn = nowIs;
			}
		}));

		return isIn;
	}

	var Collection = function (_bmoor$build) {
		_inherits(Collection, _bmoor$build);

		function Collection() {
			_classCallCheck(this, Collection);

			var i, c;

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Collection).call(this));

			bmoor.data.setUid(_this);

			_this._contains = {};
			_this._following = {};
			_this._registrations = {};

			for (i = 0, c = arguments.length; i < c; i++) {
				_this.consume(arguments[i]);
			}
			return _this;
		}

		// private functions


		_createClass(Collection, [{
			key: '_canInsert',
			value: function _canInsert(obj) {
				var id = getUid(obj);

				return !this._contains[id] && (!this._$filter || this._$filter(obj));
			}
		}, {
			key: '_onInsert',
			value: function _onInsert(datum) {
				var id = getUid(datum);

				this.trigger('insert', datum);

				if (this._$filter) {
					manageFilter(this, datum, this._$filter);
				}

				this._contains[id] = 1;
			}
		}, {
			key: '_canRemove',
			value: function _canRemove(obj) {
				var id = getUid(obj),
				    c = --this._contains[id];

				return !c;
			}
		}, {
			key: '_onRemove',
			value: function _onRemove(obj) {
				var uid = getUid(obj),
				    fn = this._registrations[uid];

				this.trigger('remove', obj);

				if (fn) {
					fn();
					this._registrations[uid] = null;
				}
			}
		}, {
			key: '_addRegistration',
			value: function _addRegistration(datum, unreg) {
				var uid = getUid(datum),
				    old = this._registrations[uid];

				if (old) {
					this._registrations[uid] = function () {
						unreg();
						old();
					};
				} else {
					this._registrations[uid] = unreg;
				}
			}

			// General access

		}, {
			key: 'get',
			value: function get(pos) {
				return this[pos];
			}
		}, {
			key: 'insert',
			value: function insert(datum, front) {
				Observor.enforce(datum);

				if (this._canInsert(datum)) {
					if (front) {
						proto.unshift.call(this, datum);
					} else {
						proto.push.call(this, datum);
					}

					this._onInsert(datum);

					return true;
				}

				return false;
			}
		}, {
			key: 'setFilter',
			value: function setFilter(fn) {
				var i, datum;

				this._$filter = fn.bind(this);

				for (i = 0; i < this.length; i++) {
					datum = this[i];

					if (!manageFilter(datum, fn.bind(this))) {
						this.splice(i, 1);
						i--;
					}
				}
			}
		}, {
			key: 'remove',
			value: function remove(obj) {
				var t;

				if (this._canRemove(obj)) {
					t = bmoor.array.remove(this, obj);

					this._onRemove(t);

					return true;
				}

				return false;
			}
		}, {
			key: 'consume',
			value: function consume(obj) {
				var i, c;

				if (obj instanceof Collection) {
					this.follow(obj);
				} else if (bmoor.isArray(obj)) {
					for (i = 0, c = obj.length; i < c; i++) {
						this.insert(obj[i]);
					}
				} else {
					this.insert(obj);
				}
			}

			// TODO : other casters like toString, etc

		}, {
			key: 'toArray',
			value: function toArray() {
				return this.slice(0);
			}

			// inheritance methods

		}, {
			key: 'follow',
			value: function follow(collection) {
				var uid = bmoor.data.getUid(collection);

				if (!this._following[uid]) {
					this._following[uid] = collection.lead(this);
				}
			}
		}, {
			key: 'lead',
			value: function lead(collection) {
				var i, c;

				for (i = 0, c = this.length; i < c; i++) {
					collection.insert(this[i]);
				}

				return this.subscribe({
					'insert': collection.insert.bind(collection),
					'remove': collection.remove.bind(collection)
				});
			}
		}, {
			key: 'unfollow',
			value: function unfollow(collection) {
				var i,
				    c,
				    id = bmoor.data.getUid(collection);

				if (this._following[id]) {
					for (i = 0, c = collection.length; i < c; i++) {
						this.remove(collection[i]);
					}

					this._following[id]();
					this._following[id] = null;
				}
			}

			// override base array functionality

		}, {
			key: 'push',
			value: function push(obj) {
				this.insert(obj, false);
			}
		}, {
			key: 'unshift',
			value: function unshift(obj) {
				this.insert(obj, true);
			}
		}, {
			key: 'pop',
			value: function pop() {
				var obj = this[this.length - 1];
				if (this._canRemove(obj)) {
					proto.pop.call(this);
					this._onRemove(obj);
				}
			}
		}, {
			key: 'shift',
			value: function shift() {
				var obj = this[0];
				if (this._canRemove(obj)) {
					proto.shift.call(this);
					this._onRemove(obj);
				}
			}

			// extended base array functionality

		}, {
			key: '$filter',
			value: function $filter(fn) {
				var child = new Collection();
				child.setFilter(fn);

				this.lead(child);

				return child;
			}
		}, {
			key: '$concat',
			value: function $concat() {
				var i,
				    c,
				    child = new Collection();

				this.lead(child);
				for (i = 0, c = arguments; i < c; i++) {
					child.consume(arguments[i]);
				}

				return child;
			}
		}]);

		return Collection;
	}(bmoor.build(Array, { mixin: bmoor.interfaces.Eventing }));

	module.exports = Collection;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var bmoor = Object.create(__webpack_require__(4));

	bmoor.dom = __webpack_require__(5);
	bmoor.data = __webpack_require__(6);
	bmoor.array = __webpack_require__(7);
	bmoor.object = __webpack_require__(8);
	bmoor.build = __webpack_require__(9);
	bmoor.string = __webpack_require__(13);
	bmoor.promise = __webpack_require__(14);

	bmoor.interfaces = __webpack_require__(15);

	module.exports = bmoor;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * Library Functions
	 **/
	/**
	 * Tests if the value is undefined
	 *
	 * @function isUndefined
	 * @namespace bMoor
	 * @param {something} value The variable to test
	 * @return {boolean}
	 **/
	function isUndefined(value) {
		return value === undefined;
	}

	/**
	 * Tests if the value is not undefined
	 *
	 * @function isDefined
	 * @namespace bMoor
	 * @param {something} value The variable to test
	 * @return {boolean}
	 **/
	function isDefined(value) {
		return value !== undefined;
	}

	/**
	 * Tests if the value is a string
	 *
	 * @function isString
	 * @namespace bMoor
	 * @param {something} value The variable to test
	 * @return {boolean}
	 **/
	function isString(value) {
		return typeof value === 'string';
	}

	/**
	 * Tests if the value is numeric
	 *
	 * @function isNumber
	 * @namespace bMoor
	 * @param {something} value The variable to test
	 * @return {boolean}
	 **/
	function isNumber(value) {
		return typeof value === 'number';
	}

	/**
	 * Tests if the value is a function
	 *
	 * @function isFuncion
	 * @namespace bMoor
	 * @param {something} value The variable to test
	 * @return {boolean}
	 **/
	function isFunction(value) {
		return typeof value === 'function';
	}

	/**
	 * Tests if the value is an object
	 *
	 * @function isObject
	 * @namespace bMoor
	 * @param {something} value The variable to test
	 * @return {boolean}
	 **/
	function isObject(value) {
		return value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
	}

	/**
	 * Tests if the value is a boolean
	 *
	 * @function isBoolean
	 * @namespace bMoor
	 * @param {something} value The variable to test
	 * @return {boolean}
	 **/
	function isBoolean(value) {
		return typeof value === 'boolean';
	}

	/**
	 * Tests if the value can be used as an array
	 *
	 * @function isArrayLike
	 * @namespace bMoor
	 * @param {something} value The variable to test
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
	 * @namespace bMoor
	 * @param {something} value The variable to test
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
	 * @namespace bMoor
	 * @param {something} value The variable to test
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

	function parse(space) {
		if (!space) {
			return [];
		} else if (isString(space)) {
			return space.split('.'); // turn strings into an array
		} else if (isArray(space)) {
				return space.slice(0);
			} else {
				return space;
			}
	}

	/**
	 * Sets a value to a namespace, returns the old value
	 *
	 * @function set
	 * @namespace bMoor
	 * @param {object} root The root of the namespace, bMoor.namespace.root if not defined
	 * @param {string|array} space The namespace
	 * @param {something} value The value to set the namespace to
	 * @return {something}
	 **/
	function set(root, space, value) {
		var i,
		    c,
		    old,
		    val,
		    nextSpace,
		    curSpace = root;

		if (isString(space)) {
			space = space.split('.');

			val = space.pop();

			for (i = 0, c = space.length; i < c; i++) {
				nextSpace = space[i];

				if (isUndefined(curSpace[nextSpace])) {
					curSpace[nextSpace] = {};
				}

				curSpace = curSpace[nextSpace];
			}

			old = curSpace[val];
			curSpace[val] = value;
		}

		return old;
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
				var t = ctx[property];
				ctx[property] = value;
				return t;
			};
		}
	}

	function makeSetter(space) {
		var i,
		    fn,
		    readings = space.split('.');

		for (i = readings.length - 1; i > -1; i--) {
			fn = _makeSetter(readings[i], fn);
		}

		return fn;
	}

	/**
	 * get a value from a namespace, if it doesn't exist, the path will be created
	 *
	 * @function get
	 * @namespace bMoor
	 * @param {object} root The root of the namespace, bMoor.namespace.root if not defined
	 * @param {string|array|function} space The namespace
	 * @return {array}
	 **/
	function get(root, space) {
		var i,
		    c,
		    curSpace = root,
		    nextSpace;

		if (isString(space)) {
			if (space.length) {
				space = space.split('.');

				for (i = 0, c = space.length; i < c; i++) {
					nextSpace = space[i];

					if (isUndefined(curSpace[nextSpace])) {
						return;
					}

					curSpace = curSpace[nextSpace];
				}
			}

			return curSpace;
		} else {
			throw new Error('unsupported type: ' + space);
		}
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

	function makeGetter(space) {
		var i, fn;

		if (space.length) {
			space = space.split('.');

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

	function exec(root, space, args, ctx) {
		var i,
		    c,
		    last,
		    nextSpace,
		    curSpace = root;

		if (isString(space)) {
			if (space.length) {
				space = space.split('.');

				for (i = 0, c = space.length; i < c; i++) {
					nextSpace = space[i];

					if (isUndefined(curSpace[nextSpace])) {
						return;
					}

					last = curSpace;
					curSpace = curSpace[nextSpace];
				}
			}

			if (curSpace) {
				return curSpace.apply(ctx || last, args || []);
			}
		}

		throw new Error('unsupported eval: ' + space);
	}

	function _makeExec(property, next) {
		if (next) {
			return function (obj, args, ctx) {
				try {
					return next(obj[property], args, ctx);
				} catch (ex) {
					return undefined;
				}
			};
		} else {
			return function (obj, args, ctx) {
				return obj[property].apply(ctx || obj, args || []);
			};
		}
	}

	function makeExec(space) {
		var i, fn;

		if (space.length) {
			space = space.split('.');

			fn = _makeExec(space[space.length - 1]);

			for (i = space.length - 2; i > -1; i--) {
				fn = _makeExec(space[i], fn);
			}
		} else {
			throw new Error('unsupported eval: ' + space);
		}

		return fn;
	}

	function load(root, space) {
		var i, c, arr, res;

		space = space.split('[]');
		if (space.length === 1) {
			return [get(root, space[0])];
		} else {
			arr = get(root, space[0]);
			res = [];

			if (arr) {
				for (i = 0, c = arr.length; i < c; i++) {
					res.push(get(arr[i], space[1]));
				}
			}

			return res;
		}
	}

	function makeLoader(space) {
		var getArray, getVariable;

		space = space.split('[]');

		if (space.length === 1) {
			return [makeGetter(space[0])];
		} else {
			getArray = makeGetter(space[0]);
			getVariable = makeGetter(space[1]);

			return function (obj) {
				var i,
				    c,
				    arr = getArray(obj),
				    res = [];

				if (arr) {
					for (i = 0, c = arr.length; i < c; i++) {
						res.push(getVariable(arr[i]));
					}
				}

				return res;
			};
		}
	}

	/**
	 * Delete a namespace, returns the old value
	 *
	 * @function del
	 * @namespace bMoor
	 * @param {object} root The root of the namespace, bMoor.namespace.root if not defined
	 * @param {string|array} space The namespace
	 * @return {something}
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
	 * @namespace bMoor
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
	 * @namespace bMoor
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
	 * @namespace bMoor
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
	 * @namespace bMoor
	 * @param {object} obj The object to iterate through
	 * @param {function} fn The function to call against each element
	 * @param {object} scope The scope to call each function against
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
		exec: exec,
		makeExec: makeExec,
		load: load,
		makeLoader: makeLoader,
		del: del,
		// controls
		loop: loop,
		each: each,
		iterate: iterate,
		safe: safe,
		naked: naked
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var bmoor = __webpack_require__(4),
	    regex = {};

	function getReg(className) {
		var reg = regex[className];

		if (!reg) {
			reg = new RegExp('(?:^|\\s)' + className + '(?!\\S)');
			regex[className] = reg;
		}

		return reg;
	}

	function massage(elements) {
		if (!bmoor.isArrayLike(elements)) {
			elements = [elements];
		}

		return elements;
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
		addClass: addClass,
		removeClass: removeClass,
		triggerEvent: triggerEvent,
		bringForward: bringForward
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

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

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var bmoor = __webpack_require__(4);

	/**
	 * Search an array for an element, starting at the begining or a specified location
	 *
	 * @function indexOf
	 * @namespace bMoor
	 * @param {array} arr An array to be searched
	 * @param {something} searchElement Content for which to be searched
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
	 * @namespace bMoor
	 * @param {array} arr An array to be searched
	 * @param {something} searchElement Content for which to be searched
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
	 * @namespace bMoor
	 * @param {array} arr An array to be searched
	 * @param {something} searchElement Content for which to be searched
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
	 * @namespace bMoor
	 * @param {array} arr An array to be searched
	 * @param {something} searchElement Content for which to be searched
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
	 * @namespace bMoor
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

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var bmoor = __webpack_require__(4);

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
	 * @namespace bMoor
	 * @param {object} target The object to map the variables onto
	 * @param {object} mappings An object orientended as [ namespace ] => value
	 * @return {object} The object that has had content mapped into it
	 **/
	function explode(target, mappings) {
		bmoor.iterate(mappings, function (val, mapping) {
			bmoor.set(target, mapping, val);
		});

		return target;
	}

	/**
	 * Create a new instance from an object and some arguments
	 *
	 * @function mask
	 * @namespace bMoor
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
	 * @namespace bMoor
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
	 * @namespace bMoor
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
		mask: mask,
		extend: extend,
		empty: empty,
		copy: copy,
		merge: merge,
		equals: equals
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var bmoor = __webpack_require__(4),
	    mixin = __webpack_require__(10),
	    plugin = __webpack_require__(11),
	    decorate = __webpack_require__(12);

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

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var bmoor = __webpack_require__(4);

	module.exports = function (to, from) {
		bmoor.iterate(from, function (val, key) {
			to[key] = val;
		});
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var bmoor = __webpack_require__(4);

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

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var bmoor = __webpack_require__(4);

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

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var bmoor = __webpack_require__(4);

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
		}
	};

	function doFilters(ters) {
		var fn, command, filter;

		while (ters.length) {
			command = ters.pop();
			fn = filters[command.method].apply(null, command.args);

			if (filter) {
				filter = stackFunctions(fn, filter);
			} else {
				filter = fn;
			}
		}

		return filter;
	}

	function doVariable(lines) {
		var fn, dex, line, getter, commands, remainder;

		if (!lines.length) {
			return null;
		} else {
			line = lines.shift();
			dex = line.indexOf('}}');
			fn = doVariable(lines);

			if (dex === -1) {
				return function () {
					return '--no close--';
				};
			} else if (dex === 0) {
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
				remainder = line.substr(dex + 2);
				getter = bmoor.makeGetter(commands.shift().command);

				if (commands.length) {
					getter = stackFunctions(getter, doFilters(commands, getter));
				}
			}

			//let's optimize this a bit
			if (fn) {
				// we have a child method
				return function (obj) {
					return getter(obj) + remainder + fn(obj);
				};
			} else {
				// this is the last variable
				return function (obj) {
					return getter(obj) + remainder;
				};
			}
		}
	}

	function getFormatter(str) {
		var fn,
		    lines = str.split(/{{/g);

		if (lines.length > 1) {
			str = lines.shift();
			fn = doVariable(lines);

			return function (obj) {
				return str + fn(obj);
			};
		} else {
			return function () {
				return str;
			};
		}
	}

	getFormatter.filters = filters;

	module.exports = {
		trim: trim,
		ltrim: ltrim,
		rtrim: rtrim,
		getCommands: getCommands,
		getFormatter: getFormatter
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";

	function always(promise, func) {
		promise.then(func, func);
		return promise;
	}

	module.exports = {
		always: always
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
		Eventing: __webpack_require__(16)
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
		on: function on(event, cb) {
			var dis = this;

			if (!this._$listeners) {
				this._$listeners = {};
			}

			if (!this._$listeners[event]) {
				this._$listeners[event] = [];
			}

			this._$listeners[event].push(cb);

			return function clear$on() {
				dis._$listeners[event].splice(dis._$listeners[event].indexOf(cb), 1);
			};
		},
		subscribe: function subscribe(subscriptions) {
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
		},
		trigger: function trigger(event) {
			var listeners,
			    i,
			    c,
			    args = Array.prototype.slice.call(arguments, 1);

			if (this._$listeners) {
				listeners = this._$listeners[event];

				if (listeners) {
					listeners = listeners.slice(0);
					for (i = 0, c = listeners.length; i < c; i++) {
						listeners[i].apply(this, args);
					}
				}
			}
		}
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var bmoor = __webpack_require__(3),
	    Composite = __webpack_require__(18);

	var Observor = function (_bmoor$build) {
		_inherits(Observor, _bmoor$build);

		function Observor(obj) {
			_classCallCheck(this, Observor);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(Observor).call(this, obj, '$observe'));
		}

		_createClass(Observor, [{
			key: 'update',
			value: function update(content) {
				var root = this.getRoot();

				if (content) {
					if (bmoor.isFunction(content)) {
						content = content(root);
					} else {
						this.merge(content);
					}
				}

				this.trigger('update', content);
			}
		}, {
			key: 'trigger',
			value: function trigger() {
				// always make the root be the last argument passed
				arguments[arguments.length] = this.getRoot();
				arguments.length++;

				_get(Object.getPrototypeOf(Observor.prototype), 'trigger', this).apply(this, arguments);
			}
		}]);

		return Observor;
	}(bmoor.build(Composite, { mixin: bmoor.interfaces.Eventing }));

	Observor.enforce = function (obj) {
		if (obj.$observe) {
			return obj.$observe;
		} else {
			return new Observor(obj);
		}
	};

	module.exports = Observor;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var bmoor = __webpack_require__(3);

	var Composite = function () {
		function Composite(obj, mountPoint) {
			_classCallCheck(this, Composite);

			bmoor.set(obj, mountPoint, this);

			this.getRoot = function () {
				return obj;
			};
		}

		_createClass(Composite, [{
			key: 'merge',
			value: function merge(content) {
				bmoor.object.merge(this.getRoot(), content);
			}
		}]);

		return Composite;
	}();

	module.exports = Composite;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var bmoor = __webpack_require__(3);

	function makeName(cfg) {
		return cfg.join('-');
	}

	function buildGetters(cfg) {
		var i, c;

		for (i = 0, c = cfg.length; i < c; i++) {
			cfg[i] = bmoor.makeGetter(cfg[i]);
		}
	}

	function makeFullfill(cfg, i) {
		var next, getter;

		if (!i) {
			i = 0;
		}

		getter = cfg[i];

		if (i !== cfg.length - 1) {
			next = makeFullfill(cfg, i + 1);
			return function (obj) {
				if (getter(obj) === undefined) {
					return false;
				} else {
					return next(obj);
				}
			};
		} else {
			return function (obj) {
				return getter(obj) !== undefined;
			};
		}
	}

	function makeHasher(cfg, i) {
		var next, getter;

		if (!i) {
			i = 0;
		}

		getter = cfg[i];

		if (i !== cfg.length - 1) {
			next = makeHasher(cfg, i + 1);
			return function (obj) {
				return getter(obj) + '::' + next(obj);
			};
		} else {
			return getter;
		}
	}

	// Generates the filtering functions

	var Hasher = function Hasher(cfg) {
		_classCallCheck(this, Hasher);

		var fields = cfg.slice(0).sort();

		this.name = makeName(fields);

		buildGetters(fields);

		this.hash = makeHasher(fields);
		this.canFulfill = makeFullfill(fields);
	};

	module.exports = Hasher;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Collection = __webpack_require__(2);

	var HashedCollection = function (_Collection) {
		_inherits(HashedCollection, _Collection);

		function HashedCollection(hasher) {
			_classCallCheck(this, HashedCollection);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HashedCollection).call(this));

			_this._index = {};
			_this._hasher = hasher;
			return _this;
		}

		_createClass(HashedCollection, [{
			key: '_canInsert',
			value: function _canInsert(datum) {
				return !this._index[this._hasher.hash(datum)] && _get(Object.getPrototypeOf(HashedCollection.prototype), '_canInsert', this).call(this, datum);
			}
		}, {
			key: 'insert',
			value: function insert(datum, front) {
				var hash = this._hasher.hash(datum),
				    res = _get(Object.getPrototypeOf(HashedCollection.prototype), 'insert', this).call(this, datum, front); // run the base insert command

				// TODO : watch the hash possibly change?
				if (res) {
					this._index[hash] = datum;
				}

				return res;
			}
		}, {
			key: 'select',
			value: function select(query) {
				return this._index[this._hasher.hash(query)];
			}
		}, {
			key: 'update',
			value: function update(content) {
				var datum = this.select(content);

				if (datum) {
					datum.$observe.update(content);
				}
			}
		}]);

		return HashedCollection;
	}(Collection);

	module.exports = HashedCollection;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var bmoor = __webpack_require__(3),
	    getUid = bmoor.data.getUid,
	    Collection = __webpack_require__(2);

	function createCollection(index, hash) {
		var c = new Collection(),
		    uid = getUid(c);

		index.hashes[hash] = c;
		index.collections[uid] = c;

		return c;
	}

	// Takes a filter function, seperates the results out to different collections

	var Index = function () {
		function Index(hasher, src) {
			var _this = this;

			_classCallCheck(this, Index);

			this.nodes = {}; // node id => collection id
			this.hashes = {}; // hash => Collection
			this.collections = {}; // collection id => Collection

			this._registrations = {};
			this.hasher = hasher;

			this.update = function (change, datum) {
				if (!change || _this.hasher.canFulfill(change)) {
					_this.insert(datum);
				}
			};

			if (src) {
				src.lead(this);
			}
		}

		_createClass(Index, [{
			key: '_addRegistration',
			value: function _addRegistration(datum, unreg) {
				var uid = getUid(datum),
				    old = this._registrations[uid];

				if (old) {
					this._registrations[uid] = function () {
						unreg();
						old();
					};
				} else {
					this._registrations[uid] = unreg;
				}
			}
		}, {
			key: '_insert',
			value: function _insert(cuid, datum) {
				var collection = this.collections[cuid];

				if (collection && collection.insert(datum)) {
					return collection;
				}
			}
		}, {
			key: 'insert',
			value: function insert(datum) {
				var ocid,
				    cuid,
				    ouid,
				    collection = this.select(datum);

				if (collection) {
					cuid = getUid(collection);
					ouid = getUid(datum);

					ocid = this.nodes[ouid];

					if (ocid) {
						// consider this an update
						if (ocid !== cuid) {
							// remove yourself from the old collection
							this._remove(ocid, datum);

							if (this._insert(cuid, datum)) {
								return null;
							} else {
								this.nodes[ouid] = cuid;
							}
						}
					} else if (this._insert(cuid, datum)) {
						this.nodes[ouid] = cuid;
						this._addRegistration(datum, datum.$observe.on('update', this.update));
					} else {
						return null;
					}

					return collection;
				}

				return null;
			}
		}, {
			key: '_remove',
			value: function _remove(cuid, datum) {
				var collection = this.collections[cuid];

				if (collection && collection.remove(datum)) {
					return collection;
				}
			}
		}, {
			key: 'remove',
			value: function remove(datum) {
				var ouid = getUid(datum),
				    cuid = this.nodes[ouid];

				if (cuid && this._remove(cuid, datum)) {
					this._registrations[ouid]();
					this.nodes[ouid] = null;

					return true;
				}

				return false;
			}
		}, {
			key: 'select',
			value: function select(search) {
				var hash;

				if (this.hasher.canFulfill(search)) {
					hash = this.hasher.hash(search);

					return this.hashes[hash] || createCollection(this, hash);
				} else {
					return null;
				}
			}
		}, {
			key: 'consume',
			value: function consume(obj) {
				var i, c;

				if (obj instanceof Collection) {
					obj.lead(this);
				} else if (bmoor.isArray(obj)) {
					for (i = 0, c = obj.length; i < c; i++) {
						this.insert(obj[i]);
					}
				} else {
					this.insert(obj);
				}
			}
		}]);

		return Index;
	}();

	module.exports = Index;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var bmoor = __webpack_require__(3),
	    getUid = bmoor.data.getUid,
	    Collection = __webpack_require__(2);

	function _insert(grid, datum) {
		var x,
		    xc,
		    y,
		    yc,
		    row,
		    xMin,
		    xMax,
		    yMin,
		    yMax,
		    info = grid.index[getUid(datum)],
		    box = info.getBox(datum);

		// I add one here because it will run to less than the max
		if (box.xMin > box.xMax) {
			xMin = grid.xCalc(box.xMax);
			xMax = grid.xCalc(box.xMin);
		} else {
			xMin = grid.xCalc(box.xMin);
			xMax = grid.xCalc(box.xMax);
		}

		if (box.yMin > box.yMax) {
			yMin = grid.yCalc(box.yMax);
			yMax = grid.yCalc(box.yMin);
		} else {
			yMin = grid.yCalc(box.yMin);
			yMax = grid.yCalc(box.yMax);
		}

		info.$old = {
			xMin: xMin,
			xMax: xMax,
			yMin: yMin,
			yMax: yMax
		};

		for (x = xMin, xc = xMax + 1; x < xc; x++) {
			grid._xDex[x].insert(datum);
			row = grid._grid[x];

			for (y = yMin, yc = yMax + 1; y < yc; y++) {
				row[y].insert(datum);
			}
		}

		for (y = yMin, yc = yMax + 1; y < yc; y++) {
			grid._yDex[y].insert(datum);
		}
	}

	var GridIndex = function () {
		// config : { x : { min, max }, y : { min, max } }

		function GridIndex(config, divisions, CollectionClass) {
			_classCallCheck(this, GridIndex);

			if (!divisions) {
				divisions = 10;
			}

			this.config = config;
			this.CollectionClass = CollectionClass || Collection;
			this.reset(divisions);
		}

		_createClass(GridIndex, [{
			key: 'reset',
			value: function reset(divisions) {
				var i,
				    j,
				    xMin,
				    xMax,
				    xDiff,
				    yMin,
				    yMax,
				    yDiff,
				    xDex = [],
				    yDex = [],
				    grid = [],
				    config = this.config;

				if (config.xMin > config.xMax) {
					xMin = config.xMax;
					xMax = config.xMin;
				} else {
					xMin = config.xMin;
					xMax = config.xMax;
				}
				xDiff = xMax - xMin;

				if (config.yMin > config.yMax) {
					yMin = config.yMax;
					yMax = config.yMin;
				} else {
					yMin = config.yMin;
					yMax = config.yMax;
				}
				yDiff = yMax - yMin;

				for (i = 0; i < divisions; i++) {
					grid.push([]);
					xDex.push(new this.CollectionClass());
					yDex.push(new this.CollectionClass());

					for (j = 0; j < divisions; j++) {
						grid[i].push(new this.CollectionClass());
					}
				}

				this.xCalc = function (x) {
					var t = Math.floor((x - xMin) / xDiff * divisions);

					if (t < 0) {
						t = 0;
					} else if (t >= divisions) {
						t = divisions - 1;
					}

					return t;
				};

				this.yCalc = function (y) {
					var t = Math.floor((y - yMin) / yDiff * divisions);

					if (t < 0) {
						t = 0;
					} else if (t >= divisions) {
						t = divisions - 1;
					}

					return t;
				};

				this.index = {};
				this._grid = grid;
				this._xDex = xDex;
				this._yDex = yDex;
			}
		}, {
			key: 'insert',
			value: function insert(datum, getBox, xIntersect, yIntersect) {
				var info,
				    uid = getUid(datum);

				if (this.index[uid]) {
					info = this.index[uid];
				} else {
					this.index[uid] = info = {};
				}

				info.getBox = getBox;
				info.xIntersect = xIntersect;
				info.yIntersect = yIntersect;

				_insert(this, datum);
			}
		}, {
			key: 'check',
			value: function check(x, y) {
				var _this = this;

				var xDex = this.xCalc(x),
				    yDex = this.yCalc(y);

				return this._grid[xDex][yDex].$filter(function (datum) {
					var info = _this.index[getUid(datum)];

					return info.xIntersect(datum, x) && info.yIntersect(datum, y);
				});
			}
		}, {
			key: 'checkX',
			value: function checkX(x) {
				var _this2 = this;

				var xDex = this.xCalc(x);

				return this._xDex[xDex].$filter(function (datum) {
					var info = _this2.index[getUid(datum)];
					return info.xIntersect(datum, x);
				});
			}
		}, {
			key: 'checkY',
			value: function checkY(y) {
				var _this3 = this;

				var yDex = this.yCalc(y);

				return this._yDex[yDex].$filter(function (datum) {
					var info = _this3.index[getUid(datum)];
					return info.yIntersect(datum, y);
				});
			}
		}]);

		return GridIndex;
	}();

	module.exports = GridIndex;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Index = __webpack_require__(21);

	// Takes a filter function, seperates the results out to different collections

	var Bucketer = function (_Index) {
		_inherits(Bucketer, _Index);

		function Bucketer(hasher, onInsert, onRemove) {
			_classCallCheck(this, Bucketer);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Bucketer).call(this, hasher));

			_this._onInsert = onInsert;
			_this._onRemove = onRemove;
			return _this;
		}

		_createClass(Bucketer, [{
			key: '_insert',
			value: function _insert(cuid, obj) {
				var collection = _get(Object.getPrototypeOf(Bucketer.prototype), '_insert', this).call(this, cuid, obj);

				if (collection) {
					this._onInsert(collection, obj);
				}

				return collection;
			}
		}, {
			key: '_remove',
			value: function _remove(cuid, obj) {
				var collection = _get(Object.getPrototypeOf(Bucketer.prototype), '_remove', this).call(this, cuid, obj);

				if (collection) {
					this._onRemove(collection, obj);
				}

				return collection;
			}
		}]);

		return Bucketer;
	}(Index);

	module.exports = Bucketer;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Index = __webpack_require__(21),
	    Hasher = __webpack_require__(19),
	    Collection = __webpack_require__(2),
	    HashedCollection = __webpack_require__(20);

	function getIndex(indexes, root, query) {
		var keys = Object.keys(query).sort(),
		    fields = keys.join('::'),
		    index = indexes[fields];

		if (!index) {
			index = new Index(new Hasher(keys), root);
			indexes[fields] = index;
		}

		return index;
	}

	var Table = function () {
		function Table(primary) {
			_classCallCheck(this, Table);

			if (primary) {
				this.primary = new HashedCollection(new Hasher(primary));
			} else {
				this.primary = new Collection();
			}

			this.indexes = {};
		}

		_createClass(Table, [{
			key: 'select',
			value: function select(query) {
				if (this.primary instanceof HashedCollection && this.primary._hasher.canFulfill(query)) {
					return this.primary.select(query);
				} else {
					return getIndex(this.indexes, this.primary, query).select(query);
				}
			}
		}, {
			key: 'insert',
			value: function insert(datum) {
				return this.primary.insert(datum);
			}
		}, {
			key: 'update',
			value: function update(datum) {
				return this.primary.update(datum);
			}
		}, {
			key: 'publish',
			value: function publish(datum) {
				if (!this.insert(datum)) {
					this.update(datum);
				}
			}
		}, {
			key: 'remove',
			value: function remove(datum) {
				this.primary.remove(datum);
			}
		}]);

		return Table;
	}();

	module.exports = Table;

/***/ }
/******/ ]);