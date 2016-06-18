var bmoor = require('bmoor'),
	getUid = bmoor.data.getUid,
	Collection = require('./Collection.js');

function _insert( grid, datum ){
	var x, xc,
		y, yc,
		row,
		xMin,
		xMax,
		yMin,
		yMax,
		info = grid.index[getUid(datum)],
		box = info.getBox(datum);

	// I add one here because it will run to less than the max
	if ( box.xMin > box.xMax ){
		xMin = grid.xCalc(box.xMax);
		xMax = grid.xCalc(box.xMin);
	}else{
		xMin = grid.xCalc(box.xMin);
		xMax = grid.xCalc(box.xMax);
	}

	if ( box.yMin > box.yMax ){
		yMin = grid.yCalc(box.yMax);
		yMax = grid.yCalc(box.yMin);
	}else{
		yMin = grid.yCalc(box.yMin);
		yMax = grid.yCalc(box.yMax);
	}

	info.$old = {
		xMin: xMin,
		xMax: xMax,
		yMin: yMin,
		yMax: yMax
	};

	for( x = xMin, xc = xMax+1; x < xc; x++ ){
		grid._xDex[x].insert( datum );
		row = grid._grid[x];

		for( y = yMin, yc = yMax+1; y < yc; y++ ){
			row[y].insert( datum );
		}
	}

	for( y = yMin, yc = yMax+1; y < yc; y++ ){
		grid._yDex[y].insert( datum );
	}
}

class GridIndex {
	// config : { x : { min, max }, y : { min, max } }
	constructor( config, divisions, CollectionClass ){
		if ( !divisions ){
			divisions = 10;
		}

		this.config = config;
		this.CollectionClass = CollectionClass || Collection;
		this.reset( divisions );
	}

	reset( divisions ){
		var i, j,
			xMin,
			xMax,
			xDiff,
			yMin,
			yMax,
			yDiff,
			xDex = [],
			yDex = [],
			grid = [],
			config = this.config;
			
		if ( config.xMin > config.xMax ){
			xMin = config.xMax;
			xMax = config.xMin;
		}else{
			xMin = config.xMin;
			xMax = config.xMax;
		}
		xDiff = xMax - xMin;

		if ( config.yMin > config.yMax ){
			yMin = config.yMax;
			yMax = config.yMin;
		}else{
			yMin = config.yMin;
			yMax = config.yMax;
		}
		yDiff = yMax - yMin;

		for( i = 0; i < divisions; i++ ){
			grid.push([]);
			xDex.push( new this.CollectionClass() );
			yDex.push( new this.CollectionClass() );

			for( j = 0; j < divisions; j++ ){
				grid[i].push( new this.CollectionClass() );
			}
		}

		this.xCalc = function( x ){
			var t = Math.floor( ((x - xMin) / xDiff) * divisions );

			if ( t < 0 ){
				t = 0;
			}else if ( t >= divisions ){
				t = divisions-1;
			}

			return t;
		};

		this.yCalc = function( y ){
			var t = Math.floor( ((y - yMin) / yDiff) * divisions );

			if ( t < 0 ){
				t = 0;
			}else if ( t >= divisions ){
				t = divisions-1;
			}

			return t;
		};

		this.index = {};
		this._grid = grid;
		this._xDex = xDex;
		this._yDex = yDex;
	}

	insert( datum, getBox, xIntersect, yIntersect ){
		var info,
			uid = getUid( datum );
			
		if ( this.index[uid] ){
			info = this.index[uid];
		}else{
			this.index[uid] = info = {};
		}

		info.getBox = getBox;
		info.xIntersect = xIntersect;
		info.yIntersect = yIntersect;

		_insert( this, datum );
	}

	check( x, y ){
		var xDex = this.xCalc( x ),
			yDex = this.yCalc( y );
	
		return this._grid[xDex][yDex].$filter( (datum) => {
			var info = this.index[getUid(datum)];

			return info.xIntersect( datum, x ) && info.yIntersect( datum, y );
		});
	}

	checkX( x ){
		var xDex = this.xCalc( x );

		return this._xDex[xDex].$filter( (datum) => {
			var info = this.index[getUid(datum)];
			return info.xIntersect( datum, x );
		});
	}

	checkY( y ){
		var yDex = this.yCalc( y );

		return this._yDex[yDex].$filter( (datum) => {
			var info = this.index[getUid(datum)];
			return info.yIntersect( datum, y );
		});
	}
}

module.exports = GridIndex;