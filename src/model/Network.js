const {Linker} = require('./Linker.js');

// Builds a network give a mapper
class Network {
	constructor(mapper) {
		this.mapper = mapper;
	}

	// given a set of targets, see if they all connect, limiting depth of search
	search(toSearch, depth = 999) {
		// reduce all names to the links for them
		let models = [...new Set(toSearch)]; // make unique

		if (models.length === 1) {
			// I feel a little dirty for this... but...
			return [
				{
					name: models[0]
				}
			];
		}

		let contains = models.reduce((agg, name) => {
			agg[name] = null;

			return agg;
		}, {});

		const masterModels = models;
		const fnFactory = (depthTarget) => {
			return (agg, name, i) => {
				const linker = new Linker(this.mapper, name);

				// run only the following names, it's n!, but the ifs reduce n
				masterModels.slice(i + 1).forEach((nextName) => {
					let results = linker.search(nextName, depthTarget);

					if (results) {
						results.forEach((link) => {
							if (name !== link.name) {
								agg[name] = linker.link;

								if (!agg[link.name]) {
									agg[link.name] = link;
								}
							}
						});
					}
				});

				return agg;
			};
		};

		const filterFn = (key) => !contains[key];

		for (let depthPos = 1; depthPos <= depth; depthPos++) {
			contains = models.reduce(fnFactory(depthPos), contains);

			if (Object.values(contains).indexOf(null) === -1) {
				depthPos = depth;
			}

			models = Object.keys(contains).filter(filterFn);
		}

		// Do a last can, make sure all links were defined... ensuring all
		// tables are linked
		return Object.keys(contains).map((key) => {
			const link = contains[key];

			if (!link) {
				throw new Error('unlinked target: ' + key);
			}

			return link;
		});
	}

	requirements(names, count = 3) {
		const links = this.search(names, count);
		const context = {
			scope: links,
			found: []
		};

		// keep rotating through the network, pulling off the edges
		while (context.scope.length) {
			const origLength = context.scope.length;
			const names = context.scope.map((link) => link.name);

			context.scope = context.scope.filter((link) => {
				if (link.search('direction', 'outgoing', names).length === 0) {
					context.found.push(link);
					return false;
				} else {
					return true;
				}
			});

			if (context.scope.length === origLength) {
				throw new Error('no edges found');
			}
		}

		return context.found;
	}
}

module.exports = {
	Network
};
