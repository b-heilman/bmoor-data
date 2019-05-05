
module.exports = {
	fn: function(dex, parent, settings){
		const child = parent.makeChild(settings);

		child.go = function(){
			var arr = parent.data;

			child.empty();

			if ( settings.before ){
				settings.before();
			}

			for ( let i = 0, c = arr.length; i < c; i++ ){
				let datum = arr[i];
				
				child.add(dex.go(datum));
			}

			if ( settings.after ){
				settings.after();
			}
		};

		child.go();

		return child;
	}
};
