var bmoor = require('bmoor'),
	Composite = require('./Composite.js');

class Observor extends bmoor.build(Composite,{mixin:bmoor.interfaces.Eventing}) {
	constructor( obj ){
		super( obj, '$observe' );
	}

	update( content ){
		var root = this.getRoot();

		if ( content ){
			if ( bmoor.isFunction(content) ){
				content = content( root );
			}else{
				this.merge( content );
			}
		}

		this.trigger( 'update', content );
	}

	trigger(){
		// always make the root be the last argument passed
		arguments[arguments.length] = this.getRoot();
		arguments.length++;

		super.trigger.apply( this, arguments );
	}
}

Observor.enforce = function( obj ){
	if ( obj.$observe ){
		return obj.$observe;
	}else{
		return new Observor( obj );
	}
};

module.exports = Observor;