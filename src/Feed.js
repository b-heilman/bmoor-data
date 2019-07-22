
var bmoor = require('bmoor'),
	setUid = bmoor.data.setUid,
	oldPush = Array.prototype.push;

const DataSubject = require('./Subject').Subject;

// designed for one way data flows.
// src -> feed -> target
class Feed extends DataSubject {

	constructor(src, settings = {}){
		super(null, settings);

		let hot = false;
		if (src){
			hot = !!src.length || settings.hot; // if it's a length of 0, don't go hot
			src.push = src.unshift = this.add.bind( this );

			src.forEach(datum => {
				this._track(datum);
			});
		} else {
			src = [];
		}

		setUid(this);

		this.data = src;
		
		if (hot){
			this.next();
		}
	}
	/*
	next(){
		this._next();
	}
	*/
	_track(/*datum*/){
		// just a stub for now
	}

	_add(datum){
		oldPush.call(this.data, datum);

		this._track(datum);

		return datum;
	}

	add(datum){
		const added = this._add(datum);

		this._next();

		return added;
	}

	consume(arr){
		for (let i = 0, c = arr.length; i < c; i++){
			this._add(arr[i]);
		}

		this._next();
	}

	empty(){
		this.data.length = 0;

		this._next();
	}

	destroy(){
		this.data = null;
		this.complete();
	}
}

module.exports = Feed;
