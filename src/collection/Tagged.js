const {Collection} = require('../Collection.js');
const {Proxied} = require('./Proxied.js');

class Tagged extends Proxied {
	add(datum, tags) {
		var proxy = this._wrap(datum);

		if (tags) {
			proxy.tags = tags;
		}

		return super.add(proxy);
	}

	choose(settings) {
		if (!settings) {
			settings = {};
		}

		if (settings.massage) {
			let old = settings.massage;
			settings.massage = function (proxy) {
				return old(proxy.tags || {}, proxy);
			};
		} else {
			settings.massage = function (proxy) {
				return proxy.tags || {};
			};
		}

		return Collection.prototype.select.call(this, settings);
	}
}

module.exports = {
	Tagged
};
