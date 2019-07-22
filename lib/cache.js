
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

			if (settings.disconnect){
				oldDisconnect = settings.disconnect;
			}

			child = chainFn(generator(expressor, parent, settings));

			index[expressor.hash] = child;
		}

		return child;
	}
};
