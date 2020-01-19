
const {Linker} = require('./Linker.js');

// Builds a network give a mapper
class Network {
	constructor(mapper){
		this.mapper = mapper;
	}

	// given a set of targets, see if they all connect, limiting depth of search
	search(names, count = 999){
		const contains = {};

		let linker = new Linker(this.mapper, names[0]);
		let rtn = linker.search(names[1], count);

		rtn.forEach(link => {
			contains[link.name] = true;
		});
		
		names.forEach((name,i) => {
			let nextName = names[i+1];

			if (!nextName || contains[nextName]){
				return;
			}

			linker = new Linker(this.mapper, name);

			let results = linker.search(nextName, count);
			if (results){
				results.forEach(link => {
					if (!contains[link.name]){
						contains[link.name] = true;
						rtn.push(link);
					}
				});
			}
		});

		return rtn;
	}
}

module.exports = {
	Network
};
