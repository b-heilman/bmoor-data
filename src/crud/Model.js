
/**
tableLink: {
	name:
	field:	
}

fieldDef: {
	-- crud operations
	create
	onCreate
	read
	onRead
	update
	onUpdate
	delete

	-- 
	key: // is a primary key
	index: // can be used as a search index

	-- structure
	link: <tableLink> // if a foreign key
}

fields: {
	[fieldName]: <fieldDef>
}

model: {
	name: ''
	fields: <fields>
}
**/

function actionExtend(op, property, old){
	return function(datum, ctx){
		datum[property] = op(old(op, ctx), ctx);
		return datum;
	};
}

function buildProperties(properties, property, field){
	if (field === true){
		field = {
			create: true,
			read: true,
			update: true,
			delete: false
		};
	} else if (field === false){
		field = {
			create: false,
			read: true,
			update: false,
			delete: false
		};
	}

	if (field.create){
		properties.create.push(property);
	}

	if (field.onCreate){
		properties.onCreate = actionExtend(field.onCreate, property, properties.onCreate);
	}

	if (field.read){
		properties.read.push(property);
	}

	if (field.onRead){
		properties.onRead = actionExtend(field.onRead, property, properties.onRead);
	}

	if (field.update){
		properties.update.push(property);

		if (field.updateType){
			properties.updateType[property] = field.updateType;
		}
	}

	if (field.onUpdate){
		properties.onUpdate = actionExtend(field.onUpdate, property, properties.onUpdate);
	}

	if (field.delete){
		properties.delete.push(property);
	}

	if (field.onDelete){
		properties.onDelete = actionExtend(field.onDelete, property, properties.onDelete);
	}

	if (field.index){
		properties.index.push(property);
	}

	if (field.key){
		if (properties.key){
			throw new Error(`bmoor-data.Model does not support compound keys: (${properties.key}, ${property})`);
		}

		properties.key = property;
	}
}

function onCreate(obj){
	return obj;
}

function onRead(obj){
	return obj;
}

function onUpdate(obj){
	return obj;
}

function onDelete(obj){
	return obj;
}

function compileProperties(fields){
	const properties = {
		create: [],
		onCreate, 
		read: [],
		onRead,
		update: [],
		updateType: {},
		onUpdate,
		delete: [],
		onDelete,
		key: null,
		index: []
	};

	for (let property in fields){
		let field = fields[property];

		buildProperties(properties, property, field);
	}

	return properties;
}

class Model {
	constructor(name, settings) {
		this.name = name;
		this.settings = settings;

		// define structure
		this.properties = compileProperties(settings.fields);
	}

	getKey(delta){
		return delta[this.properties.key];
	}

	getIndex(delta){
		return this.properties.index
		.reduce(
			(agg, field) => {
				agg[field] = delta[field];

				return agg;
			},
			{}
		);
	}

	cleanDelta(delta, type = 'update'){
		return this.properties[type]
		.reduce((agg, field) => {
			if (field in delta){
				agg[field] = delta[field];
			}

			return agg;
		}, {});
	}

	getChanges(datum, delta){
		delta = this.cleanDelta(delta);

		return this.properties.update
		.reduce((agg, field) => {
			if (field in delta && datum[field] !== delta[field]){
				agg[field] = delta[field];
			}

			return agg;
		}, {});
	}

	getChangeType(delta){
		const changes = Object.keys(this.cleanDelta(delta))
		.reduce((agg, property) => {
			const type = this.properties.updateType[property];

			if (type){
				agg[type] = property;
			}

			return agg;
		}, {});

		if (Object.keys(changes).length){
			return changes;
		} else {
			return null;
		}
	}
}

module.exports = {
	Model
};
