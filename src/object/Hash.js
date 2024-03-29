var bmoor = require('bmoor');

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
		let flat = bmoor.object.implode(obj);

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

class Hash {
	constructor(ops, settings) {
		var fn, hash;

		if (!settings) {
			settings = {};
		}

		if (bmoor.isFunction(ops)) {
			fn = ops;
			hash = ops.toString().replace(/[\s]+/g, '');
		} else if (bmoor.isObject(ops)) {
			let t = build(ops);

			fn = t.fn;
			hash = t.index;
		} else {
			throw new Error('I can not build a Hash out of ' + typeof ops);
		}

		this.hash = settings.hash || hash;
		this.fn = fn;
		this.parse = (search) => {
			if (bmoor.isObject(search)) {
				return this.fn(search);
			} else {
				return search;
			}
		};
		this.go = (search) => {
			if (settings.massage && bmoor.isObject(search)) {
				search = settings.massage(search);
			}

			return this.parse(search);
		};
	}
}

module.exports = Hash;
