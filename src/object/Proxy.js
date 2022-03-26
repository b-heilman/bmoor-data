const bmoor = require('bmoor');
const {Subject} = require('rxjs');

function makeMask(target, override) {
	var mask = bmoor.isArray(target)
		? target.slice(0)
		: bmoor.object.mask(target);

	// I'm being lazy
	Object.keys(target).forEach((k) => {
		if (bmoor.isObject(target[k])) {
			mask[k] = makeMask(
				target[k],
				bmoor.isObject(override) ? override[k] : null
			);
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

function isDirty(obj, cmp) {
	if (!obj) {
		return false;
	}

	let keys = Object.keys(obj);

	if (!cmp) {
		cmp = Object.getPrototypeOf(obj);
	}

	for (let i = 0, c = keys.length; i < c; i++) {
		let k = keys[i];

		if (k.charAt(0) !== '$') {
			let t = obj[k];

			if (t === cmp[k]) {
				continue;
			} else if (!bmoor.isObject(t) || isDirty(t, cmp[k])) {
				return true;
			}
		}
	}

	return false;
}

function getChanges(obj, cmp) {
	if (!obj) {
		return;
	}

	let rtn = {},
		valid = false,
		keys = Object.keys(obj);

	if (!cmp) {
		cmp = Object.getPrototypeOf(obj);
	} else if (!bmoor.isObject(cmp)) {
		return bmoor.object.merge(rtn, obj);
	}

	for (let i = 0, c = keys.length; i < c; i++) {
		let k = keys[i];

		if (k.charAt(0) !== '$') {
			let datum = obj[k];

			if (bmoor.isObject(datum)) {
				let res = getChanges(datum, cmp ? cmp[k] : null);

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

function map(obj, delta) {
	var keys = Object.keys(delta);

	for (let i = 0, c = keys.length; i < c; i++) {
		let k = keys[i],
			d = delta[k],
			o = obj[k];

		if (k.charAt(0) !== '$') {
			if (d !== o) {
				if (bmoor.isObject(d) && bmoor.isObject(o)) {
					map(o, d);
				} else {
					obj[k] = d;
				}
			}
		}
	}
}

function flatten(obj, cmp) {
	var rtn = {};

	if (!cmp) {
		cmp = Object.getPrototypeOf(obj);
	}

	Object.keys(cmp).forEach(function (key) {
		if (key.charAt(0) !== '$') {
			let v = cmp[key];

			if (bmoor.isObject(v) && !obj.hasOwnProperty(key)) {
				rtn[key] = bmoor.object.copy({}, v);
			} else {
				rtn[key] = v;
			}
		}
	});

	Object.keys(obj).forEach(function (key) {
		if (key.charAt(0) !== '$') {
			let v = obj[key];

			if (bmoor.isObject(v)) {
				rtn[key] = flatten(v, cmp[key]);
			} else {
				rtn[key] = v;
			}
		}
	});

	return rtn;
}

class Proxy extends Subject {
	constructor(obj) {
		super();

		this._followers = {};

		this.getDatum = function () {
			return obj;
		};
	}

	publish() {
		this.next(this.getDatum());
	}

	// a 'deep copy' of the datum, but using mask() to have the original
	// as the object's prototype.
	getMask(override) {
		if (!this.mask || override) {
			this.mask = makeMask(this.getDatum(), override);
		}

		return this.mask;
	}

	// create a true deep copy of the datum.  if applyMask == true,
	// we copy the mask on top as well.  Can be used for stringify then
	copy(applyMask) {
		var rtn = {};

		bmoor.object.merge(rtn, this.getDatum());
		if (applyMask) {
			bmoor.object.merge(
				rtn,
				bmoor.isObject(applyMask) ? applyMask : this.getMask()
			);
		}

		return rtn;
	}

	// create a shallow copy of the datum.  if applyMask == true,
	// we copy the mask on top as well.  Can be used for stringify then
	extend(applyMask) {
		var rtn = {};

		bmoor.object.extend(rtn, this.getDatum());
		if (applyMask) {
			bmoor.object.extend(
				rtn,
				bmoor.isObject(applyMask) ? applyMask : this.getMask()
			);
		}

		return rtn;
	}

	$(path) {
		return bmoor.get(this.getDatum(), path);
	}

	getChanges() {
		return getChanges(this.mask);
	}

	isDirty() {
		return isDirty(this.mask);
	}

	map(delta) {
		var mask = this.getMask();

		map(mask, delta);

		return mask;
	}

	merge(delta) {
		if (!delta) {
			delta = this.getChanges();
		} else {
			delta = getChanges(delta, this.getDatum());
		}

		if (delta) {
			bmoor.object.merge(this.getDatum(), delta);

			this.mask = null;
			this.publish();
		}
	}

	flatten(delta) {
		if (delta) {
			return flatten(delta, this.getDatum());
		} else {
			return flatten(this.getMask());
		}
	}

	toJson() {
		return JSON.stringify(this.getDatum());
	}

	follow(fn, hash) {
		this._followers[hash] = this.subscribe(fn);
	}

	unfollow(hash) {
		const unfollow = this._followers[hash];

		if (unfollow) {
			unfollow.unsubscribe();
		}
	}
}

module.exports = {
	Proxy,
	map,
	isDirty,
	flatten,
	getChanges,
	makeMask
};
