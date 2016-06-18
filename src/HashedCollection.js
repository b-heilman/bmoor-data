var Collection = require('./Collection.js');

class HashedCollection extends Collection {
	constructor( hasher ){
		super();
		
		this._index = {};
		this._hasher = hasher;
	}

	_canInsert( datum ){
		return !this._index[this._hasher.hash(datum)] && super._canInsert( datum );
	}

	insert( datum, front ){
		var hash = this._hasher.hash(datum),
			res = super.insert( datum, front ); // run the base insert command

		// TODO : watch the hash possibly change?
		if ( res ){
			this._index[hash] = datum;
		}

		return res;
	}

	select( query ){
		return this._index[ this._hasher.hash(query) ];
	}

	update( content ){
		var datum = this.select( content );

		if ( datum ){
			datum.$observe.update( content );
		}
	}
}

module.exports = HashedCollection;