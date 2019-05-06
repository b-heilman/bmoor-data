var bmoor = require('bmoor'),
	Eventing = bmoor.Eventing,
	setUid = bmoor.data.setUid,
	oldPush = Array.prototype.push;

// designed for one way data flows.
// src -> feed -> target
class Feed extends Eventing {

	constructor(src, settings = {}){
		super();

		this.settings = settings;

		// need to define next here because _track can call it
		this.next = bmoor.flow.window(() => {
			this.trigger('next', this);
		}, settings.windowMin||0, settings.windowMax||30);

		if (src){
			src.push = src.unshift = this.add.bind( this );

			src.forEach(datum => {
				this._track(datum);
			});
		}

		setUid(this);

		this.data = src;
	}

	_track(/*datum*/){
		// just a stub for now
	}

	_add(datum){
		oldPush.call(this.data, datum);

		this._track(datum);

		return datum;
	}

	add( datum ){
		if (!this.data){
			this.data = [];
		}

		const added = this._add(datum);

		this.next();

		return added;
	}

	consume( arr ){
		if (!this.data){
			this.data = [];
		}

		for (let i = 0, c = arr.length; i < c; i++){
			this._add(arr[i]);
		}

		this.next();
	}

	empty(){
		if (this.data){
			this.data.length = 0;
		}

		this.next();
	}

	go(parent){
		this.empty();

		this.consume(parent.data);
	}

	destroy(){
		this.data = null;
		this.disconnect();

		this.trigger('complete');
	}

	subscribe(onNext, onError, onComplete){
		let config = null;

		if (bmoor.isFunction(onNext)){
			config = {
				next: onNext,
				error: onError || function(){
					// anything for default?
				},
				complete: onComplete || function(){
					// anything for default?
				}
			};
		} else {
			config = onNext;
		}

		if (this.data && config.next){
			// make it act like a hot observable
			config.next(this);
		}

		return super.subscribe(config);
	}

	// return back a promise that is active on the 'next'
	promise(){
		if (this.next.active() || !this.data){
			if (this._promise){
				return this._promise;
			} else {
				this._promise = new Promise((resolve, reject) => {
					let next = null;
					let error = null;

					next = this.once('next', collection => {
						this._promise = null;

						error();
						resolve(collection);
					});
					error = this.once('error', ex => {
						this._promise = null;

						next();
						reject(ex);
					});
				});
			}

			return this._promise;
		} else {
			return Promise.resolve(this);
		}
	}

	follow(parent, settings){
		const disconnect = parent.subscribe(Object.assign(
			{
				next: (source) => {
					this.go(source);
				},
				complete: () => {
					this.destroy();
				},
				error: () => {
					// TODO : what to call?
				}
			},
			settings
		));

		if ( this.disconnect ){
			let old = this.disconnect;
			this.disconnect = function(){
				old();
				disconnect();
			};
		}else{
			this.disconnect = function(){
				disconnect();

				if (settings.disconnect){
					settings.disconnect();
				}
			};
		}
	}

	// I want to remove this
	sort( fn ){
		console.warn('Feed::sort, will be removed soon');
		this.data.sort( fn );
	}
}

module.exports = Feed;
