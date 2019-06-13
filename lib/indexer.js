
module.exports = {
	fn: function indexer(dex, parent){
		let index = null;

		function makeIndex(){
			index = {};

			if (parent.data){
				for( let i = 0, c = parent.data.length; i < c; i++ ){
					let datum = parent.data[i],
						key = dex.go(datum);

					index[key] = datum;
				}
			}
		}

		makeIndex();

		let disconnect = parent.subscribe({
			next: makeIndex
		});

		return {
			go: makeIndex,
			get: function( search ){
				var key = dex.parse(search);
				return index[ key ];
			},
			keys: function(){
				return Object.keys( index );
			},
			disconnect: function(){
				disconnect();
			}
		};
	}
};
