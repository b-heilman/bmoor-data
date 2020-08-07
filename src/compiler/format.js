
const {Config} = require('bmoor/src/lib/config.js');
const {makeGetter} = require('bmoor/src/core.js');

const {Token} = require('../expression/Token.js'); 
const {Expressable} = require('../expression/Expressable.js');
const {Compiler} = require('../expression/Compiler.js');

const escapeChar = '\\';

const config = new Config({});

const parsings = config.sub('parsings', {
	accessor: {
		open: function(master, pos, state){
			if (state.last !== escapeChar && master[pos] === '$' && master[pos+1] === '{'){
				return {
					pos: pos+2,
					begin: pos+2
				};
			}
		},
		close: function(master, pos, state){
			if (state.last !== escapeChar && master[pos] === '}'){
				return {
					pos: pos+1,
					end: pos-1
				};
			}
		},
		toToken: function(content){
			return new Token('accessor', content);
		}
	},
	constant: {
		open: function(master, pos){
			return {
				pos: pos,
				begin: pos
			};
		},
		close: function(master, pos, state){
			if (state.last !== escapeChar && master[pos] === '$' && master[pos+1] === '{'){
				return {
					pos: pos,
					end: pos-1
				};
			}
		},
		toToken: function(content){
			return new Token('constant', content);
		}
	}
});

const constants = config.sub('constants', {
	string: function(value){
		value = value+'';

		return function stringValue(){
			return value; // it will already be a string
		};
	}
});

const operations = config.sub('operations', {
	'concat': {
		fn: function concat(left, right, obj){
			return left(obj) + right(obj);
		},
		rank: 4
	}
});

const expressions = config.sub('expressions', {
	accessor: function(token){
		const getter = makeGetter(token.value);

		getter.name = 'getter:'+token.value;

		const rtn = [new Expressable('value', getter)];

		if (token.state.previous){
			const {fn, rank} = operations.get('concat');

			rtn.unshift(new Expressable('operation', fn, rank));
		}

		return rtn;
	},

	constant: function(token){
		const fn = constants.get('string');

		const rtn = [new Expressable('value', fn(token.value))];

		if (token.state.previous){
			const {fn, rank} = operations.get('concat');

			rtn.unshift(new Expressable('operation', fn, rank));
		}

		return rtn;
	}
});

const compiler = new Compiler(parsings, expressions);

module.exports = {
	config,
	compiler,
	expressions
};
