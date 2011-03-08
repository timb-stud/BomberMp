function Map(dimX, dimY){
	console.log("Map init", dimX, dimY);
	this.array = new Array(dimX);
	for(var i = 0; i < dimX; i++){
		this.array[i] = new Array(dimY);
	}
}
Map.prototype ={
	add: function(obj, x, y){
		this.array[x][y] = obj;
	},
	remove: function(x, y){
		var o = this.array[x][y];
		this.array[x][y] = null;
		return o;
	},
	drawRect: function(ctx, fillStyle, x, y, w, h){
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
    },
	draw: function(ctx){
		for(var i = 0; i < this.array.length; i++){
			for(var j=0; j< this.array[0].length; j++){
			var go = this.array[i][j];
				if(go){
					go.draw(ctx);
				}
			}
		}
	}
}
