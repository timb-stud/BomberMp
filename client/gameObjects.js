/*
	author: Tim Bartsch, Volkan Goekkaya
*/
/*
	Drawable: a Drawable object with a rectangle shape
*/
function Drawable(){
};
Drawable.prototype = {
	x: 0,
	y: 0,
	w: 20,
	h: 20,
	color: "#123456",
	/*
		drawRect: draws a rect on the ctx
	*/
	drawRect: function(ctx, fillStyle, x, y, w, h){
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
    },
    /*
		draw: the Drawable on the ctx
	*/
    draw: function(ctx){
        this.drawRect(ctx, this.color, this.x, this.y, this.w, this.h);
    }
};

/*
	A destroyable wall
*/
var Wall = function(){
};
Wall.prototype = {
	color: "#8B4513"
};

/*
	An undestroyable wall
*/
function SolidWall(){
};
SolidWall.prototype = {
	color: "#c0c0c0"
}

/*
	This is a position where a player can spawn
*/
function SpawnPoint(x, y){
    this.x = x;
    this.y = y;
};
SpawnPoint.prototype = {
	color: "#FF7F50"
};

/*
	Fire used by the bomb
*/
function Fire(){
};
Fire.prototype = {
	color: "#FF0000"
}

/*
	Bomb: after the timer runs out the bomb removes all destroyable walls and kills players in its radius 
*/
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
	/*
		update: looks if the timer is 0. If this is the case the bomb explodes and destroys walls and kills players
			and also plays a boom sound ;)
	*/
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
            	document.getElementById('bombExplosion').play();
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
    /*
    	returns:
    				true if the bomb is exploded
    				false if the bomb is not exploded
    */
    isExploded: function(){
        return this.leftDone && this.rightDone && this.upDone && this.downDone;
    }
};

/*
	Player: represantation of the local player with x and y position on screen
*/
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
	/*
		Moves the player one box up
	*/
	moveUp: function(){
		var boxX = this.map.toBoxX(this.x),
    		boxY = this.map.toBoxY(this.y);
		if(!this.move && this.map.isEmpty(boxX, boxY - 1)){
			this.move = "up";
			return true;
		}
    },
    /*
		Moves the player one box down
	*/
    moveDown: function(){
    	var boxX = this.map.toBoxX(this.x),
    		boxY = this.map.toBoxY(this.y);
        if(!this.move && this.map.isEmpty(boxX, boxY + 1)){
			this.move = "down";
			return true;
		}
    },
    /*
		Moves the player one box to the left
	*/
    moveLeft: function(){
    	var boxX = this.map.toBoxX(this.x),
    		boxY = this.map.toBoxY(this.y);
        if(!this.move && this.map.isEmpty(boxX - 1, boxY)){
			this.move = "left";
			return true;
		}
    },
    /*
		Moves the player one box to the right
	*/
    moveRight: function(){
    	var boxX = this.map.toBoxX(this.x),
    		boxY = this.map.toBoxY(this.y);
        if(!this.move && this.map.isEmpty(boxX + 1 , boxY)){
			this.move = "right";
			return true;
		}
    },
    /*
		Drops the bomb on the players position
	*/
    dropBomb: function(){
    	if(!this.bomb){
    		var boxX = this.map.toBoxX(this.x + (this.w / 2)),
        	boxY = this.map.toBoxY(this.y + (this.h / 2));
        	this.bomb = new Bomb(boxX, boxY, this.bombTimer,  this.bombRadius, this.map);
        	this.map.set(this.bomb, boxX, boxY);
			return this.bomb;
    	}
    },
    /*
    	updated the players movement
    */
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
    /*
    	updates the pixel Counter, used for movement
    */
    updatePxCounter: function(){
    	this.pxCounter += this.vMax;
		if(this.pxCounter >= 20){
    		this.move = null;
    		this.pxCounter = 0;
    	}
    },
    /*
    	Kills this player
    */
    kill: function(){
    	if(this instanceof Player){
    		this.kills++;
    		this.map.pdu.frags++;
    	}
    }
};
Player.prototype.__proto__ = Drawable.prototype;

/*
	PlayerPdu: representation of the opponten player
*/
function PlayerPdu(spawnPoint, map){
    this.x = spawnPoint.x;
    this.y = spawnPoint.y;
    this.map = map;
    this.color = "00FF00";
};
PlayerPdu.prototype = {
	/*
    	Kills this player
    */
	kill: function(){
		this.kills++;
		this.map.player.frags++;
	}
}
PlayerPdu.prototype.__proto__ = Player.prototype;
