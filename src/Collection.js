var proto = Array.prototype,
	bmoor = require('bmoor'),
	getUid = bmoor.data.getUid,
	Observor = require('./Observor.js');

function manageFilter( collection, datum, filter ){
	var isIn = filter(datum);

	collection._addRegistration(
		datum,
		datum.$observe.on('update', function CollectionDatumWatch(){
			var nowIs = filter(datum);

			if ( isIn !== nowIs ){
				if ( nowIs ){
					collection.insert(datum);
				}else{
					collection.remove(datum);
				}

				isIn = nowIs;
			}
		})
	);

	return isIn;
}

class Collection extends bmoor.build(Array,{mixin:bmoor.interfaces.Eventing}) {
	constructor(){
		var i, c;

		super();

		bmoor.data.setUid(this);

		this._contains = {};
		this._following = {};
		this._registrations = {};

		for( i = 0, c = arguments.length; i < c; i++ ){
			this.consume( arguments[i] );
		}
	}

	// private functions
	_canInsert( obj ){
		var id = getUid( obj );

		return !this._contains[id] && (!this._$filter || this._$filter(obj));
	}

	_onInsert( datum ){
		var id = getUid( datum );

		this.trigger( 'insert', datum );

		if ( this._$filter ){
			manageFilter( this, datum, this._$filter );
		}

		this._contains[ id ] = 1;
	}

	_canRemove( obj ){
		var id = getUid( obj ),
			c = --this._contains[ id ];

		return !c;
	}

	_onRemove( obj ){
		var uid = getUid(obj),
			fn = this._registrations[uid];

		this.trigger( 'remove', obj );

		if ( fn ){
			fn();
			this._registrations[uid] = null;
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

	// General access
	get( pos ){
		return this[pos];
	}

	insert( datum, front ){
		Observor.enforce( datum );

		if ( this._canInsert(datum) ){
			if ( front ){
				proto.unshift.call( this, datum );
			}else{
				proto.push.call( this, datum );
			}

			this._onInsert( datum );

			return true;
		}

		return false;
	}
	
	setFilter( fn ){
		var i,
			datum;

		this._$filter = fn.bind(this);

		for( i = 0; i < this.length; i++ ){
			datum = this[i];

			if ( !manageFilter(datum,fn.bind(this)) ){
				this.splice( i, 1 );
				i--;
			}
		}
	}

	remove( obj ){
		var t;

		if ( this._canRemove(obj) ){
			t = bmoor.array.remove( this, obj );

			this._onRemove( t );

			return true;
		}

		return false;
	}

	consume( obj ){
		var i, c;

		if ( obj instanceof Collection ){
			this.follow( obj );
		}else if ( bmoor.isArray(obj) ){
			for( i = 0, c = obj.length; i < c; i++ ){
				this.insert( obj[i] );
			}
		}else{
			this.insert( obj );
		}
	}

	// TODO : other casters like toString, etc
	toArray(){
		return this.slice(0);
	}

	// inheritance methods
	follow( collection ){
		var uid = bmoor.data.getUid( collection );

		if ( !this._following[uid] ){
			this._following[uid] = collection.lead( this );
		}
	}

	lead( collection ){
		var i, c;

		for( i = 0, c = this.length; i < c; i++ ){
			collection.insert( this[i] );
		}

		return this.subscribe({
			'insert': collection.insert.bind(collection),
			'remove': collection.remove.bind(collection)
		});
	}

	unfollow( collection ){
		var i, c,
			id = bmoor.data.getUid( collection );

		if ( this._following[id] ){
			for( i = 0, c = collection.length; i < c; i++ ){
				this.remove( collection[i] );
			}

			this._following[id]();
			this._following[id] = null;
		}
	}

	// override base array functionality
	push( obj ){
		this.insert( obj, false );
	}

	unshift( obj ){
		this.insert( obj, true );
	}

	pop(){
		var obj = this[this.length-1];
		if ( this._canRemove(obj) ){
			proto.pop.call( this );
			this._onRemove( obj );
		}
	}

	shift(){
		var obj = this[0];
		if ( this._canRemove(obj) ){
			proto.shift.call( this );
			this._onRemove( obj );
		}
	}

	// extended base array functionality
	$filter( fn ){
		var child = new Collection();
		child.setFilter(fn);

		this.lead( child );

		return child;
	}

	$concat(){
		var i, c, 
			child = new Collection();

		this.lead( child );
		for( i = 0, c = arguments; i < c; i++ ){
			child.consume( arguments[i] ); 
		}

		return child;
	}
}

module.exports = Collection;
