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
	this.isLeftOf = function(go){
		return this.x + this.w < go.x;
	};
		this.isAbove = function(go){
		return this.y + this.h < go.y;
	};
	this.draw = function(ctx){
		drawRect(ctx, "#8B4513", this.x, this.y, this.w, this.h);
	};
};

var Bomb = function(x, y, radius, walls){
	this.w = 20;
	this.h = 20;
	this.x = x;
	this.y = y;
	this.isLeftOf = function(go){
		return this.x + this.w < go.x;
	};
		this.isAbove = function(go){
		return this.y + this.h < go.y;
	};
	this.explode = function(){
		for(i=1; i <= radius;i++){
			
		}
	};
	this.draw = function(ctx){
		drawRect(ctx, "#FF0000", this.x, this.y, this.w, this.h);
	};
};

var Player = function(x, y, walls){
	this.x = x;
	this.y = y;
	this.w = 20;
	this.h = 20;
	var bomb = null,
		bombRadius = 2,
		bombTimer = 2000,
		steps = 2 ;
	
	this.isLeftOf = function(go){
		return this.x + this.w < go.x;
	};
	this.isAbove = function(go){
		return this.y + this.h < go.y;
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
				console.log("touches");
				this.x = xTmp;
				this.y = yTmp;
				return;
			}
		}
	};
	this.moveUp = function(){
		this.moveTo(this.x, this.y - 1);
	};
	this.moveDown = function(){
		this.moveTo(this.x, this.y + 1);
	};
	this.moveLeft = function(){
		this.moveTo(this.x - 1, this.y);
	};
	this.moveRight = function(){
		this.moveTo(this.x + 1, this.y);
	};
	this.dropBomb = function(){
		bomb = new Bomb(this.x, this.y, bombRadius, walls);
		setTimeout(this.explodeBomb, bombTimer);
	};
	this.explodeBomb = function(){
		bomb.explode();
		bomb = null;
	};
	this.draw = function(ctx){
		drawRect(ctx, "#97FFFF", this.x, this.y, this.w, this.h);
		if(bomb){
			bomb.draw(ctx);
		}
	};
};
