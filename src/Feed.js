// TODO : test

var bmoor = require('bmoor'),
	setUid = bmoor.data.setUid,
	oldPush = Array.prototype.push,
	Observable = bmoor.Observable;

// designed for one way data flows.
// src -> feed -> target
class Feed extends Observable {

	constructor(src, settings = {}){
		super(settings);

		let hot = false;
		if (src){
			hot = true;
			src.push = src.unshift = this.add.bind( this );

			src.forEach(datum => {
				this._track(datum);
			});
		} else {
			src = [];
		}

		setUid(this);

		this.data = src;
		this.parents = [];

		if (hot){
			this.next();
		}
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
		const added = this._add(datum);

		this.goHot();

		return added;
	}

	consume( arr ){
		for (let i = 0, c = arr.length; i < c; i++){
			this._add(arr[i]);
		}

		this.goHot();
	}

	empty(){
		this.data.length = 0;

		this.goHot();
	}

	go(){
		// only rerun if this has parents, otherwise go does nothing
		if (this.parents.length){
			this.empty();

			// definitely not performance friendly, not caring which parent
			// triggered and brute forcing
			this.parents.forEach(parent => {
				this.consume(parent.data);
			});
		} else {
			this.next();
		}
	}

	next(){
		super.next(this.data);
	}

	goHot(){
		this.next();
	}

	destroy(){
		this.data = null;
		this.disconnect();
	}

	follow(parent, settings){
		this.parents.push(parent);

		let disconnect = null;
		const parentDisconnect = parent.subscribe(Object.assign(
			{
				next: (source) => {
					this.go(source);
				},
				complete: () => {
					disconnect();

					if (!this.parents.length){
						this.destroy();
					}
				}
			},
			settings
		));

		disconnect = () => {
			bmoor.array.remove(this.parents, parent);

			parentDisconnect();

			if (settings.disconnect){
				settings.disconnect();
			}
		};

		if ( this.disconnect ){
			let old = this.disconnect;
			this.disconnect = function(){
				old();
				disconnect();
			};
		} else {
			this.disconnect = function(){
				disconnect();
			};
		}

		return parentDisconnect;
	}

	// I want to remove this
	sort( fn ){
		console.warn('Feed::sort, will be removed soon');

		this.data.sort( fn );
	}
}

module.exports = Feed;
