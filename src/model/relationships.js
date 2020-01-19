
class Link {
	constructor(name){
		this.name = name;
		this.joins = [];
		this.hash = {};
	}

	addLink(local, name, remote, metadata={}){
		const existing = this.hash[name];

		const join = {
			name,
			local,
			remote,
			metadata
		};

		if (existing){
			existing.push(join);
		} else {
			this.hash[name] = [join];
		}
		
		this.joins.push(join);
	}

	connectsTo(name){
		return this.hash[name] || null;
	}
}

class Mapper {
	constructor(){
		this.clear();
	}

	clear(){
		this.links = {};
	}

	addModel(model){
		const fields = model.settings.fields;
		
		for (let property in fields){
			let field = fields[property];

			if (field.link){
				model.hasRelationship = true;
				
				this.addLink(model.name, property, field.link.name, field.link.field);
			}
		}
	}

	addLink(fromTable, fromPath, toTable, toPath){
		const from = this.links[fromTable] || (this.links[fromTable] = new Link(fromTable));

		from.addLink(fromPath, toTable, toPath, {
			direction: 'outgoing'
		});

		const to = this.links[toTable] || (this.links[toTable] = new Link(toTable));

		to.addLink(toPath, fromTable, fromPath, {
			direction: 'incoming'
		});
	}

	getLink(name){
		return this.links[name];
	}

	getByDirection(name, direction){
		return this.links[name].joins
		.filter(d => d.metadata.direction === direction);
	}

	getRelationships(model){
		const link = this.getLink(model.name);

		if (link){
			return link.joins;
		}
	}

	getRelationship(model, name, field){
		const link = this.getLink(model.name);

		if (link){
			const connections = link.hash[name];

			if (connections){
				if (field){
					return connections.reduce(
						(agg, d) => agg || (d.local === field ? d : null)
					);
				} else {
					return connections[0];
				}
			} else {
				return [];
			}
		}
	}
}

// search a map for connective nodes, do it x deep
class Linker {
	constructor(mapper, name){
		this.link = mapper.getLink(name);
		this.mapper = mapper;
	}

	// search for tables within x jumps
	search(toName, count = 999){
		let rtn = this.link.connectsTo(toName);

		if (rtn){
			return [this.link, this.mapper.getLink(toName)];
		}

		const toCheck = [];
		const traversed = {};

		// create initial search list
		this.link.joins.forEach(l => {
			const link = this.mapper.getLink(l.name);

			toCheck.push({
				count: count-1,
				link: link
			});
			traversed[l.name] = true;
		});
		
		// iterate over list, it can grow
		while(toCheck.length){
			const check = toCheck.shift();
			const link = check.link;
			const match = link.connectsTo(toName);

			if (match){
				let iter = check;

				rtn = [link, this.mapper.getLink(toName)];

				while(iter.parent){
					rtn.unshift(iter.parent.link);
					iter = iter.parent;
				}

				rtn.unshift(this.link);

				toCheck.length = 0; // exit loop
			} else if (check.count > 1){
				// if not over count limit, add children to check list
				link.joins.forEach(l => {
					const childLink = this.mapper.getLink(l.name);

					if (!traversed[l.name]){
						toCheck.push({
							count: check.count - 1,
							link: childLink,
							parent: check // for building path later
						});
						traversed[l.name] = true;
					}
				});
			}
		}

		return rtn;
	}
}

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
	Link,
	Mapper,
	Linker,
	Network
};
