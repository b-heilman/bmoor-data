
module.exports = {
	fn: function route(dex, parent, factory){
		let index = {};

		function get(key){
			var collection = index[key];

			if ( !collection ){
				collection = factory();
				index[key] = collection;
			}

			return collection;
		}

		function add(datum){
			get(dex.go(datum)).add(datum);
		}

		function go(){
			for (let k in index){
				index[k].empty();
			}

			for(let i = 0, c = parent.data.length; i < c; i++ ){
				add(parent.data[i]);
			}
		}

		return function makeRouter(){
			go();

			return {
				go,
				get: function( search ){
					return get(dex.parse(search));
				},
				keys: function(){
					return Object.keys( index );
				}
			};
		};
	}
};
