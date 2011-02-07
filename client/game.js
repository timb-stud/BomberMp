var Game = {
	ctx: null,
	w: 0,
	h: 0 ,
	player1: null,
	player2: null,
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
		Game.player1 = new Player(3, 3, Game.walls);
		setInterval(Game.loop, 10);
	},
	loop: function(){
		Game.player1.animate();
		Game.ctx.clearRect(0, 0, Game.w, Game.h);
		for(i=0; i< Game.walls.length; i++){
			Game.walls[i].draw(Game.ctx);
		}
		Game.player1.draw(Game.ctx);
		$("#status").html("keyPressed.up: " + Game.keyPressed.up
			+ "<br> keyPressed.down: " + Game.keyPressed.down
			+ "<br> keyPressed.left: " + Game.keyPressed.left
			+ "<br> keyPressed.right: " + Game.keyPressed.right);
		if(Game.keyPressed.up){ Game.player1.moveUp();}
		if(Game.keyPressed.down){ Game.player1.moveDown();}
		if(Game.keyPressed.left){ Game.player1.moveLeft();}
		if(Game.keyPressed.right){ Game.player1.moveRight();}
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
