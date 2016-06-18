var Index = require('./Index.js');

// Takes a filter function, seperates the results out to different collections
class Bucketer extends Index {
	constructor( hasher, onInsert, onRemove ){
		super( hasher );

		this._onInsert = onInsert;
		this._onRemove = onRemove;
	}

	_insert( cuid, obj ){
		var collection = super._insert( cuid, obj );

		if ( collection ){
			this._onInsert( collection, obj );
		}

		return collection;
	}

	_remove( cuid, obj ){
		var collection = super._remove( cuid, obj );

		if ( collection ){
			this._onRemove( collection, obj );
		}

		return collection;
	}
}

module.exports = Bucketer;