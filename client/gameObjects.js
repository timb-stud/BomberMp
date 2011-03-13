function GameObject(){
};
GameObject.prototype = {
	x: 0,
	y: 0,
	w: 20,
	h: 20,
	color: "#123456",
	drawRect: function(ctx, fillStyle, x, y, w, h){
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
    },
    draw: function(ctx){
        this.drawRect(ctx, this.color, this.x, this.y, this.w, this.h);
    },
    isLeftOf: function(go){
        return this.x + this.w <= go.x;
    },
    isAbove: function(go){
        return this.y + this.h <= go.y;
    },
    touches: function(go){
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
    }
};

var Wall = function(){
};
Wall.prototype = {
	color: "#8B4513"
};
function SolidWall(){
};
SolidWall.prototype = {
	color: "#c0c0c0"
}

var SpawnPoint = function(x, y){
    this.x = x;
    this.y = y;
};
SpawnPoint.prototype = {
	color: "#FF7F50"
};
SpawnPoint.prototype.__proto__ = GameObject.prototype;

function Bomb(x, y, timer, radius, map){
    this.x = x;
    this.y = y;
    this.timer = timer;
    this.radius = radius;
    this.map = map;
    this.pdu = new BombPdu(this);
};
Bomb.prototype = {
	color: "#FF0000",
    isExploded: function(){
    	return ;
    },
    update: function(){
        if (this.timer < 1) {
			var boxX = this.map.toBoxX(this.x),
				boxY = this.map.toBoxY(this.y);
			this.map.blow(boxX - 1, boxY);
			this.map.blow(boxX + 1, boxY);
			this.map.blow(boxX, boxY - 1);
			this.map.blow(boxX, boxY + 1);
        }else{
        	this.timer--;
        }
    },
    draw: function(ctx){
        this.drawRect(ctx, this.color, this.x, this.y, this.w, this.h);
    }
};
Bomb.prototype.__proto__ = GameObject.prototype;

var BombPdu = function(bomb){
	this.x = bomb.x;
    this.y = bomb.y;
    this.timer = bomb.timer;
    this.radius = bomb.radius;
    this.refresh = function(){
    	this.x = bomb.x;
    	this.y = bomb.y;
    	this.timer = bomb.timer;
    	this.radius = bomb.raduis;
    };
    this.isInEpsilon = function(){
    	return this.timer == bomb.timer;
    };
}
BombPdu.prototype = new Bomb;

function PlayerPdu(player){
	this.player = player;
    this.x = player.x;
    this.y = player.y;
    this.vx = player.vx;
    this.vy = player.vy;
    this.acx = player.acx;
    this.acy = player.acy;
}
PlayerPdu.prototype = {
	color: "#808080",
	update: function(){
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= this.acx;
        this.vy *= this.acy;
    },
    isInEpsilon: function(){
        var x = Math.abs(this.x - this.player.x),
        	y = Math.abs(this.y - this.player.y),
        	vx = Math.abs(this.vx - this.player.vx),
        	vy = Math.abs(this.vy - this.player.vy),
        	e = x + y + vx + vy;
        if (e > 3) {
            return false;
        }
        else {
            return true;
        }
    },
    refresh: function(){
        this.x = this.player.x;
        this.y = this.player.y;
        this.vx = this.player.vx;
        this.vy = this.player.vy;
        this.acx = this.player.acx;
        this.acy = this.player.acy;
    }
};
PlayerPdu.prototype.__proto__ = GameObject.prototype;

function Player(spawnPoint, map){
    this.x = spawnPoint.x;
    this.y = spawnPoint.y;
    this.map = map;
    this.pdu = new PlayerPdu(this);
};
Player.prototype = {
	w: 20,
	h: 20,
	vMax: 2,
	vx: 0,
	vy: 0,
	acx: 0.9,
	acy: 0.9,
	color: "#000000",
	bomb: null,
	bombRadius: 2,
	bombTimer: 50,
	moveUp: function(){
        this.vy = -this.vMax;
    },
    moveDown: function(){
        this.vy = this.vMax;
    },
    moveLeft: function(){
        this.vx = -this.vMax;
    },
    moveRight: function(){
        this.vx = this.vMax;
    },
    dropBomb: function(){
        var xMid = this.x;
        var yMid = this.y;
        xMid += Math.floor(this.w / 2);
        yMid += Math.floor(this.h / 2);
        var bombSpawnX = Math.floor(xMid / 20);
        var bombSpawnY = Math.floor(yMid / 20);
        bombSpawnX *= 20;
        bombSpawnY *= 20;
        this.bomb = new Bomb(bombSpawnX, bombSpawnY, this.bombTimer,  this.bombRadius, this.map);
    },
    update: function(){
    	var newX = this.x + this.vx,
    		newY = this.y + this.vy,
    		boxX = this.map.toBoxX(this.x + 10),
    		boxY = this.map.toBoxY(this.y + 10);
    	if(this.map.isFree(boxX + 1, boxY) && newX > this.x || (this.map.isFree(boxX - 1, boxY) && newX < this.x)){
    		this.x = newX;
    	}else{
    		this.x = boxX * 20;
    	}
    	if(this.map.isFree(boxX, boxY + 1) && newY > this.y || this.map.isFree(boxX, boxY - 1) && newY < this.y){
    		this.y = newY;
    	}else{
    		this.y = boxY * 20;
    	}
    	this.vx *= this.acx;
    	this.vy *= this.acy;

        if (this.bomb) {
            this.bomb.update();
            if(this.bomb.isExploded()){
            	this.bomb = null;
            }
        }
        if(this.pdu){
        	this.pdu.update();
        }
    },
    draw: function(ctx){
        this.drawRect(ctx, this.color, this.x, this.y, this.w, this.h);
        if (this.bomb) {
            this.bomb.draw(ctx);
        }
    }
};
Player.prototype.__proto__ = GameObject.prototype;
