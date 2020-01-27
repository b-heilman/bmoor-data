
const {Config} = require('bmoor/src/lib/config.js');
const {makeGetter} = require('bmoor/src/core.js');

const {config: opsConfig} = require('./config.js');

class Statement {
	constructor(type, method){
		this.type = type;
		this.method = method;
	}

	eval(...args){
		return this.method(...args);
	}

	prepare(){
		return (...args) => {
			return this.method(...args);
		};
	}

	toJSON(){
		return {type: this.type, method: this.method.name};
	}

	toString(){
		return `{"type":"${this.type}", "method":"${this.method.toString()}"}`;
	}
}

const config = new Config({
	accessor: function(token){
		const getter = makeGetter(token.path);

		return new Statement('access', getter);
	},

	constant: function(token){
		const loading = `constant.${token.type.toLowerCase()}`;
		const fn = opsConfig.get(loading);

		if (!fn){
			throw new Error('Unable to load constant: '+loading);
		}

		return new Statement('access', fn(token));
	},

	method: function(token){
		// TODO : yeah
		console.log('what do I do with this', token);
	},

	operation: function(token){
		const loading = `operations.${token.type.toLowerCase()}.${token.operator.toLowerCase()}`;
		const fn = opsConfig.get(loading);

		if (!fn){
			throw new Error('Unable to load constant: '+loading);
		}

		return new Statement('pair', fn);
	},

	join: function(token){
		const loading = `operations.boolean.${token.type.toLowerCase()}`;
		const fn = opsConfig.get(loading);

		if (!fn){
			throw new Error('Unable to load constant: '+loading);
		}

		return new Statement('pair', fn);
	}
});

module.exports = {
	config,
	Statement
};
