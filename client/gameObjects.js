function Drawable(){
};
Drawable.prototype = {
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

function SpawnPoint(x, y){
    this.x = x;
    this.y = y;
};
SpawnPoint.prototype = {
	color: "#FF7F50"
};

function Bomb(boxX, boxY, timer, radius, map){
    this.boxX = boxX;
    this.boxY = boxY;
    this.timer = timer;
    this.radius = radius;
    this.map = map;
    this.pdu = new BombPdu(this);
};
Bomb.prototype = {
	color: "#FF0000",
	isExploded: false,
    update: function(){
        if (this.timer < 1) {
        	console.log("BOOM");
			this.map.blow(this.boxX - 1, this.boxY);
			this.map.blow(this.boxX + 1, this.boxY);
			this.map.blow(this.boxX, this.boxY - 1);
			this.map.blow(this.boxX, this.boxY + 1);
			this.isExploded = true;
        }else{
        	this.timer--;
        }
    }
};

function Player(spawnPoint, map){
    this.x = spawnPoint.x;
    this.y = spawnPoint.y;
    this.map = map;
    this.pdu = new PlayerPdu(this);
};
Player.prototype = {
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
    	if(!this.bomb){
    		var boxX = this.map.toBoxX(this.x + (this.w / 2)),
        	boxY = this.map.toBoxY(this.y + (this.h / 2));
        	this.bomb = new Bomb(boxX, boxY, this.bombTimer,  this.bombRadius, this.map);
        	this.map.add(this.bomb, boxX, boxY);
    	}
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
            if(this.bomb.isExploded){
            	this.map.remove(this.bomb.boxX, this.bomb.boxY);
            	this.bomb = null;
            }
        }
        if(this.pdu){
        	this.pdu.update();
        }
    }
};
Player.prototype.__proto__ = Drawable.prototype;

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
PlayerPdu.prototype.__proto__ = Player.prototype;
