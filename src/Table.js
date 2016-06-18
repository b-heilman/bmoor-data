var Index = require('./Index.js'),
	Hasher = require('./Hasher.js'),
	Collection = require('./Collection.js'),
	HashedCollection = require('./HashedCollection.js');

function getIndex( indexes, root, query ){
	var keys = Object.keys(query).sort(),
		fields = keys.join('::'),
		index = indexes[fields];

	if ( !index ){
		index = new Index( new Hasher(keys), root );
		indexes[fields] = index;
	}

	return index;
}

class Table {
	constructor( primary ){
		if ( primary ){
			this.primary = new HashedCollection( new Hasher(primary) );
		}else{
			this.primary = new Collection();
		}
		
		this.indexes = {};
	}

	select( query ){
		if ( this.primary instanceof HashedCollection && this.primary._hasher.canFulfill(query) ){
			return this.primary.select( query );
		}else{
			return getIndex( this.indexes, this.primary, query ).select( query );
		}
	}

	insert( datum ){
		return this.primary.insert( datum );
	}

	update( datum ){
		return this.primary.update( datum );
	}

	publish( datum ){
		if ( !this.insert(datum) ){
			this.update( datum );
		}
	}

	remove( datum ){
		this.primary.remove( datum );
	}
}

module.exports = Table;
