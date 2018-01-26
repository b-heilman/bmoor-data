var bmoor = require('bmoor');

function stack( old, getter, value ){
	if ( old ){
		return function( obj ){
			if ( getter(obj) === value ){
				return old( obj );
			}else{
				return false;
			}
		};
	}else{
		return function( obj ){
			return getter( obj ) === value;
		};
	}
}

function build( obj ){
	var fn,
		flat = bmoor.object.implode( obj ),
		values = [];

	Object.keys( flat ).sort().forEach(function( path ){
		var v = flat[path];

		fn = stack(
			fn,
			bmoor.makeGetter(path),
			v
		);

		values.push( path+'='+v );
	});

	return {
		fn: fn,
		index: values.join(':')
	};
}

class Test {

	constructor( ops, settings ){
		var fn,
			hash;

		if ( !settings ){
			settings = {};
		}

		if ( bmoor.isFunction(ops) ){
			fn = ops;
			hash = ops.toString().replace(/[\s]+/g,'');
		}else if ( bmoor.isObject(ops) ){
			let t = build( ops );

			fn = t.fn;
			hash = t.index;
		}else{
			throw new Error(
				'I can not build a Test out of '+typeof(ops)
			);
		}

		this.hash = settings.hash || hash;
		this.go = fn;
	}
}

module.exports = Test;
