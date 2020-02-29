
const {Linker} = require('./Linker.js');

// Builds a network give a mapper
class Network {
	constructor(mapper){
		this.mapper = mapper;
	}

	// given a set of targets, see if they all connect, limiting depth of search
	search(names, count = 999){
		const contains = names.reduce((agg, name) => {
			agg[name] = false;

			return agg;
		}, {});

		// reduce all names to the links for them
		return names.reduce((agg, name, i) => {
			if (!contains[name]){
				const linker = new Linker(this.mapper, name);

				agg.push(linker.link);
				contains[name] = true;

				// run only the following names, it's n!, but the ifs reduce n
				names.slice(i+1).forEach(nextName => {
					if (!contains[nextName]){
						let results = linker.search(nextName, count);

						if (results){
							results.forEach(link => {
								if (!contains[link.name]){
									agg.push(link);
									contains[link.name] = true;
								}
							});
						}
					}
				});
			}

			return agg;
		}, []);
	}

	requirements(names, count = 3){
		const links = this.search(names, count);
		const context = {
			scope: links,
			found: []
		};

		// keep rotating through the network, pulling off the edges
		while(context.scope.length){
			const origLength = context.scope.length;
			const names = context.scope.map(link => link.name);

			context.scope = context.scope.filter(link => {
				if (link.search('direction', 'outgoing', names).length === 0){
					context.found.push(link);
					return false;
				} else {
					return true;
				}
			});

			if (context.scope.length === origLength){
				throw new Error('no edges found');
			}
		}
		
		return context.found;
	}
}

module.exports = {
	Network
};
