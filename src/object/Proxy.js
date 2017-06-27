var bmoor = require('bmoor'),
	Eventing = bmoor.Eventing;

function makeMask( target, seed ){
	var mask = bmoor.isArray(target) ?
		target.slice(0) : Object.create( target );
	
	// I'm being lazy
	Object.keys(target).forEach( ( k ) => {
		if ( bmoor.isObject(target[k]) ){
			mask[k] = makeMask( 
				target[k],
				bmoor.isObject(seed) ? seed[k] : null
			);
		}
	});

	if ( seed ){
		Object.keys(seed).forEach( ( k ) => {
			if ( !mask[k] || 
				!(bmoor.isObject(mask[k]) && bmoor.isObject(seed))
			){
				mask[k] = seed[k];
			}
		});
	}

	return mask;
}

function isDirty( obj ){
	var i, c,
		t,
		keys = Object.keys( obj );

	for( i = 0, c = keys.length; i < c; i++ ){
		t = obj[keys[i]];

		if ( !bmoor.isObject(t) || isDirty(t) ){
			return true;
		}
	}

	return false;
}

function getChanges( obj ){
	var rtn = {},
		valid = false;

	Object.keys( obj ).forEach(function( k ){
		var d = obj[k];

		if ( bmoor.isObject(d) ){
			d = getChanges(d);
			if ( d ){
				valid = true;
				rtn[k] = d;
			}
		}else{
			valid = true;
			rtn[k] = d;
		}
	});

	if ( valid ){
		return rtn;
	}
}

class Proxy extends Eventing {
	constructor( obj ){
		super();

		this.getDatum = function(){
			return obj;
		};
	}

	getMask( seed ){
		if ( !this.mask || seed ){
			this.mask = makeMask( this.getDatum(), seed );
		}

		return this.mask;
	}

	getChanges(){
		return getChanges( this.mask );
	}

	isDirty(){
		return isDirty( this.mask );
	}

	merge( delta ){
		bmoor.object.merge( this.getDatum(), delta );
		this.mask = null;
	}

	update( delta ){
		var datum = this.getDatum();

		if ( delta ){
			if ( bmoor.isFunction(delta) ){
				delta = delta( datum );
			}else{
				this.merge( delta );
			}
		}

		this.mask = null;
		this.trigger( 'update', delta );
	}

	trigger(){
		// always make the datum be the last argument passed
		arguments[arguments.length] = this.getDatum();
		arguments.length++;

		super.trigger.apply( this, arguments );
	}
}

Proxy.isDirty = isDirty;
Proxy.getChanges = getChanges;

module.exports = Proxy;
