
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

		const looking = links.reduce((agg, link) => {
			agg[link.name] = link;

			return agg;
		}, {});

		function getOrder(link){
			looking[link.name] = false;

			const outgoing = link.search('direction', 'outgoing')
			.reduce((agg, name) => {
				const child = looking[name];

				if (child){
					return getOrder(child).concat(agg);
				}

				return agg;
			}, [link]);

			return link.search('direction', 'incoming')
			.reduce((agg, name) => {
				const child = looking[name];

				if (child){
					return agg.concat(getOrder(child));
				}

				return agg;
			}, outgoing);
		}

		let order = [];

		for(let i = 0, c = links.length; i < c; i++){
			const next = links[i];

			if (looking[next.name]){
				order = getOrder(next).concat(order);
			}
		}
		
		return order;
	}
}

module.exports = {
	Network
};
