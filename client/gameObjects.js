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
            var leftBoxX = this.boxX - this.radiusLeft,
            	rightBoxX = this.boxX + this.radiusRight,
            	upBoxY = this.boxY - this.radiusUp,
            	downBoxY = this.boxY + this.radiusDown,
            	left = this.map.get(leftBoxX, this.boxY),
                right = this.map.get(rightBoxX, this.boxY),
                up = this.map.get(this.boxX, upBoxY),
                down = this.map.get(this.boxX, downBoxY),
                playerBoxX = this.map.toBoxX(this.map.player.x),
                playerBoxY = this.map.toBoxY(this.map.player.y),
                pduBoxX = this.map.toBoxX(this.map.pdu.x),
                pduBoxY = this.map.toBoxY(this.map.pdu.y);
            if(!this.leftDone){
                if(left instanceof Wall){
                    this.map.set(new Fire(), leftBoxX, this.boxY);
		    		this.radiusLeft++;
                    this.leftDone = true;
                }
                if(playerBoxX == leftBoxX && this.boxY == playerBoxY){
                	this.map.set(new Fire(), leftBoxX, this.boxY);
		    		this.radiusLeft++;
                	this.map.player.kill();
                	this.leftDone = true;
                }
                if(pduBoxX == leftBoxX && this.boxY == pduBoxY){
                	this.map.set(new Fire(), leftBoxX, this.boxY);
		    		this.radiusLeft++;
                	this.map.pdu.kill();
                	this.leftDone = true;
                }
                if(!left){
                    this.map.set(new Fire(), leftBoxX, this.boxY)
                    this.radiusLeft++;
                }
                if(this.radiusLeft > this.radiusMax || left instanceof SolidWall || left instanceof Bomb){
                    this.leftDone = true;
                }
            }
            if(!this.rightDone){
                if(right instanceof Wall){
                    this.map.set(new Fire(), rightBoxX, this.boxY);
		    		this.radiusRight++;
                    this.rightDone = true;
                }
                if(playerBoxX == rightBoxX && this.boxY == playerBoxY){
                	this.map.set(new Fire(), rightBoxX, this.boxY);
		    		this.radiusRight++;
                	this.map.player.kill();
                	this.rightDone = true;
                }
                if(pduBoxX == rightBoxX && this.boxY == pduBoxY){
                	this.map.set(new Fire(), rightBoxX, this.boxY);
		    		this.radiusRight++;
                	this.map.pdu.kill();
                	this.rightDone = true;
                }
                if(!right){
                    this.map.set(new Fire(), rightBoxX, this.boxY);
                    this.radiusRight++;
                }
                if(this.radiusRight > this.radiusMax || right instanceof SolidWall || right instanceof Bomb){
                    this.rightDone = true;
                }
            }
            if(!this.upDone){
                if(up instanceof Wall){
                    this.map.set(new Fire(), this.boxX, upBoxY);
		    		this.radiusUp++;
                    this.upDone = true;
                }
                if(playerBoxX == this.boxX && upBoxY == playerBoxY){
                	this.map.set(new Fire(), this.boxX, upBoxY);
		    		this.radiusUp++;
                	this.map.player.kill();
                	this.upDone = true;
                }
                if(pduBoxX == this.boxX && upBoxY == pduBoxY){
                	this.map.set(new Fire(), this.boxX, upBoxY);
		    		this.radiusUp++;
                	this.map.pdu.kill();
                	this.upDone = true;
                }
                if(!up){
                    this.map.set(new Fire(), this.boxX, upBoxY);
                    this.radiusUp++;
                }
                if(this.radiusUp > this.radiusMax || up instanceof SolidWall || up instanceof Bomb){
                    this.upDone = true;
                }
            }
            if(!this.downDone){
                if(down instanceof Wall){
                    this.map.set(new Fire(), this.boxX, downBoxY);
		    		this.radiusDown++;
                    this.downDone = true;
                }
                if(playerBoxX == this.boxX && downBoxY == playerBoxY){
                	this.map.set(new Fire(), this.boxX, downBoxY);
		    		this.radiusDown++;
                	this.map.player.kill();
                	this.downDone = true;
                }
                if(pduBoxX == this.boxX && downBoxY == pduBoxY){
                	this.map.set(new Fire(), this.boxX, downBoxY);
		    		this.radiusDown++;
                	this.map.pdu.kill();
                	this.downDone = true;
                }
                if(!down){
                    this.map.set(new Fire(), this.boxX, downBoxY);
                    this.radiusDown++;
                }
                if(this.radiusDown > this.radiusMax || down instanceof SolidWall || down instanceof Bomb){
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
};
Player.prototype = {
	frags: 0,
	kills: 0,
	pxCounter: 0,
	vMax: 2,
	color: "#0000FF",
	bomb: null,
	bombRadius: 2,
	bombTimer: 50,
	move: null,
	moveUp: function(){
		var boxX = this.map.toBoxX(this.x),
    		boxY = this.map.toBoxY(this.y);
		if(!this.move && this.map.isEmpty(boxX, boxY - 1)){
			this.move = "up";
			return true;
		}
    },
    moveDown: function(){
    	var boxX = this.map.toBoxX(this.x),
    		boxY = this.map.toBoxY(this.y);
        if(!this.move && this.map.isEmpty(boxX, boxY + 1)){
			this.move = "down";
			return true;
		}
    },
    moveLeft: function(){
    	var boxX = this.map.toBoxX(this.x),
    		boxY = this.map.toBoxY(this.y);
        if(!this.move && this.map.isEmpty(boxX - 1, boxY)){
			this.move = "left";
			return true;
		}
    },
    moveRight: function(){
    	var boxX = this.map.toBoxX(this.x),
    		boxY = this.map.toBoxY(this.y);
        if(!this.move && this.map.isEmpty(boxX + 1 , boxY)){
			this.move = "right";
			return true;
		}
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
    	if(this.move){
    		switch(this.move){
    			case "up":
    				this.y -= this.vMax;
    				this.updatePxCounter();
    				break;
    			case "down":
    				this.y += this.vMax;
    				this.updatePxCounter();
    				break;
    			case "left":
    				this.x -= this.vMax;
    				this.updatePxCounter();
    				break;
    			case "right":
    				this.x += this.vMax;
    				this.updatePxCounter();
    				break;
    		}
    	}
        if (this.bomb) {
            this.bomb.update();
            if(this.bomb.isExploded()){
            	this.map.remove(this.bomb.boxX, this.bomb.boxY);
            	this.bomb = null;
            }
        }
    },
    updatePxCounter: function(){
    	this.pxCounter += this.vMax;
		if(this.pxCounter >= 20){
    		this.move = null;
    		this.pxCounter = 0;
    	}
    },
    kill: function(){
    	if(this instanceof Player){
    		this.kills++;
    		this.map.pdu.frags++;
    	}
    }
};
Player.prototype.__proto__ = Drawable.prototype;

function PlayerPdu(spawnPoint, map){
    this.x = spawnPoint.x;
    this.y = spawnPoint.y;
    this.map = map;
    this.color = "00FF00";
};
PlayerPdu.prototype = {
	kill: function(){
		this.kills++;
		this.map.player.frags++;
	}
}
PlayerPdu.prototype.__proto__ = Player.prototype;
