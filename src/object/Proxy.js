var bmoor = require('bmoor'),
	Eventing = bmoor.Eventing;

function makeMask( target, override ){
	var mask = bmoor.isArray(target) ?
		target.slice(0) : Object.create( target );
	
	// I'm being lazy
	Object.keys(target).forEach( ( k ) => {
		if ( bmoor.isObject(target[k]) ){
			mask[k] = makeMask( 
				target[k],
				bmoor.isObject(override) ? override[k] : null
			);
		}
	});

	if ( override ){
		Object.keys(override).forEach(function( k ){
			var bothObj = bmoor.isObject(mask[k]) && bmoor.isObject(override[k]);

			if ( !(k in mask) || !bothObj ){
				mask[k] = override[k];
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

	_( path ){
		return this.getDatum()[ path ];
	}

	getMask( override ){
		if ( !this.mask || override ){
			this.mask = makeMask( this.getDatum(), override );
		}

		return this.mask;
	}

	$( path ){
		return this.getMask()[ path ];
	}

	getChanges(){
		return getChanges( this.mask );
	}

	isDirty(){
		return isDirty( this.mask );
	}

	merge( delta ){
		if ( !delta ){
			delta = this.mask;
		}

		bmoor.object.merge( this.getDatum(), delta );

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
