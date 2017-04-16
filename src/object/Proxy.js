var bmoor = require('bmoor'),
	Eventing = bmoor.Eventing;

class Proxy extends Eventing {
	constructor( obj ){
		super();

		this.getDatum = function(){
			return obj;
		};
	}

	getMask(){
		var t = Object.create( this.getDatum() );

		t.$parent = this;

		// TODO : way to calculate the delta

		return t;
	}

	merge( delta ){
		bmoor.object.merge( this.getDatum(), delta );
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
