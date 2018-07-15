const bmoor = require('bmoor'),
	schema = require('./Schema.js'),
	Join = require('./Join.js').Join;

/*
/models
 - name
 - properties [prop name]
  - read
  - write
  - update
 - relationships [prop name]
  - type (toOne, toMany)
  - model 
  - foreignKey
  - through []
    - model
    - incoming
    - outgoing
*/

function normalizeProperty( prop ){
	if ( !('read' in prop) ){
		prop.read = true;
	}

	if ( !('write' in prop) ){
		prop.write = false;
	}

	if ( !('update' in prop) ){
		prop.update = false;
	}

	return prop;
}

class Model {
	constructor( name, settings ){
		this.name = name;

		this.id = settings.id || 'id';

		this.schema = schema.get(settings.schema || 'default');
		this.schema.register( name, this );

		/*
		[ name ] => {
			read
			write
			update
		}
		*/
		this.selectFields = settings.selectFields || [];
		this.createFields = settings.createFields || [];
		this.updateFields = settings.updateFields || [];

		this.properties = Object.keys(settings.properties)
		.reduce( (props,p) => {
			var prop,
				v = settings.properties[p];

			if ( bmoor.isBoolean(v) ){
				prop = normalizeProperty({
					read: v,
					write: v,
					update: v
				});
			}else if ( v === null ){
				prop = normalizeProperty({
					read: true,
					write: false,
					update: false
				});
			}else{
				prop = normalizeProperty(v); 
			}

			props[p] = prop;

			if ( prop.read ){
				this.selectFields.push( p );
			}

			if ( prop.write ){
				this.createFields.push( p );
			}

			if ( prop.update ){
				this.updateFields.push( p );
			}

			return props;
		},{});
		
		/*
		[ targetModel ] => {
			type: 'toMany' || 'toOne'
			key,
			model:
			foreignKey:
			through: [{
				model: 
				incoming:
				outgoing:
			}]
		}
		*/
		this.relationships =  settings.relationships;
	}

	getJoin( target ){
		var relationship = this.relationships[target];

		if ( relationship ){
			// right now I'm not handling cross schema stuff
			return new Join(relationship.type,
				{
					model: this.name,
					key: relationship.key
				},
				{
					model: relationship.model,
					key: relationship.foreignKey
				},
				relationship.through
			);
		}else{
			throw new Error('connection missing to '+target);
		}
	}
}

module.exports = {
	Model: Model
};
