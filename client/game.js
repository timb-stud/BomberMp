var GameSession = {
    url: "http://localhost:8124",
    session: null,
    init: function(){
        this.session = new Session(this.url, this.initHandler, this.msgHandler, this.userHandler);
        var sid = GameSession.getSidFromUrl();
        console.log(sid);
        if (sid >= 0) {
            GameSession.isCreator = false;
            GameSession.session.join(sid);
        }else {
            GameSession.isCreator = true;
            GameSession.session.create();
        }
    },
    initHandler: function(uid, sid){
        $("#urlBox").attr("value", GameSession.session.getJoinUrl());
        if (!GameSession.isCreator) {
            GameSession.sendPdu(Game.player.pdu);
        }
    },
    msgHandler: function(json){
	if(json.timer){ //isBomb
	    var bomb = new Bomb(json.boxX, json.boxY, json.timer, json.radiusMax, Game.map);
	    Game.pdu.bomb = bomb;
	    Game.map.set(bomb, bomb.boxX, bomb.boxY);
	}else{
	    if(!Game.pdu){
			Game.pdu = new PlayerPdu(json, Game.map);
	    }else{
			Game.pdu.x = json.x;
			Game.pdu.y = json.y;
			Game.pdu.vx = json.vx;
			Game.pdu.vy = json.vy;
			Game.pdu.acx = json.acx;
			Game.pdu.acy = json.acy;
	    }
	}
    },
    userHandler: function(action, uid){
        if (action == "join") {
            GameSession.sendPdu(Game.player.pdu);
        }
    },
    getSidFromUrl: function(){
        var params = window.location.search,
         	expr = /sid\=(\d+)/;
        if (expr(params)) {
            return expr(params)[1];
        }
    },
    sendPdu: function(pdu){
    	var json = {
    		x: pdu.x,
    		y: pdu.y,
    		vx: pdu.vx,
    		vy: pdu.vy,
    		acx: pdu.acx,
    		acy: pdu.acy
    	};
    	var msg = JSON.stringify(json);
		GameSession.session.send(msg);
    },
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
    }
}

var Game = {
    ctx: null,
    w: 0,
    h: 0,
    map: null,
    player: null,
    pdu: null,
    spawnPoint1: new SpawnPoint(0, 0),
    spawnPoint2: new SpawnPoint(240, 120),
    keyPressed: {
        up: false,
        down: false,
        left: false,
        right: false,
        bomb: false
    },
    init: function(){
        var canvas = $("#gameCanvas")[0];
        Game.w = canvas.width;
        Game.h = canvas.height;
        Game.ctx = canvas.getContext("2d");
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
        
        Game.map.set(new Wall(), 0, 2 );
        Game.map.set(new Wall(), 1, 2 );
        Game.map.set(new Wall(), 2, 2 );
        
     
        GameSession.init();
        if (GameSession.isCreator) {
            Game.player = new Player(Game.spawnPoint1, Game.map);
        }
        else {
            Game.player = new Player(Game.spawnPoint2, Game.map);
        }
        setInterval(Game.loop, 30);
    },
    loop: function(){
        Game.player.update();
        if (Game.pdu) {
            Game.pdu.update();
        }
        if (!Game.player.pdu.isInEpsilon()) {
            Game.player.pdu.refresh();
            GameSession.sendPdu(Game.player.pdu);
        }
		Game.ctx.clearRect(0, 0, Game.w, Game.h);
      	Game.map.draw(Game.ctx);
        Game.player.draw(Game.ctx);
        if (Game.pdu) {
            Game.pdu.draw(Game.ctx);
        }
        $("#status").html("keyPressed.up: " + Game.keyPressed.up +
        "<br> keyPressed.down: " +
        Game.keyPressed.down +
        "<br> keyPressed.left: " +
        Game.keyPressed.left +
        "<br> keyPressed.right: " +
        Game.keyPressed.right);
        if (Game.keyPressed.up) {
            Game.player.moveUp();
        }
        if (Game.keyPressed.down) {
            Game.player.moveDown();
        }
        if (Game.keyPressed.left) {
            Game.player.moveLeft();
        }
        if (Game.keyPressed.right) {
            Game.player.moveRight();
        }
        if(Game.keyPressed.bomb) {
	    	var bomb = Game.player.dropBomb();
	    	GameSession.sendBomb(bomb);
        }
    }
};

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
