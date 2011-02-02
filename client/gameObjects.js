var GameObject = function(x, y, w, h, color){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.color = color || "#ffffff";
	this.drawRect = function(ctx, fillStyle, x, y, w, h){
		ctx.fillStyle = fillStyle;
		ctx.beginPath();
		ctx.rect(x, y, w, h);
		ctx.closePath();
		ctx.fill();
	};
	this.draw = function(ctx){
		this.drawRect(ctx, this.color, this.x, this.y, this.w, this.h);
	};
	this.isLeftOf = function(go){
		return this.x + this.w < go.x;
	};
	this.isAbove = function(go){
		return this.y + this.h < go.y;
	};
	this.touches = function(go){
		if (this.isLeftOf(go)) {
			return false;
		}
		if (go.isLeftOf(this)) {
			return false;
		}
		if (this.isAbove(go)) {
			return false;
		}
		if (go.isAbove(this)) {
			return false;
		}
		return true;
	};
}

var Wall = function(x, y){
	this.x = x;
	this.y = y;
	this.w = 20;
	this.h = 20;
	this.color = "#8B4513";
	this.draw = function(ctx){
		this.drawRect(ctx, this.color, this.x, this.y, this.w, this.h);
	};
};
Wall.prototype = new GameObject;

var Bomb = function(x, y, radius, walls){
	this.x = x;
	this.y = y;
	this.w = 20;
	this.h = 20;
	this.color = "#FF0000";
	this.radius = radius;
	this.wMax = this.w * this.radius;
	this.hMax = this.h * this.radius;
	var leftRect = new GameObject(this.x, this.y, 0, this.h, this.color);
	var rightRect = new GameObject(this.x + this.w, this.y, 0, this.h, this.color);
	var upperRect = new GameObject(this.x, this.y, this.w, 0, this.color);
	var lowerRect = new GameObject(this.x, this.y + this.h, this.w, 0, this.color);
	var exploded = false;
	this.explode = function(){
		exploded = true;
	};
	this.animate = function(){
		if(exploded){
			if(leftRect.w < this.wMax){
				leftRect.w++;
				leftRect.x--;
			}
			if(rightRect.w < this.wMax){
				rightRect.w++;
			}
			if(upperRect.h < this.hMax){
				upperRect.h++;
				upperRect.y--;
			}
			if(lowerRect.h < this.hMax){
				lowerRect.h++;
			}
		}
	}
	this.draw = function(ctx){
		this.drawRect(ctx, "#FFF000", this.x, this.y, this.w, this.h);
		leftRect.draw(ctx);
		rightRect.draw(ctx);
		upperRect.draw(ctx);
		lowerRect.draw(ctx);
	};
};
Bomb.prototype = new GameObject;

var Player = function(x, y, walls){
	this.x = x;
	this.y = y;
	this.w = 20;
	this.h = 20;
	this.color = "#97FFFF";
	var bomb = null, bombRadius = 2, bombTimer = 2000, steps = 2;
	this.moveTo = function(x, y){
		var xTmp = this.x, yTmp = this.y;
		this.x = x;
		this.y = y;
		for (i = 0; i < walls.length; i++) {
			if (this.touches(walls[i])) {
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
		//        bomb = null;
	};
	this.animate = function(){
		if(bomb){
			bomb.animate();
		}
	}
	this.draw = function(ctx){
		this.drawRect(ctx, this.color, this.x, this.y, this.w, this.h);
		if (bomb) {
			bomb.draw(ctx);
		}
	};
};
Player.prototype = new GameObject;
