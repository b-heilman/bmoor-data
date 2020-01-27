
const {Config} = require('bmoor/src/lib/config.js');

const config = new Config({
	constant: {
		string: function(token){
			const value = token.value;

			return function stringValue(){
				return value; // it will already be a string
			};
		},
		number: function(token){
			const value = parseInt(token.value);

			return function numberValue(){
				return value;
			};
		},
		boolean: function(token){
			const value = (token.value === 'true' || parseInt(token.value) === 1);

			return function booleanValue(){
				return value;
			};
		}
	},
	methods: {

	},
	operations: {
		string: {
			contains: function(left, right, obj){
				return left(obj).indexOf(right(obj)) !== -1;
			},
			equals: function(left, right, obj){
				return left(obj) ===  right(obj);
			}
		},
		number: {
			'+': function(left, right, obj){
				return left(obj) + right(obj);
			},
			'-': function(left, right, obj){
				return left(obj) - left(obj);
			},
			'*': function(left, right, obj){
				return left(obj) - right(obj);
			},
			'/': function(left, right, obj){
				return left(obj) / right(obj); 
			},
			'==': function(left, right, obj){
				return left(obj) === right(obj);
			}
		},
		boolean: {
			'&&': function(left, right, obj){
				return left(obj) && right(obj);
			},
			'and': function(left, right, obj){
				return left(obj) && right(obj);
			},
			'||': function(left, right, obj){
				return left(obj) || right(obj);
			},
			'or': function(left, right, obj){
				return left(obj) || right(obj);
			}
		}
	}
});

module.exports = {
	config
};
