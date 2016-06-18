var bmoor = require('bmoor');

function makeName( cfg ){
	return cfg.join( '-' );
}

function buildGetters( cfg ){
	var i, c;

	for( i = 0, c = cfg.length; i < c; i++ ){
		cfg[i] = bmoor.makeGetter( cfg[i] );
	}
}

function makeFullfill( cfg, i ){
	var next,
		getter;

	if ( !i ){
		i = 0;
	}

	getter = cfg[i];
	
	if ( i !== cfg.length - 1 ){
		next = makeFullfill( cfg, i+1 );
		return function( obj ){
			if ( getter(obj) === undefined ){
				return false;
			}else{
				return next( obj );
			}
		};
	}else{
		return function( obj ){
			return getter(obj) !== undefined;
		};
	}
}

function makeHasher( cfg, i ){
	var next,
		getter;

	if ( !i ){
		i = 0;
	}

	getter = cfg[i];

	if ( i !== cfg.length - 1 ){
		next = makeHasher( cfg, i+1 );
		return function( obj ){
			return getter( obj )+'::'+next( obj );
		};
	}else{
		return getter;
	}
}

// Generates the filtering functions
class Hasher{
	constructor( cfg ){
		var fields = cfg.slice(0).sort();

		this.name = makeName( fields );

		buildGetters( fields );

		this.hash = makeHasher( fields );
		this.canFulfill = makeFullfill( fields );
	}
}

module.exports = Hasher;