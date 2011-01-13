var Playground = function(w, h){
    this.w = w;
    this.h = h;
    var array = new Array(this.w);
    for(i = 0; i < this.w;i++){
        array[i] = new Array(this.h);
    }
    this.isFree = function(x,y){
        return this.isOnPlayground(x, y) && array[x][y] == null;
    }
    this.isOnPlayground = function(x,y){
        return (x < this.w && x >= 0 && y < this.h && y >= 0);
    }
    this.addWall = function(x,y){
        if(this.isFree(x,y)){
            array[x][y] = new Wall(x,y);
        }
    }
    this.add = function(obj, x, y){
        if(this.isFree(x, y)){
            array[x][y] = obj;
        }
    }
    this.remove = function(x,y){
        if(this.isOnPlayground(x,y)){
            array[x][y] = null;
        }
    }
    this.draw = function(ctx){
        for(i=0; i < this.w;i++){
            for(j=0; j < this.h;j++){
                if(array[i][j] != null)
                    array[i][j].draw(ctx);
            }
        }
    }
}

function drawRect(ctx, fillStyle , x, y, w, h){
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

var Wall = function(x,y){
    var w = 20;
    var h = 20;
    this.draw = function(ctx){
        drawRect(ctx, "#8B4513", x * w, y * h, w, h);
    }
}

var Player = function(playground, x, y){
    this.getX = function(){
        return Math.floor(rx / w);
    }
    this.getY = function(){
        return Math.floor(ry / h);
    }
    this.setDestX = function(x){
        destX = w * x;
    }
    this.setDestY = function(y){
        destY = h * y;
    }
    var bomb = null;
    var w = 20;
    var h = 20;
    var bombRadius = 2;
    var bombTimer = 2000;
    var steps = 2 ; //px
    var rx = x * w;
    var ry = y * h;
    var destX = rx;
    var destY = ry;
    this.update = function(){
        if((destX != rx) || (destY != ry)){
            if(destX > rx) rx += steps;
            else if(destX < rx) rx -= steps;
            else if(destY > ry) ry += steps;
            else if(destY < ry) ry -= steps;
        }
    }
    this.move = function(x,y){
        if(playground.isFree(x, y) && destX == rx && destY == ry){
            this.setDestX(x);
            this.setDestY(y);
        }
    }
    this.moveUp = function(){
        this.move(this.getX(), this.getY() -1);
    }
    this.moveDown = function(){
        this.move(this.getX(), this.getY() +1);
    }
    this.moveLeft = function(){
        this.move(this.getX() -1, this.getY());
    }
    this.moveRight = function(){
        this.move(this.getX() +1, this.getY());
    }
    this.isOnField = function(){
        return (rx % w == 0) && (ry % h == 0);
    }
    this.dropBomb = function(){
        bomb = new Bomb(playground, this.getX(), this.getY(), bombRadius);
        setTimeout(this.explodeBomb, bombTimer);
    }
    this.explodeBomb = function(){
        bomb.explode();
        bomb = null;
    }
    this.draw = function(ctx){
        drawRect(ctx, "#97FFFF", rx, ry, w, h);
        if(bomb)
            bomb.draw(ctx);
    }
}

var Bomb = function(playground, x, y, radius){
    var w = 20;
    var h = 20;
    this.explode = function(){
        for(i=1; i <= radius;i++){
            playground.remove(x + i, y);
            playground.remove(x - i, y);
            playground.remove(x, y + i);
            playground.remove(x, y - i);
            playground.remove(x, y);
        }
    }
    this.draw = function(ctx){
        drawRect(ctx, "#FF0000", x * w, y * h, w, h);
    }
}