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

	module.exports = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
		Feed: __webpack_require__(2),
		Pool: __webpack_require__(17),
		Collection: __webpack_require__(25),
		stream: {
			Converter: __webpack_require__(26)
		},
		object: {
			Proxy: __webpack_require__(27)
		}
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var bmoor = __webpack_require__(3),
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
		}]);

		return Feed;
	}(Eventing);

	module.exports = Feed;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var bmoor = Object.create(__webpack_require__(4));

	bmoor.dom = __webpack_require__(5);
	bmoor.data = __webpack_require__(6);
	bmoor.array = __webpack_require__(7);
	bmoor.build = __webpack_require__(8);
	bmoor.object = __webpack_require__(12);
	bmoor.string = __webpack_require__(13);
	bmoor.promise = __webpack_require__(14);

	bmoor.Memory = __webpack_require__(15);
	bmoor.Eventing = __webpack_require__(16);

	module.exports = bmoor;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

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

/***/ },
/* 6 */
/***/ function(module, exports) {

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

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Array helper functions
	 * @module bmoor.array
	 **/

	var bmoor = __webpack_require__(4);

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

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var bmoor = __webpack_require__(4),
	    mixin = __webpack_require__(9),
	    plugin = __webpack_require__(10),
	    decorate = __webpack_require__(11);

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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var bmoor = __webpack_require__(4);

	module.exports = function (to, from) {
		bmoor.iterate(from, function (val, key) {
			to[key] = val;
		});
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/**
	 * Object helper functions
	 * @module bmoor.object
	 **/

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
		implode: implode,
		mask: mask,
		extend: extend,
		empty: empty,
		copy: copy,
		merge: merge,
		equals: equals
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var bmoor = __webpack_require__(4);

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
/***/ function(module, exports) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var master = {};

	var Memory = function Memory() {
		_classCallCheck(this, Memory);

		var index = {};

		this.check = function (name) {
			return index[name];
		};

		this.register = function (name, obj) {
			index[name] = obj;
		};

		this.clear = function (name) {
			if (name in index) {
				delete index[name];
			}
		};
	};

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

/***/ },
/* 16 */
/***/ function(module, exports) {

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

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var bmoor = __webpack_require__(3),
	    Eventing = bmoor.Eventing,
	    getUid = bmoor.data.getUid,
	    makeGetter = bmoor.makeGetter,
	    Mapper = __webpack_require__(18).Mapper;

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

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
		encode: __webpack_require__(19),
		Mapper: __webpack_require__(20),
		Mapping: __webpack_require__(22),
		Path: __webpack_require__(21),
		translate: __webpack_require__(23),
		validate: __webpack_require__(24)
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var bmoor = __webpack_require__(3),
	    ops;

	function parse(def, path, val) {
		var method;

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

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Path = __webpack_require__(21),
	    bmoor = __webpack_require__(3),
	    Mapping = __webpack_require__(22);

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

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var bmoor = __webpack_require__(3),
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

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Path = __webpack_require__(21);

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

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

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

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var Path = __webpack_require__(21);

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

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var bmoor = __webpack_require__(3),
	    Feed = __webpack_require__(2),
	    setUid = bmoor.data.setUid;

	var Collection = function (_Feed) {
		_inherits(Collection, _Feed);

		function Collection() {
			_classCallCheck(this, Collection);

			return _possibleConstructorReturn(this, (Collection.__proto__ || Object.getPrototypeOf(Collection)).apply(this, arguments));
		}

		_createClass(Collection, [{
			key: 'remove',
			value: function remove(datum) {
				var dex = this.data.indexOf(datum);

				if (dex !== -1) {
					this.data.splice(dex, 1);

					this.trigger('remove', datum);

					this.trigger('update');
				}
			}
		}, {
			key: 'filter',
			value: function filter(fn) {
				var i,
				    c,
				    d,
				    src = [],
				    child = new Collection(src);

				for (i = 0, c = this.data.length; i < c; i++) {
					d = this.data[i];

					if (fn(d)) {
						src.push(d);
					}
				}

				child.$parent = this;

				child.$disconnect = this.subscribe({
					insert: function insert(ins) {
						if (fn(ins)) {
							child.add(ins);
						}
					},
					remove: function remove(outs) {
						child.remove(outs);
					}
				});

				return child;
			}
		}, {
			key: 'index',
			value: function index(fn) {
				var i,
				    c,
				    d,
				    _disconnect,
				    index = {};

				for (i = 0, c = this.data.length; i < c; i++) {
					d = this.data[i];

					index[fn(d)] = d;
				}

				_disconnect = this.subscribe({
					insert: function insert(ins) {
						index[fn(ins)] = ins;
					},
					remove: function remove(outs) {
						delete index[fn(outs)];
					}
				});

				return {
					get: function get(dex) {
						return index[dex];
					},
					keys: function keys() {
						return Object.keys(index);
					},
					disconnect: function disconnect() {
						_disconnect();
					}
				};
			}
		}, {
			key: 'route',
			value: function route(hasher) {
				var i,
				    c,
				    old = {},
				    index = {},
				    _disconnect2;

				function _get(i) {
					var t = index[i];

					if (!t) {
						t = new Collection();
						index[i] = t;
					}

					return t;
				}

				function add(datum) {
					var i = hasher(datum);

					old[setUid(datum)] = i;

					_get(i).add(datum);
				}

				function _remove(datum) {
					var dex = setUid(datum);

					if (dex in old) {
						_get(old[dex]).remove(datum);
					}
				}

				for (i = 0, c = this.data.length; i < c; i++) {
					add(this.data[i]);
				}

				_disconnect2 = this.subscribe({
					insert: function insert(ins) {
						add(ins);
					},
					remove: function remove(outs) {
						_remove(outs);
					}
				});

				return {
					get: function get(hash) {
						return _get(hash);
					},
					reroute: function reroute(datum) {
						_remove(datum);
						add(datum);
					},
					keys: function keys() {
						return Object.keys(index);
					},
					disconnect: function disconnect() {
						_disconnect2();
					}
				};
			}
		}]);

		return Collection;
	}(Feed);

	module.exports = Collection;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var bmoor = __webpack_require__(3),
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

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var bmoor = __webpack_require__(3),
	    Eventing = bmoor.Eventing;

	function makeMask(target, seed) {
		var mask = bmoor.isArray(target) ? target.slice(0) : Object.create(target);

		// I'm being lazy
		Object.keys(target).forEach(function (k) {
			if (bmoor.isObject(target[k])) {
				mask[k] = makeMask(target[k], bmoor.isObject(seed) ? seed[k] : null);
			}
		});

		if (seed) {
			Object.keys(seed).forEach(function (k) {
				if (!mask[k] || !(bmoor.isObject(mask[k]) && bmoor.isObject(seed))) {
					mask[k] = seed[k];
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
			key: '_',
			value: function _(path) {
				return this.getDatum()[path];
			}
		}, {
			key: 'getMask',
			value: function getMask(seed) {
				if (!this.mask || seed) {
					this.mask = makeMask(this.getDatum(), seed);
				}

				return this.mask;
			}
		}, {
			key: '$',
			value: function $(path) {
				return this.getMask()[path];
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

/***/ }
/******/ ]);