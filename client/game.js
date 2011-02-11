var GameSession = {
	url: "http://localhost:8124",
	session: null,
	init: function(){
		this.session = new Session(this.url, this.initHandler, this.msgHandler, this.userHandler);
		var sid = GameSession.getSidFromUrl();
		if(sid){
			GameSession.isCreator = false;
			GameSession.session.join(sid);
		}else{
			GameSession.isCreator = true;
			GameSession.session.create();
		}	
	},
	initHandler: function(uid, sid){
		$("#urlBox").attr("value", GameSession.session.getJoinUrl());
		if(!GameSession.isCreator){
			var msg = JSON.stringify(Game.player.pdu);
			GameSession.session.send(msg);
		}
	},
	msgHandler: function(json){
		console.log("msg handler", json);
		Game.pdu = new ProtocolDataUnit(json);
		console.log("PDU: ", Game.pdu);
	},
	userHandler: function(action, uid){
		if(action == "join"){
			var msg = JSON.stringify(Game.player.pdu);
			GameSession.session.send(msg);
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
	player: null,
	pdu: null,
	spawnPoint1: new SpawnPoint(0,0),
	spawnPoint2: new SpawnPoint(180,180),
	walls: new Array(),
	keyPressed: {
		up: false,
		down: false,
		left: false,
		right: false
	},
	init: function(){
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
		GameSession.init();
		if(GameSession.isCreator){
			Game.player = new Player(Game.spawnPoint1, Game.walls);
		}else{
			Game.player = new Player(Game.spawnPoint2, Game.walls);
		}
		setInterval(Game.loop, 30);
	},
	loop: function(){
		Game.player.update();
		if(Game.pdu){
			Game.pdu.update();
		}
		if(!Game.player.pdu.isInEpsilon()){
			Game.player.pdu.refresh();
			var msg = JSON.stringify(Game.player.pdu);
			GameSession.session.send(msg);
		}
		Game.ctx.clearRect(0, 0, Game.w, Game.h);
		for(i=0; i< Game.walls.length; i++){
			Game.walls[i].draw(Game.ctx);
		}
		Game.player.draw(Game.ctx);
		if(Game.pdu){
			Game.pdu.draw(Game.ctx);
		}
		$("#status").html("keyPressed.up: " + Game.keyPressed.up
			+ "<br> keyPressed.down: " + Game.keyPressed.down
			+ "<br> keyPressed.left: " + Game.keyPressed.left
			+ "<br> keyPressed.right: " + Game.keyPressed.right);
		if(Game.keyPressed.up){ Game.player.moveUp();}
		if(Game.keyPressed.down){ Game.player.moveDown();}
		if(Game.keyPressed.left){ Game.player.moveLeft();}
		if(Game.keyPressed.right){ Game.player.moveRight();}
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
	if (evt.keyCode == 32){ Game.player.dropBomb();}
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);


$(document).ready(Game.init);
