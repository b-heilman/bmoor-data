
module.exports = {
	fn: function(dex, parent, settings){
		return function(data){
			if ( settings.before ){
				settings.before();
			}

			const rtn = data.map(datum => dex.go(datum));

			if ( settings.after ){
				settings.after();
			}

			return rtn;
		};
	}
};
