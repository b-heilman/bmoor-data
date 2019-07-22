
module.exports = {
	fn: function(dex, parent, settings){
		return function(data){
			if (settings.before){
				settings.before();
			}

			const rtn = data.slice(0);
			rtn.sort(dex.go);

			if (settings.after){
				settings.after();
			}

			return rtn;
		};
	}
};
