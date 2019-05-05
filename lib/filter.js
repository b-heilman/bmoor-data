
module.exports = {
	fn: function(dex, parent, settings){
		return parent.makeChild(settings, function(){
			this.empty();

			if (parent.data){
				if (settings.before){
					settings.before();
				}

				parent.data.forEach(datum => {
					if (dex.go(datum)){
						this.add(datum);
					}
				});

				if (settings.after){
					settings.after();
				}
			}

			this.next();
		});
	}
};
