var bmoor = require('bmoor'),
	Eventing = bmoor.Eventing;

class Proxy extends Eventing {
	constructor( obj ){
		super();

		this.getDatum = function(){
			return obj;
		};
	}

	getMask( seed ){
		var trg,
			mask;

		if ( !this.mask || seed ){
			trg = this.getDatum();

			if ( bmoor.isArray(trg) ){
				this.mask = trg.slice(0);
			}else{
				this.mask = Object.create( trg );
			}
		}
		
		mask = this.mask;
		if ( seed ){
			Object.keys(seed).forEach(function( k ){
				mask[k] = seed[k];
			});
		}

		return mask;
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

module.exports = Proxy;
