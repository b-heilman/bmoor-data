var bmoor = require('bmoor'),
	getUid = bmoor.data.getUid,
	Collection = require('./Collection.js');

function createCollection( index, hash ){
	var c = new Collection(),
		uid = getUid(c);

	index.hashes[ hash ] = c;
	index.collections[ uid ] = c;

	return c;
}

// Takes a filter function, seperates the results out to different collections
class Index {
	constructor( hasher, src ){
		this.nodes = {}; // node id => collection id
		this.hashes = {}; // hash => Collection
		this.collections = {}; // collection id => Collection

		this._registrations = {};
		this.hasher = hasher;

		this.update = ( change, datum ) => {
			if ( !change || this.hasher.canFulfill(change) ){
				this.insert( datum );
			}
		};

		if ( src ){
			src.lead( this );
		}
	}

	_addRegistration( datum, unreg ){
		var uid = getUid(datum),
			old = this._registrations[uid];

		if ( old ){
			this._registrations[uid] = function(){
				unreg();
				old();
			};
		}else{
			this._registrations[uid] = unreg;
		}
	}

	_insert( cuid, datum ){
		var collection = this.collections[cuid];

		if ( collection && collection.insert(datum) ){
			return collection;
		}
	}
	
	insert( datum ){
		var ocid,
			cuid,
			ouid,
			collection = this.select( datum );

		if ( collection ){
			cuid = getUid( collection );
			ouid = getUid( datum );

			ocid = this.nodes[ouid];
			
			if ( ocid ){
				// consider this an update
				if ( ocid !== cuid ){
					// remove yourself from the old collection
					this._remove( ocid, datum );
					
					if ( this._insert(cuid,datum) ){
						return null;
					}else{
						this.nodes[ ouid ] = cuid;
					}
				}
			} else if ( this._insert(cuid,datum) ){
				this.nodes[ ouid ] = cuid;
				this._addRegistration( datum, datum.$observe.on('update',this.update) );
			}else{
				return null;
			}
			
			return collection;
		}
		
		return null;
	}

	_remove( cuid, datum ){
		var collection = this.collections[cuid];

		if ( collection && collection.remove(datum) ){
			return collection;
		}
	}

	remove( datum ){
		var ouid = getUid( datum ),
			cuid = this.nodes[ouid];

		if ( cuid && this._remove(cuid,datum) ){
			this._registrations[ouid]();
			this.nodes[ouid] = null;

			return true;
		}

		return false;
	}

	select( search ){
		var hash;

		if ( this.hasher.canFulfill(search) ){
			hash = this.hasher.hash( search );

			return this.hashes[hash] || createCollection( this, hash );
		}else{
			return null;
		}
	}

	consume( obj ){
		var i, c;

		if ( obj instanceof Collection ){
			obj.lead( this );
		}else if ( bmoor.isArray(obj) ){
			for( i = 0, c = obj.length; i < c; i++ ){
				this.insert( obj[i] );
			}
		}else{
			this.insert( obj );
		}
	}
}

module.exports = Index;