const {makeGetter} = require('bmoor/src/core.js');

class Link {
	constructor(name) {
		this.name = name;
		this.joins = []; // aggregrate of ALL links, even multiple links to one table
		this.hash = {}; // quick look hash, at least one instance is there, but not all if
		// multiple fields
	}

	addLink(local, name, remote, metadata = {}) {
		const existing = this.hash[name];

		const join = {
			name,
			local,
			remote,
			metadata
		};

		if (!(existing && existing.metadata.primary)) {
			this.hash[name] = join;
		}

		this.joins.push(join);
	}

	search(path, value, subset) {
		const getter = makeGetter(path);

		if (subset) {
			return subset.reduce((agg, name) => {
				const join = this.hash[name];

				if (join && getter(join.metadata) === value) {
					agg.push(join);
				}

				return agg;
			}, []);
		} else {
			return this.joins
				.filter((join) => getter(join.metadata) === value)
				.map((join) => join.name);
		}
	}

	connectsTo(name, viaField = null) {
		const hash = this.hash[name];

		if (hash) {
			if (viaField) {
				return this.joins.reduce((agg, link) => {
					if (agg) {
						return agg;
					}

					if (link.local === viaField && link.name === name) {
						return link;
					}

					return null;
				}, null);
			} else {
				return hash;
			}
		} else {
			return null;
		}
	}
}

module.exports = {
	Link
};
