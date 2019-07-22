
module.exports = {
	fn: function indexer(dex, parent){
		let index = null;

		function go(){
			const data = parent.data;

			index = {};

			for(let i = 0, c = data.length; i < c; i++){
				let datum = data[i];
				let key = dex.go(datum);

				index[key] = datum;
			}
		}

		return function makeIndex(){
			go();

			return {
				go,
				get: function(search){
					return index[dex.parse(search)];
				},
				keys: function(){
					return Object.keys(index);
				}
			};
		};
	}
};
