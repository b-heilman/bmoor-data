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
			var m = mask[k],
				o = override[k],
				bothObj = bmoor.isObject(m) && bmoor.isObject(o);

			if ( (!(k in mask) || !bothObj) && o !== m ){
				mask[k] = o;
			}
		});
	}

	return mask;
}

function isDirty( obj ){
	var keys = Object.keys( obj );

	for( let i = 0, c = keys.length; i < c; i++ ){
		let k = keys[i];

		if ( k.charAt(0) !== '$' ){
			let t = obj[k];

			if ( !bmoor.isObject(t) || isDirty(t) ){
				return true;
			}
		}
	}

	return false;
}

function getChanges( obj, cmp ){
	var rtn = {},
		valid = false,
		keys = Object.keys( obj );

	for( let i = 0, c = keys.length; i < c; i++ ){
		let k = keys[i];

		if ( k.charAt(0) !== '$' ){
			let datum = obj[k];

			if ( bmoor.isObject(datum) ){
				let res = getChanges( datum, cmp?cmp[k]:null );
				
				if ( res ){
					valid = true;
					rtn[k] = res;
				}
			}else if ( !cmp || !(k in cmp) || cmp[k] !== datum ){
				valid = true;
				rtn[k] = datum;
			}
		}
	}

	if ( valid ){
		return rtn;
	}
}

function map( delta, obj ){
	var keys = Object.keys( delta );

	for( let i = 0, c = keys.length; i < c; i++ ){
		let k = keys[i], 
			d = delta[k],
			o = obj[k];

		if ( k.charAt(0) !== '$' ){
			if ( d !== o ){
				if ( bmoor.isObject(d) && bmoor.isObject(o) ){
					map( d, o );
				}else{
					obj[k] = d;
				}
			}
		}
	}
}

class Proxy extends Eventing {
	constructor( obj ){
		super();

		this.getDatum = function(){
			return obj;
		};
	}

	getMask( override ){
		if ( !this.mask || override ){
			this.mask = makeMask( this.getDatum(), override );
		}

		return this.mask;
	}

	$( path ){
		return bmoor.get( this.getDatum(), path );
	}

	getChanges(){
		return getChanges( this.mask, this.getDatum() );
	}

	isDirty(){
		return isDirty( this.mask );
	}

	map( delta ){
		var mask = this.getMask();

		map( delta, mask );

		return mask;
	}

	// create a deep copy of the datum.  if applyMask == true, 
	// we copy the mask on top as well.  Can be used for stringify then
	copy( applyMask ){
		var rtn = {};

		bmoor.object.merge( rtn, this.getDatum() );
		if ( applyMask ){
			bmoor.object.merge( rtn, this.getMask() );
		}

		return rtn;
	}

	merge( delta ){
		if ( !delta ){
			delta = this.getChanges();
		}else{
			delta = getChanges( delta, this.getDatum() );
		}

		if ( delta ){
			bmoor.object.merge( this.getDatum(), delta );

			this.mask = null;
			this.trigger( 'update', delta );
		}
	}

	trigger(){
		// always make the datum be the last argument passed
		arguments[arguments.length] = this.getDatum();
		arguments.length++;

		super.trigger.apply( this, arguments );
	}

	toJson(){
		return JSON.stringify( this.getDatum() );
	}
}

Proxy.isDirty = isDirty;
Proxy.getChanges = getChanges;

module.exports = Proxy;
