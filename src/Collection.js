const {Feed} = require('./Feed.js');
const {Actionable} = require('./Actionable.js');
const {Proxy: ObjProxy} = require('./object/Proxy.js');

class Collection extends Feed {
	//--- array methods
	indexOf(obj, start) {
		return this.data.indexOf(obj, start);
	}

	//--- collection methods
	_track(datum) {
		if (datum instanceof ObjProxy) {
			datum.follow(() => {
				this.publish();
			}, this.$$bmoorUid);
		}
	}

	_remove(datum) {
		var dex = this.indexOf(datum);

		if (dex !== -1) {
			let rtn = this.data[dex];

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

	remove(datum) {
		var rtn = this._remove(datum);

		if (rtn) {
			this.publish();

			return rtn;
		}
	}

	empty() {
		var arr = this.data;

		while (arr.length) {
			this._remove(arr[0]);
		}

		this.publish();
	}

	// TODO : everything below needs to be removed in the next version
	index(search, settings = {}) {
		return Actionable.prototype.index.call(this, search, settings);
	}

	get(search, settings = {}) {
		return Actionable.prototype.get.call(this, search, settings);
	}

	//--- child generators
	route(search, settings = {}) {
		return Actionable.prototype.route.call(this, search, settings);
	}

	sorted(sortFn, settings = {}) {
		return Actionable.prototype.sorted.call(this, sortFn, settings);
	}

	map(mapFn, settings = {}) {
		return Actionable.prototype.map.call(this, mapFn, settings);
	}

	_filter(search, settings = {}) {
		return Actionable.prototype._filter.call(this, search, settings);
	}

	filter(search, settings = {}) {
		return Actionable.prototype.filter.call(this, search, settings);
	}

	select(settings = {}) {
		return Actionable.prototype.select.call(this, settings);
	}

	// settings { size }
	paginate(settings = {}) {
		return Actionable.prototype.paginate.call(this, settings);
	}
}

module.exports = {
	Collection
};
