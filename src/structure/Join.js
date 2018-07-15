
class Join {
	constructor( type, begin, end, through ){
		this.type = type;
		this.path = [];

		let curr = {
				fromModel: begin.model,
				fromKey: begin.key
			};

		if ( through ){
			through.forEach( r => {
				curr.toModel = r.model;
				curr.toKey = r.incoming;

				this.path.push( curr );

				curr = {
					fromModel: r.model,
					fromKey: r.outgoing
				};
			});
		}
		
		curr.toModel = end.model;
		curr.toKey = end.key;

		this.path.push( curr );
	}
}

module.exports = {
	Join: Join
};
