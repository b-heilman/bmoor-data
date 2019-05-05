
module.exports = {
	memorized: function (parent, cache, expressor, generator, settings){
		var rtn,
			index,
			oldDisconnect;

		if (!parent[cache]){
			parent[cache] = {};
		}

		index = parent[cache];

		rtn = index[expressor.hash];

		if (!rtn){
			if (!settings){
				settings = {};
			}

			if (settings.disconnect){
				oldDisconnect = settings.disconnect;
			}

			settings.disconnect = function(){
				if ( oldDisconnect ){
					oldDisconnect();
				}

				index[expressor.hash] = null;
			};

			rtn = generator(expressor, parent, settings);

			index[expressor.hash] = rtn;
		}

		return rtn;
	}
};
