
const {Link} = require('./Link.js');

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

module.exports = {
	Mapper
};
