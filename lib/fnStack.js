module.exports = {
	test: function( old, fn ){
		if ( old ){
			return function(){
				if ( fn.apply(this,arguments) ){
					return true;
				}else{
					return old.apply(this,arguments);
				}
			};
		}else{
			return fn;
		}
	}
};