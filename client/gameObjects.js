function drawRect(ctx, fillStyle , x, y, w, h){
		ctx.fillStyle = fillStyle;
		ctx.beginPath();
		ctx.rect(x, y, w, h);
		ctx.closePath();
		ctx.fill();
	};
var GameObject = function(x, y, w, h){
	this.constructor = function(x, y, w, h){
		this.x = x;
		this.y = y;
		this.w = w || 20;
		this.h = h || 20;
	};
	this.constructor(x,y,w,h);
	this.drawRect = function(ctx, fillStyle , x, y, w, h){
		ctx.fillStyle = fillStyle;
		ctx.beginPath();
		ctx.rect(x, y, w, h);
		ctx.closePath();
		ctx.fill();
	};
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
}

var Wall = function(x, y){
	this.constructor(x, y);
	this.draw = function(ctx){
		this.drawRect(ctx, "#8B4513", this.x, this.y, this.w, this.h);
	};
};
Wall.prototype = new GameObject;

var Bomb = function(x, y, radius, walls){
	this.constructor(x, y);
	this.radius = radius;
	this.explode = function(){
		for(i=1; i <= radius;i++){
			
		}
	};
	this.draw = function(ctx){
		this.drawRect(ctx, "#FF0000", this.x, this.y, this.w, this.h);
	};
};
Bomb.prototype = new GameObject;

var Player = function(x, y, walls){
	this.constructor(x, y);
	var bomb = null,
		bombRadius = 2,
		bombTimer = 2000,
		steps = 2 ;
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
		this.drawRect(ctx, "#97FFFF", this.x, this.y, this.w, this.h);
		if(bomb){
			bomb.draw(ctx);
		}
	};
};
Player.prototype = new GameObject;
