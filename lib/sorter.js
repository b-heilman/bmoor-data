
module.exports = {
	fn: function(dex, parent, settings){
		return parent.makeChild(settings, function(){
			this.empty();

			if (parent.data){
				if (settings.before){
					settings.before();
				}

				this.consume(parent.data);
				this.data.sort(dex.go);

				if (settings.after){
					settings.after();
				}
			}
		});
	}
};
