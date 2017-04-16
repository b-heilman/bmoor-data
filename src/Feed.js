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

		this._adding = null;
		this.on('stable', () => {
			this._adding = null;
		});
	}

	add( datum ){
		oldPush.call( this.data, datum );

		if ( this.hasWaiting('insert') ){
			if ( this._adding === null ){
				this._adding = [ datum ];

				this.trigger( 'insert', this._adding );
			}else{
				this._adding.push( datum );
			}
		}

		this.trigger( 'update' );
	}

	consume( arr ){
		oldPush.apply( this.data, arr );

		if ( this.hasWaiting('insert') ){
			if ( this._adding === null ){
				this._adding = arr;

				this.trigger( 'insert', this._adding );
			}else{
				this._adding.push.apply( this._adding, arr );
			}
		}

		this.trigger( 'update' );
	}

	stable( fn ){
		var disconnect;

		if ( this._adding ){
			disconnect = this.on( 'stable', function(){
				fn();
				disconnect(); 
			});
		}else{
			fn();
		}
	}
}

module.exports = Feed;