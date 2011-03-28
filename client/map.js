/*
	author: Tim Bartsch
	
	Map: Represents a "bomberman" map. The map is built with an two dimensional array.
	Each array element represents a box on which can be a Wall SolidWall bomb or other game element.
*/
function Map(dimX, dimY){
	this.array = new Array(dimX);
	for(var i = 0; i < dimX; i++){
		this.array[i] = new Array(dimY);
		for(var j = 0; j < dimY; j++){
			this.array[i][j] = null;
		}
	}
}
Map.prototype ={
	boxH: 20,
	boxW: 20,
	/*
		sets an object to the given coordinates.
	*/
	set: function(obj, boxX, boxY){
                if(this.isInBounds(boxX, boxY)){
                    this.array[boxX][boxY] = obj;
                }
	},
	/*
		returns the object located on the given coordinates.
	*/
	get: function(boxX, boxY){
		if(!this.isInBounds(boxX, boxY)){
			return null
		}
		return this.array[boxX][boxY];
	},
	/*
		removes the object from the given coordinates.
	*/
	remove: function(boxX, boxY){
		if(!this.isInBounds(boxX, boxY)){
			return null;
		}
		var o = this.array[boxX][boxY];
		this.array[boxX][boxY] = null;
		return o;
	},
	/*
		returns: 
				true 	if boxX and boxY are valid coordinates
				false 	if boxX and boxY are invalid coordinates
	*/
	isInBounds: function(boxX, boxY){
		return (boxX >= 0 && boxY >= 0 && boxX < this.array.length && boxY < this.array[0].length);
	},
	/*
		draws a rectangle on the given ctx object.
	*/
	drawRect: function(ctx, fillStyle, x, y, w, h){
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
    },
	/*
		draws all objects on the map with a color on the given ctx object.
	*/
	draw: function(ctx){
		for(var x = 0; x < this.array.length; x++){
			for(var y = 0; y < this.array[0].length; y++){
			var go = this.array[x][y];
				if(go){
					this.drawRect(ctx, go.color, x * this.boxW, y * this.boxH, this.boxW, this.boxH);
				}
			}
		}
	},
	/*
		transforms pixel position to boxX position
	*/
	toBoxX: function(posX){
		return Math.floor(posX / this.boxW);
	},
	/*
		transforms pixel position to boxY position
	*/
	toBoxY: function(posY){
		return Math.floor(posY / this.boxH);
	},
	/*
		returns: 
				true 	if the box is empty
				false 	if the box is not empty
	*/
	isEmpty: function(boxX, boxY){
		if(!this.isInBounds(boxX, boxY)){
			return false;
		}
		return (this.array[boxX][boxY] == null);
	}
}
