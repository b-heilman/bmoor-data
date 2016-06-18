var bmoor = require('bmoor');

class Composite {
	constructor( obj, mountPoint ){
		bmoor.set( obj, mountPoint, this );

		this.getRoot = function(){
			return obj;
		};
	}

	merge( content ){
		bmoor.object.merge( this.getRoot(), content );
	}
}

module.exports = Composite;
