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
	set: function(obj, boxX, boxY){
                if(this.isInBounds(boxX, boxY)){
                    this.array[boxX][boxY] = obj;
                }
	},
	get: function(boxX, boxY){
		if(!this.isInBounds(boxX, boxY)){
			return null
		}
		return this.array[boxX][boxY];
	},
	remove: function(boxX, boxY){
		if(!this.isInBounds(boxX, boxY)){
			return null;
		}
		var o = this.array[boxX][boxY];
		this.array[boxX][boxY] = null;
		return o;
	},
	isInBounds: function(boxX, boxY){
		return (boxX >= 0 && boxY >= 0 && boxX < this.array.length && boxY < this.array[0].length);
	},
	drawRect: function(ctx, fillStyle, x, y, w, h){
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
    },
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
	toBoxX: function(posX){
		return Math.floor(posX / this.boxW);
	},
	toBoxY: function(posY){
		return Math.floor(posY / this.boxH);
	},
	isEmpty: function(boxX, boxY){
		if(!this.isInBounds(boxX, boxY)){
			return false;
		}
		return (this.array[boxX][boxY] == null);
	}
}
