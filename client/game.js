/*
	author: Tim Bartsch
*/
/*
	GameSession: represents a game session between two players.
*/
var GameSession = {
    url: "http://localhost:8124",	//customize this url to your server settings
    session: null,
    /*
    	init: decides if the user is joining a game or creating a new one
    */
    init: function(){
        this.session = new Session(this.url, this.initHandler, this.msgHandler, this.userHandler);
        var sid = GameSession.getSidFromUrl();
        if (sid >= 0) {
            GameSession.isCreator = false;
            GameSession.session.join(sid);
        }else {
            GameSession.isCreator = true;
            GameSession.session.create();
        }
    },
    /*
    	to be called after the init
    */
    initHandler: function(uid, sid){
    	var url = GameSession.session.getJoinUrl();
        $("#urlBox").attr("value", url);
    },
    /*
    	handles all incoming messages
    */
    msgHandler: function(json){
		if(json.timer){ //isBomb
	    	var bomb = new Bomb(json.boxX, json.boxY, json.timer, json.radiusMax, Game.map);
	    	Game.pdu.bomb = bomb;
	    	Game.map.set(bomb, bomb.boxX, bomb.boxY);
		}else{
			if(json.mv){ //is movement
				switch(json.mv){
					case "left":
						Game.pdu.moveLeft();
						break;
					case "right":
						Game.pdu.moveRight();
						break;
					case "up":
						Game.pdu.moveUp();
						break;
					case "down":
						Game.pdu.moveDown();
						break;
				}
			}else{
				if(json.px){ //is sync
					Game.pdu.x = json.px;
					Game.pdu.y = json.py;
				}
			}
		}
    },
    /*
    	handles new users
    */
    userHandler: function(action, uid){
    },
    /*
    	returns the sid if there is one in the url
    */
    getSidFromUrl: function(){
        var params = window.location.search,
         	expr = /sid\=(\d+)/;
        if (expr(params)) {
            return expr(params)[1];
        }
    },
    /*
    	send a movement to the other player
    */
    sendMovement: function(mv){
    	var json = {
    		'mv': mv
    	};
    	var msg = JSON.stringify(json);
		GameSession.session.send(msg);
    },
    /*
    	send a bomb to the other player
    */
    sendBomb: function(bomb){
		if(bomb){
	  		var json = {
				boxX: bomb.boxX,
				boxY: bomb.boxY,
				timer: bomb.timer,
				radiusMax: bomb.radiusMax
	    	};
	    	var msg = JSON.stringify(json);
	   		GameSession.session.send(msg);
		}
    },
    /*
    	send a sync to the other player
    */
    sendSync: function(player){
    	var json = {
    		px: player.x,
    		py: player.y
    	};
    	var msg = JSON.stringify(json);
    	GameSession.session.send(msg);
    }
}
/*
	Game: represents the Bomberman game
*/
var Game = {
    ctx: null,
    w: 0,
    h: 0,
    map: null,
    player: null,
    pdu: null,	//this is the other player
    spawnPoint1: new SpawnPoint(0, 0),
    spawnPoint2: new SpawnPoint(240, 120),
    keyPressed: {
        up: false,
        down: false,
        left: false,
        right: false,
        bomb: false
    },
    /*
    	intit: intializes the Game objects
    */
    init: function(){
        var canvas = $("#gameCanvas")[0];
        Game.w = canvas.width;
        Game.h = canvas.height;
        Game.ctx = canvas.getContext("2d");
        Game.initMap();
        GameSession.init();
        if (GameSession.isCreator) {
            Game.player = new Player(Game.spawnPoint1, Game.map);
            Game.pdu = new PlayerPdu(Game.spawnPoint2, Game.map);
        }
        else {
            Game.player = new Player(Game.spawnPoint2, Game.map);
            Game.pdu = new PlayerPdu(Game.spawnPoint1, Game.map);
        }
        Game.map.player = Game.player;
        Game.map.pdu = Game.pdu;
        setInterval(Game.loop, 30);
        setInterval(Game.sync, 1000);
    },
    /*
    	loop: Gameloop which updates and draws the game
    */
    loop: function(){
        Game.player.update();
        Game.pdu.update();
		Game.ctx.clearRect(0, 0, Game.w, Game.h);
      	Game.map.draw(Game.ctx);
        Game.player.draw(Game.ctx);
        Game.pdu.draw(Game.ctx);
        if (Game.keyPressed.up) {
            if(Game.player.moveUp()){
            	GameSession.sendMovement("up");
            }
        }
        if (Game.keyPressed.down) {
            if(Game.player.moveDown()){
            	GameSession.sendMovement("down");
            }
        }
        if (Game.keyPressed.left) {
            if(Game.player.moveLeft()){
            	GameSession.sendMovement("left");
            }
        }
        if (Game.keyPressed.right) {
            if(Game.player.moveRight()){
            	GameSession.sendMovement("right");
            }
        }
        if(Game.keyPressed.bomb) {
	    	var bomb = Game.player.dropBomb();
	    	GameSession.sendBomb(bomb);
        }
        $("#fragsY").html(Game.player.frags);
        $("#killsY").html(Game.player.kills);
        $("#fragsO").html(Game.pdu.frags);
        $("#killsO").html(Game.pdu.kills);
    },
    /*
    	sync: sync the game
    */
    sync: function(){
    	GameSession.sendSync(Game.player);
    },
    /*
    	initMaP: creates the maps
    */
    initMap: function(){
    	Game.map = new Map(Game.w / 20, Game.h / 20);
        
        Game.map.set(new SolidWall(), 1, 1 );
        Game.map.set(new SolidWall(), 1, 3 );
        Game.map.set(new SolidWall(), 1, 5 );
        Game.map.set(new SolidWall(), 3, 1 );
        Game.map.set(new SolidWall(), 3, 3 );
        Game.map.set(new SolidWall(), 3, 5 );
        
        Game.map.set(new SolidWall(), 5, 1 );
        Game.map.set(new SolidWall(), 5, 3 );
        Game.map.set(new SolidWall(), 5, 5 );
        Game.map.set(new SolidWall(), 7, 1 );
        Game.map.set(new SolidWall(), 7, 3 );
        Game.map.set(new SolidWall(), 7, 5 );
        
        Game.map.set(new SolidWall(), 9, 1 );
        Game.map.set(new SolidWall(), 9, 3 );
        Game.map.set(new SolidWall(), 9, 5 );
        Game.map.set(new SolidWall(), 11, 1 );
        Game.map.set(new SolidWall(), 11, 3 );
        Game.map.set(new SolidWall(), 11, 5 );
        
        Game.map.set(new Wall(), 1, 0);
        Game.map.set(new Wall(), 3, 0);
        Game.map.set(new Wall(), 4, 0);
        Game.map.set(new Wall(), 6, 0);
        Game.map.set(new Wall(), 10, 0);
        Game.map.set(new Wall(), 12, 0);
        Game.map.set(new Wall(), 2, 1);
        Game.map.set(new Wall(), 6, 1);
        Game.map.set(new Wall(), 8, 1);
        Game.map.set(new Wall(), 1, 2);
        Game.map.set(new Wall(), 5, 2);
        Game.map.set(new Wall(), 7, 2);
        Game.map.set(new Wall(), 3, 2);
        Game.map.set(new Wall(), 4, 2);
        Game.map.set(new Wall(), 11, 2);
        Game.map.set(new Wall(), 8, 3);
        Game.map.set(new Wall(), 2, 3);
        Game.map.set(new Wall(), 4, 3);
        Game.map.set(new Wall(), 1, 4);
        Game.map.set(new Wall(), 4, 4);
        Game.map.set(new Wall(), 8, 4);
        Game.map.set(new Wall(), 11, 4);
        Game.map.set(new Wall(), 0, 5);
        Game.map.set(new Wall(), 4, 5);
        Game.map.set(new Wall(), 6, 5);
        Game.map.set(new Wall(), 10, 5);
        Game.map.set(new Wall(), 1, 6);
        Game.map.set(new Wall(), 5, 6);
        Game.map.set(new Wall(), 8, 6);
        Game.map.set(new Wall(), 10, 6);
        Game.map.set(new Wall(), 11, 6);
    }
};

/*
	onKeyDown: onKeyDown handler
*/
function onKeyDown(evt){
	switch(evt.keyCode){
		case 32:
			Game.keyPressed.bomb = true;
			break;
		case 37:
			Game.keyPressed.left = true;
			break;
		case 38:
			Game.keyPressed.up = true;
			break;
		case 39:
			Game.keyPressed.right = true;
			break;
		case 40:
			Game.keyPressed.down = true;
			break;
	}
}

/*
	onKeyUp: onKeyUp handler
*/
function onKeyUp(evt){
	switch(evt.keyCode){
		case 32:
			Game.keyPressed.bomb = false;
			break;
		case 37:
			Game.keyPressed.left = false;
			break;
		case 38:
			Game.keyPressed.up = false;
			break;
		case 39:
			Game.keyPressed.right = false;
			break;
		case 40:
			Game.keyPressed.down = false;
			break;
	}
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

$(document).ready(Game.init);
