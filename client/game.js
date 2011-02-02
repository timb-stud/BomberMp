var ctx,
	w,
	h,
	player,
	walls = [],
	keyPressed = {
    up: false,
    down: false,
    left: false,
    right: false
};

function onKeyDown(evt) {
    if (evt.keyCode == 38){ keyPressed.up = true;}
    if (evt.keyCode == 40){ keyPressed.down = true;}
    if (evt.keyCode == 37){ keyPressed.left = true;}
    if (evt.keyCode == 39){ keyPressed.right = true;}
}

function onKeyUp(evt) {
    if (evt.keyCode == 38){ keyPressed.up = false;}
    if (evt.keyCode == 40){ keyPressed.down = false;}
    if (evt.keyCode == 37){ keyPressed.left = false;}
    if (evt.keyCode == 39){ keyPressed.right = false;}
    if (evt.keyCode == 32){ player.dropBomb();}
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

function mainLoop(){
	player.animate();
    ctx.clearRect(0, 0, w, h);
    for(i=0; i< walls.length; i++){
		walls[i].draw(ctx);
    }
    player.draw(ctx);
    $("#status").html("keyPressed.up: " + keyPressed.up
        + "<br> keyPressed.down: " + keyPressed.down
        + "<br> keyPressed.left: " + keyPressed.left
        + "<br> keyPressed.right: " + keyPressed.right);
    if(keyPressed.up){ player.moveUp();}
    if(keyPressed.down){ player.moveDown();}
    if(keyPressed.left){ player.moveLeft();}
    if(keyPressed.right){ player.moveRight();}
}

function init(){
    var canvas = $("#gameCanvas")[0];
    w = canvas.width;
    h = canvas.height;
    ctx = canvas.getContext("2d");
    walls.push(new Wall(50, 50));
    walls.push(new Wall(50, 70));
    walls.push(new Wall(50, 90));
    walls.push(new Wall(70, 90));
    walls.push(new Wall(90, 90));
    walls.push(new Wall(90, 70));
    walls.push(new Wall(90, 50));
    player = new Player(3, 3, walls);
    setInterval(mainLoop, 10);
}

$(document).ready(init);
