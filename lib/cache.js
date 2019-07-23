
module.exports = {
	memorized: function (parent, cache, expressor, generator, chainFn, settings){
		var child,
			index,
			oldDisconnect;

		if (!parent[cache]){
			parent[cache] = {};
		}

		index = parent[cache];

		child = index[expressor.hash];

		if (!child){
			if (!settings){
				settings = {};
			}

			child = chainFn(generator(expressor, parent, settings));

			if (child.disconnect){
				oldDisconnect = child.disconnect;
			}

			child.disconnect = function(){
				if ( oldDisconnect ){
					oldDisconnect.call(child);
				}

				index[expressor.hash] = null;
			};

			index[expressor.hash] = child;
		}

		return child;
	}
};
