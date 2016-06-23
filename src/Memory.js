
class MemoryNode {
	construct(){
		this.prev = null;
		this.next = null;
	}

	detach(){
		if ( this.prev ){
			if ( this.next ){
				this.prev.next = this.next;
				this.next.prev = this.prev;
				this.next = null;
			}else{
				this.prev.next = null;
			}
			this.prev = null;
		} else if ( this.next ){
			this.next.prev = null;
			this.next = null;
		}
	}

	// insert myself before this node
	insertBefore( node ){
		this.detach();

		if ( node.prev ){
			this.prev = node.prev;
			this.prev.next = this;
		}

		node.prev = this;
		this.next = node;
	}

	insertAfter( node ){
		this.detach();

		if ( node.next ){
			this.next = node.next;
			this.next.prev = this;
		}

		node.next = this;
		this.prev = node;
	}
}

class Memory {
	constructor( hasher, limit, lifetime ){
		var unsets = {};

		this.index = {};
		this.limit = limit;
		this.length = 0;
		this.hasher = hasher;
		
		// tail should be oldest
		this.head = new MemoryNode();
		this.tail = new MemoryNode();

		this.tail.insertAfter( this.head );

		if ( lifetime ){
			this.govern = function( hash ){
				var clear = unsets[hash];

				if ( clear ){
					clearTimeout( clear );
				}

				unsets[hash] = setTimeout( () => {
					this.remove( this.index[hash].$datum );
				}, lifetime );
			};
		}else{
			this.govern = function(){};
		}
	}

	select( query ){
		var hash = this.hasher.hash(query);

		return this.index[hash];
	}

	get( dex ){
		var i,
			node = this.head.next;

		if ( dex > this.length ){
			dex = this.length;
		}

		for( i = 0; i < dex; i++ ){
			node = node.next;
		}

		return node.$datum;
	}

	first(){
		return this.head.next.$datum;
	}

	last(){
		return this.tail.prev.$datum;
	}

	insert( datum ){
		var hash = this.hasher.hash(datum),
			node = this.index[hash];

		if ( !node ){
			node = new MemoryNode();
			node.$datum = datum;

			this.index[hash] = node;
			if ( this.length === this.limit ){
				this.remove( this.tail.prev.$datum );
			}

			this.length++;
		}
		
		node.insertAfter( this.head );
		this.govern( hash );
	}

	remove( datum ){
		var hash = this.hasher.hash(datum),
			node = this.index[hash];

		if ( node ){
			this.length--;
			delete this.index[hash];
			node.detach();
		}
	}
}

module.exports = Memory;
