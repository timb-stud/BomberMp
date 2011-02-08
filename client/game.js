var GameSession = {
	url: "http://localhost:8124",
	session: null,
	init: function(){
		this.session = new Session(this.url, this.initHandler, this.msgHandler, this.userHandler);
		var sid = this.getSidFromUrl(),
			sp1 = new SpawnPoint(0,0),
			sp2 = new SpawnPoint(180,180);
			
		if(sid){
			Game.spawnPoint1 = sp2;
			Game.spawnPoint2 = sp1;
			this.session.join(sid);
		}else{
			Game.spawnPoint1 = sp1;
			Game.spawnPoint2 = sp2;
			this.session.create();
		}
	},
	initHandler: function(uid, sid){
		$("#urlBox").attr("value", this.session.getJoinUrl());
	},
	msgHandler: function(msg){
		switch(msg){
			case "up": Game.player2.moveUp(); break;
			case "down": Game.player2.moveDown(); break;
			case "left": Game.player2.moveLeft(); break;
			case "right": Game.player2.moveRight(); break;
		}
	},
	userHandler: function(action, uid){
		if(action == "join"){
			this.session.send("spawnPoint:2");
		}
	},
	getSidFromUrl: function(){
		var params = window.location.search,
		expr = /sid\=(\d{4})/,
		sid = 0;
		if(expr(params)){
			sid = expr(params)[1];
		}
		return sid;
	}
}

var Game = {
	ctx: null,
	w: 0,
	h: 0 ,
	player1: null,
	player2: null,
	spawnPoint1: null,
	spawnPoint2: null,
	walls: new Array(),
	keyPressed: {
		up: false,
		down: false,
		left: false,
		right: false
	},
	init: function(){
		GameSession.init();
		var canvas = $("#gameCanvas")[0];
		Game.w = canvas.width;
		Game.h = canvas.height;
		Game.ctx = canvas.getContext("2d");
		Game.walls.push(new Wall(50, 50));
		Game.walls.push(new Wall(50, 70));
		Game.walls.push(new Wall(50, 90));
		Game.walls.push(new Wall(70, 90));
		Game.walls.push(new Wall(90, 90));
		Game.walls.push(new Wall(90, 70));
		Game.walls.push(new Wall(90, 50));
		Game.player1 = new Player(Game.spawnPoint1, Game.walls);
		Game.player2 = new Player(Game.spawnPoint2, Game.walls, "#aabbcc");
		setInterval(Game.loop, 10);
	},
	loop: function(){
		Game.player1.animate();
		Game.player2.animate();
		Game.ctx.clearRect(0, 0, Game.w, Game.h);
		for(i=0; i< Game.walls.length; i++){
			Game.walls[i].draw(Game.ctx);
		}
		Game.player1.draw(Game.ctx);
		Game.player2.draw(Game.ctx);
		$("#status").html("keyPressed.up: " + Game.keyPressed.up
			+ "<br> keyPressed.down: " + Game.keyPressed.down
			+ "<br> keyPressed.left: " + Game.keyPressed.left
			+ "<br> keyPressed.right: " + Game.keyPressed.right);
		if(Game.keyPressed.up){ Game.player1.moveUp(); GameSession.send("up");}
		if(Game.keyPressed.down){ Game.player1.moveDown(); GameSession.send("down");}
		if(Game.keyPressed.left){ Game.player1.moveLeft(); GameSession.send("left");}
		if(Game.keyPressed.right){ Game.player1.moveRight(); GameSession.send("right");}
	}
};

function onKeyDown(evt) {
	if (evt.keyCode == 38){ Game.keyPressed.up = true;}
	if (evt.keyCode == 40){ Game.keyPressed.down = true;}
	if (evt.keyCode == 37){ Game.keyPressed.left = true;}
	if (evt.keyCode == 39){ Game.keyPressed.right = true;}
}

function onKeyUp(evt) {
	if (evt.keyCode == 38){ Game.keyPressed.up = false;}
	if (evt.keyCode == 40){ Game.keyPressed.down = false;}
	if (evt.keyCode == 37){ Game.keyPressed.left = false;}
	if (evt.keyCode == 39){ Game.keyPressed.right = false;}
	if (evt.keyCode == 32){ Game.player1.dropBomb();}
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);


$(document).ready(Game.init);
