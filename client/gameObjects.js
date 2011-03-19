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

function Fire(){
};
Fire.prototype = {
	color: "#FF0000"
}

function Bomb(boxX, boxY, timer, radius, map){
    this.boxX = boxX;
    this.boxY = boxY;
    this.timer = timer;
    this.radiusMax = radius;
    this.map = map;
};
Bomb.prototype = {
	color: "#000000",
	radiusLeft: 1,
	leftDone: false,
	radiusRight: 1,
	rightDone: false,
	radiusUp: 1,
	upDone: false,
	radiusDown: 1,
	downDone: false,
    update: function(){
        if (this.timer < 1) {
	    console.log("UPDATE");
            var left = this.map.get(this.boxX - this.radiusLeft, this.boxY),
                right = this.map.get(this.boxX + this.radiusRight, this.boxY),
                up = this.map.get(this.boxX, this.boxY - this.radiusUp),
                down = this.map.get(this.boxX, this.boxY + this.radiusDown);
            if(!this.leftDone){
                if(left instanceof Wall){
                    this.map.set(new Fire(), this.boxX - this.radiusLeft, this.boxY);
		    this.radiusLeft++;
                    this.leftDone = true;
                }
                if(!left){
                    this.map.set(new Fire(), this.boxX - this.radiusLeft, this.boxY)
                    this.radiusLeft++;
                }
                if(this.radiusLeft > this.radiusMax || left instanceof SolidWall){
                    this.leftDone = true;
                }
            }
            if(!this.rightDone){
                if(right instanceof Wall){
                    this.map.set(new Fire(), this.boxX + this.radiusRight, this.boxY);
		    this.radiusRight++;
                    this.rightDone = true;
                }
                if(!right){
                    this.map.set(new Fire(), this.boxX + this.radiusRight, this.boxY);
                    this.radiusRight++;
                }
                if(this.radiusRight > this.radiusMax || right instanceof SolidWall){
                    this.rightDone = true;
                }
            }
            if(!this.upDone){
                if(up instanceof Wall){
                    this.map.set(new Fire(), this.boxX, this.boxY - this.radiusUp);
		    this.radiusUp++;
                    this.upDone = true;
                }
                if(!up){
                    this.map.set(new Fire(), this.boxX, this.boxY - this.radiusUp);
                    this.radiusUp++;
                }
                if(this.radiusUp > this.radiusMax || up instanceof SolidWall){
                    this.upDone = true;
                }
            }
            if(!this.downDone){
                if(down instanceof Wall){
                    this.map.set(new Fire(), this.boxX, this.boxY + this.radiusDown);
		    this.radiusDown++;
                    this.downDone = true;
                }
                if(!down){
                    this.map.set(new Fire(), this.boxX, this.boxY + this.radiusDown);
                    this.radiusDown++;
                }
                if(this.radiusDown > this.radiusMax || down instanceof SolidWall){
                    this.downDone = true;
                }
            }
            if(this.isExploded()){
                for(var i = this.radiusLeft -1; i > 0; i--){
                    this.map.remove(this.boxX - i, this.boxY)
                }
                for(var i = this.radiusRight -1; i > 0; i--){
                    this.map.remove(this.boxX + i, this.boxY)
                }
                for(var i = this.radiusUp -1; i > 0; i--){
                    this.map.remove(this.boxX, this.boxY - i)
                }
                for(var i = this.radiusDown -1; i > 0; i--){
                    this.map.remove(this.boxX, this.boxY + i)
                }

            }
        }else{
            this.timer--;
        }
    },
    isExploded: function(){
        return this.leftDone && this.rightDone && this.upDone && this.downDone;
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
	color: "#0000FF",
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
        	this.map.set(this.bomb, boxX, boxY);
		return this.bomb;
    	}
    },
    update: function(){
    	var newX = this.x + this.vx,
    		newY = this.y + this.vy,
    		boxX = this.map.toBoxX(this.x + 10),
    		boxY = this.map.toBoxY(this.y + 10);
    	if(this.map.isEmpty(boxX + 1, boxY) && newX > this.x || (this.map.isEmpty(boxX - 1, boxY) && newX < this.x)){
    		this.x = newX;
    	}else{
    		this.x = boxX * 20;
    	}
    	if(this.map.isEmpty(boxX, boxY + 1) && newY > this.y || this.map.isEmpty(boxX, boxY - 1) && newY < this.y){
    		this.y = newY;
    	}else{
    		this.y = boxY * 20;
    	}
    	this.vx *= this.acx;
    	this.vy *= this.acy;
        if (this.bomb) {
            this.bomb.update();
            if(this.bomb.isExploded()){
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

function PlayerPdu(player, map){
    this.player = player;
    this.x = player.x;
    this.y = player.y;
    this.vx = player.vx;
    this.vy = player.vy;
    this.acx = player.acx;
    this.acy = player.acy;
    this.map = map;
}
PlayerPdu.prototype = {
    color: "#808080",
    bomb: null,
    update: function(){
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= this.acx;
        this.vy *= this.acy;
	if (this.bomb) {
	    this.bomb.update();
	    if(this.bomb.isExploded()){
		this.map.remove(this.bomb.boxX, this.bomb.boxY);
		this.bomb = null;
	    }
	}
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
