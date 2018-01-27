var bmoor = require('bmoor'),
	Eventing = bmoor.Eventing;

function _datumStack( fn, old ){
	if ( old ){
		return function( datum, orig ){
			return fn( old(datum,orig), orig );
		};
	}else{
		return function( orig ){
			return fn( orig, orig );
		};
	}
}

function datumStack( fns ){
	var i, c,
		fn;

	for( i = 0, c = fns.length; i < c; i++ ){
		fn = _datumStack( fns[i], fn );
	}

	return fn;
}

function _arrStack( fn, old ){
	if ( old ){
		return function( src ){
			return fn( old(src) );
		};
	}else{
		return fn;
	}
}

function arrStack( fns ){
	var i, c,
		fn;

	for( i = 0, c = fns.length; i < c; i++ ){
		fn = _arrStack( fns[i], fn );
	}

	return fn;
}

// array wrapper that allows for watching a feed 
class Converter extends Eventing {

	constructor( arrFn, datumFn ){
		super();

		bmoor.data.setUid(this);

		this.data = [];

		this.setArrayCriteria( arrFn );
		this.setDatumCriteria( datumFn );
	}

	setArrayCriteria( fns ){
		if ( fns ){
			this.arrParse = arrStack( fns );
		}else{
			this.arrParse = null;
		}
	}

	setDatumCriteria( fns ){
		if ( fns ){
			this.datumParse = datumStack( fns );
		}else{
			this.datumParse = null;
		}
	}

	// I don't want to force it to be Feed, just needs .on and .data
	// technically converters can stack
	setFeed( feed ){
		var dis = this;

		if ( this.disconnect ){
			this.disconnect();
		}

		function readAll( changes ){
			var i, c,
				arr;

			if ( changes && changes.length ){
				if ( dis.arrParse ){
					arr = dis.arrParse( changes );
				}else{
					arr = changes.slice(0);
				}

				if ( dis.datumParse ){
					for( i = 0, c = arr.length; i < c; i++ ){
						arr[i] = dis.datumParse( arr[i] );
					}
				}

				dis.data = dis.data.concat(arr);
				dis.trigger('insert', arr);
			}
		}

		readAll( feed.data );
		this.disconnect = feed.on( 'insert', readAll );
	}
}

module.exports = Converter;
