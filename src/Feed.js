var bmoor = require('bmoor'),
	Eventing = bmoor.Eventing,
	setUid = bmoor.data.setUid,
	oldPush = Array.prototype.push;

// designed for one way data flows.
// src -> feed -> target
class Feed extends Eventing {

	constructor( src ){
		super();

		if ( !src ){
			src = [];
		}else{
			src.push = src.unshift = this.add.bind( this );
		}

		setUid(this);

		this.data = src;
	}

	add( datum ){
		oldPush.call( this.data, datum );

		this.trigger( 'insert', datum );

		this.trigger( 'update' );
	}

	consume( arr ){
		var i, c;

		oldPush.apply( this.data, arr );

		if ( this.hasWaiting('insert') ){
			for ( i = 0, c = arr.length; i < c; i++ ){
				this.trigger( 'insert', arr[i] );
			}
		}

		this.trigger( 'update' );
	}
}

module.exports = Feed;