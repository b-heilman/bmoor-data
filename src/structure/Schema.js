const Memory = require('bmoor').Memory,
	schemas = {
		default: Memory.use('data-structure-schema')
	};

module.exports = {
	default: schemas.default,
	get: function(name){
		var schema;
		
		if ( name !== 'default' ){
			name = 'data-structure-schema-'+name;
		}

		schema = schemas[name];
		if ( !schema ){
			schema = schemas[name] = Memory.use(name);
		}

		return schema;
	}
};