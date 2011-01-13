var w;
var h;
var ctx;
var player;
var pg;
var keyPressed = {
    up: false,
    down: false,
    left: false,
    right: false
};

function onKeyDown(evt) {
    if (evt.keyCode == 38) keyPressed.up = true;
    if (evt.keyCode == 40) keyPressed.down = true;
    if (evt.keyCode == 37) keyPressed.left = true;
    if (evt.keyCode == 39) keyPressed.right = true;
}

function onKeyUp(evt) {
    if (evt.keyCode == 38) keyPressed.up = false;
    if (evt.keyCode == 40) keyPressed.down = false;
    if (evt.keyCode == 37) keyPressed.left = false;
    if (evt.keyCode == 39) keyPressed.right = false;
    if (evt.keyCode == 32) player.dropBomb();
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

function init(){
    var canvas = $("#gameCanvas")[0];
    w = canvas.width;
    h = canvas.height;
    ctx = canvas.getContext("2d");

    pg = new Playground(w/20, h/20);
    pg.addWall(1, 1);
    pg.addWall(1, 2);
    pg.addWall(1, 3);
    pg.addWall(1, 4);
    pg.addWall(1, 5);
    pg.addWall(1, 6);
    pg.addWall(2, 1);
    pg.addWall(8, 7);
    pg.addWall(8, 8);
    pg.addWall(7, 8);
    player = new Player(pg, 3, 3);
    setInterval(mainLoop, 30);
}

function mainLoop(){
    ctx.clearRect(0, 0, w, h);
    pg.draw(ctx);
    player.draw(ctx);
    player.update();
    $("#status").html("keyPressed.up: " + keyPressed.up
        + "<br> keyPressed.down: " + keyPressed.down
        + "<br> keyPressed.left: " + keyPressed.left
        + "<br> keyPressed.right: " + keyPressed.right);
    if(keyPressed.up) player.moveUp();
    if(keyPressed.down) player.moveDown();
    if(keyPressed.left) player.moveLeft();
    if(keyPressed.right) player.moveRight();
}

$(document).ready(init);