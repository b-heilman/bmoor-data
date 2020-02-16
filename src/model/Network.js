
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
		
		return links.reduce((agg, link) => {
			let found = false;
			for(let i = agg.length - 1; i > -1; i--){
				const against = agg[i].name;
				const connection = link.connectsTo(against);

				if (connection){
					if (connection.metadata.direction === 'incoming'){
						agg.splice(i, 0, link);
					} else {
						agg.splice(i+1, 0, link);
					}

					found = true;
					i = 0;
				}
			}

			if (!found){
				agg.unshift(link);
			}

			return agg;
		}, []);
	}
}

module.exports = {
	Network
};
