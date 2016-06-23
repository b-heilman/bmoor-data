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
		Hasher: __webpack_require__(2),
		Collection: __webpack_require__(4),
		HashedCollection: __webpack_require__(7),
		Observor: __webpack_require__(5),
		Composite: __webpack_require__(6),
		Table: __webpack_require__(8),
		Memory: __webpack_require__(10),
		Index: __webpack_require__(9),
		Bucketer: __webpack_require__(11),
		GridIndex: __webpack_require__(12)
	};

/***/ },
/* 2 */
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
/* 3 */
/***/ function(module, exports) {

	module.exports = bmoor;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var proto = Array.prototype,
	    bmoor = __webpack_require__(3),
	    getUid = bmoor.data.getUid,
	    Observor = __webpack_require__(5);

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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var bmoor = __webpack_require__(3),
	    Composite = __webpack_require__(6);

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
/* 6 */
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Collection = __webpack_require__(4);

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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Index = __webpack_require__(9),
	    Hasher = __webpack_require__(2),
	    Collection = __webpack_require__(4),
	    HashedCollection = __webpack_require__(7);

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

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var bmoor = __webpack_require__(3),
	    getUid = bmoor.data.getUid,
	    Collection = __webpack_require__(4);

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
/* 10 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MemoryNode = function () {
		function MemoryNode() {
			_classCallCheck(this, MemoryNode);
		}

		_createClass(MemoryNode, [{
			key: "construct",
			value: function construct() {
				this.prev = null;
				this.next = null;
			}
		}, {
			key: "detach",
			value: function detach() {
				if (this.prev) {
					if (this.next) {
						this.prev.next = this.next;
						this.next.prev = this.prev;
						this.next = null;
					} else {
						this.prev.next = null;
					}
					this.prev = null;
				} else if (this.next) {
					this.next.prev = null;
					this.next = null;
				}
			}

			// insert myself before this node

		}, {
			key: "insertBefore",
			value: function insertBefore(node) {
				this.detach();

				if (node.prev) {
					this.prev = node.prev;
					this.prev.next = this;
				}

				node.prev = this;
				this.next = node;
			}
		}, {
			key: "insertAfter",
			value: function insertAfter(node) {
				this.detach();

				if (node.next) {
					this.next = node.next;
					this.next.prev = this;
				}

				node.next = this;
				this.prev = node;
			}
		}]);

		return MemoryNode;
	}();

	var Memory = function () {
		function Memory(hasher, limit, lifetime) {
			_classCallCheck(this, Memory);

			var unsets = {};

			this.index = {};
			this.limit = limit;
			this.length = 0;
			this.hasher = hasher;

			// tail should be oldest
			this.head = new MemoryNode();
			this.tail = new MemoryNode();

			this.tail.insertAfter(this.head);

			if (lifetime) {
				this.govern = function (hash) {
					var _this = this;

					var clear = unsets[hash];

					if (clear) {
						clearTimeout(clear);
					}

					unsets[hash] = setTimeout(function () {
						_this.remove(_this.index[hash].$datum);
					}, lifetime);
				};
			} else {
				this.govern = function () {};
			}
		}

		_createClass(Memory, [{
			key: "select",
			value: function select(query) {
				var hash = this.hasher.hash(query);

				return this.index[hash];
			}
		}, {
			key: "get",
			value: function get(dex) {
				var i,
				    node = this.head.next;

				if (dex > this.length) {
					dex = this.length;
				}

				for (i = 0; i < dex; i++) {
					node = node.next;
				}

				return node.$datum;
			}
		}, {
			key: "first",
			value: function first() {
				return this.head.next.$datum;
			}
		}, {
			key: "last",
			value: function last() {
				return this.tail.prev.$datum;
			}
		}, {
			key: "insert",
			value: function insert(datum) {
				var hash = this.hasher.hash(datum),
				    node = this.index[hash];

				if (!node) {
					node = new MemoryNode();
					node.$datum = datum;

					this.index[hash] = node;
					if (this.length === this.limit) {
						this.remove(this.tail.prev.$datum);
					}

					this.length++;
				}

				node.insertAfter(this.head);
				this.govern(hash);
			}
		}, {
			key: "remove",
			value: function remove(datum) {
				var hash = this.hasher.hash(datum),
				    node = this.index[hash];

				if (node) {
					this.length--;
					delete this.index[hash];
					node.detach();
				}
			}
		}]);

		return Memory;
	}();

	module.exports = Memory;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Index = __webpack_require__(9);

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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var bmoor = __webpack_require__(3),
	    getUid = bmoor.data.getUid,
	    Collection = __webpack_require__(4);

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

/***/ }
/******/ ]);