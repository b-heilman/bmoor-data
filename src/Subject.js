
const bmoor = require('bmoor');
// const flowWindow = bmoor.flow.window;

const {ReplaySubject} = require('rxjs');

class Subject extends ReplaySubject {
	constructor(data, settings = {}){
		super(1);

		this.settings = settings;

		if (data){
			this.data = data;
		}

		const oldNext = this.next;
		this.next = () => {
			this._next();
		};
		this._next = /*flowWindow(*/() => {
			if (oldNext){
				oldNext.call(this, this.data);
			} else {
				super.next(this.data);
			}
		}/*, settings.windowMin||0, settings.windowMax||30)*/;
	}

	on(action, fn, errFn){
		if (action !== 'next'){
			throw new Error('bmoor-data::Feed - on - only allows next');
		}
			
		return this.subscribe(
			(data) => {
				setTimeout(() => {
					fn(data);
				}, 0);
			}, errFn || function(err){
				console.log('error', err);
			}
		);
	}

	once(action, fn, errFn){
		// TODO : reduce this to no action
		if (bmoor.isFunction(action)){
			errFn = fn;
			fn = action;
			action = 'next';
		}

		if (action !== 'next'){
			throw new Error('bmoor-data::Feed - once - only allows next');
		}

		const child = this.subscribe((data) =>{
			setTimeout(() => {
				if (child){
					child.unsubscribe();
				}

				return fn(data);
			}, 0);
		}, errFn || function(err){
			console.log('error', err);
		});

		return child;
	}

	callStack(fns, errFn){
		const child = this.subscribe((data) =>{
			fns.shift()(data);
		}, errFn || function(err){
			console.log('error', err);
		});

		return child;
	}

	promise(){
		return new Promise((resolve, reject) => {
			this.once(resolve, reject);
		});
	}
}

module.exports = {
	default: Subject,
	Subject
};
