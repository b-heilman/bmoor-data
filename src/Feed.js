var bmoor = require('bmoor'),
	Eventing = bmoor.Eventing,
	setUid = bmoor.data.setUid,
	oldPush = Array.prototype.push;

// designed for one way data flows.
// src -> feed -> target
class Feed extends Eventing {

	constructor( src, settings ){
		super();

		if ( !src ){
			src = [];
			this.settings = {};
		}else if ( Array.isArray(src) ){
			this.settings = settings || {};
			src.push = src.unshift = this.add.bind( this );
		}else{
			this.settings = src;
			src = [];
		}

		setUid(this);

		this.data = src;

		if ( this.settings.controller ){
			this.controller = new (this.settings.controller)( this );
		}

		this.ready = bmoor.flow.window( () => {
			if ( this.controller && this.controller.ready ){
				this.controller.ready();
			}

			this.trigger('update');
		}, this.settings.windowMin||0, this.settings.windowMax||30);
	}

	_add( datum ){
		oldPush.call( this.data, datum );
	}

	add( datum ){
		this._add( datum );

		this.trigger( 'insert', datum );

		this.ready();
	}

	consume( arr ){
		var i, c;

		for ( i = 0, c = arr.length; i < c; i++ ){
			let d = arr[i];
			this._add( d );
			this.trigger( 'insert', d );
		}

		this.ready();
	}

	follow( parent, settings ){
		parent.subscribe(Object.assign(
			{
				insert: ( datum ) => {
					this.add( datum );
				},
				remove: ( datum ) => {
					this.remove( datum );
				},
				process: () => {
					if ( this.go ){
						this.go();
					}
				},
				destroy: () => {
					this.destroy();
				}
			},
			settings
		));
	}

	// I want to remove this
	sort( fn ){
		console.warn('this will be removed soon');
		this.data.sort( fn );
	}
}

module.exports = Feed;
