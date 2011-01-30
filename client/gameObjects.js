function drawRect(ctx, fillStyle , x, y, w, h){
	ctx.fillStyle = fillStyle;
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.closePath();
	ctx.fill();
}

var Wall = function(x,y){
	this.x = x;
	this.y = y;
	this.w = 20;
	this.h = 20;
	this.draw = function(ctx){
		drawRect(ctx, "#8B4513", this.x * this.w, this.y * this.h, this.w, this.h);
	};
};

var Bomb = function(x, y, radius){
	var w = 20;
	var h = 20;
	this.x = x;
	this.y = y;
	this.explode = function(){
		for(i=1; i <= radius;i++){
			playground.remove(x + i, y);
			playground.remove(x - i, y);
			playground.remove(x, y + i);
			playground.remove(x, y - i);
			playground.remove(x, y);
		}
	};
	this.draw = function(ctx){
		drawRect(ctx, "#FF0000", x * w, y * h, w, h);
	};
};

var Player = function(x, y, walls){
	this.x = x;
	this.y = y;
	var w = 20,
		h = 20,
		bomb = null,
		bombRadius = 2,
		bombTimer = 2000,
		steps = 2 ;
	
	this.isLeftOf = function(go){
		return this.x + this.w < go.x;
	};
	this.isRightOf = function(go){
		return this.y < go.y + go.h;
	};
	this.touches = function(go){
		if(this.isLeftOf(go)){	return false;}
		if(go.isLeftOf(this)){	return false;}
		if(this.isAbove(go)){	return false;}
		if(go.isAbove(this)){	return false;}
		return true;
	};
	this.moveTo = function(x,y){
		var xTmp = this.x,
			yTmp = this.y;
		this.x = x;
		this.y = y;
		for(i=0; i < walls.length; i++){
			if(this.touches(walls[i])){
				this.x = xTmp;
				this.y = yTmp;
				return;
			}
		}
	};
	this.moveUp = function(){
		this.move(this.x, this.y - 1);
	};
	this.moveDown = function(){
		this.move(this.x, this.y + 1);
	};
	this.moveLeft = function(){
		this.move(this.x - 1, this.y);
	};
	this.moveRight = function(){
		this.move(this.x + 1, this.y);
	};
	this.dropBomb = function(){
		bomb = new Bomb(playground, this.x, this.y, bombRadius);
		setTimeout(this.explodeBomb, bombTimer);
	};
	this.explodeBomb = function(){
		bomb.explode();
		bomb = null;
	};
	this.draw = function(ctx){
		drawRect(ctx, "#97FFFF", rx, ry, w, h);
		if(bomb){
			bomb.draw(ctx);
		}
	};
};
