var GameObject = function(x, y, w, h, color){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color || "#000000";
    this.drawRect = function(ctx, fillStyle, x, y, w, h){
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
    };
    this.draw = function(ctx){
        this.drawRect(ctx, this.color, this.x, this.y, this.w, this.h);
    };
    this.isLeftOf = function(go){
        return this.x + this.w <= go.x;
    };
    this.isAbove = function(go){
        return this.y + this.h <= go.y;
    };
    this.touches = function(go){
        if (this.isLeftOf(go)) {
            return false;
        }
        if (go.isLeftOf(this)) {
            return false;
        }
        if (this.isAbove(go)) {
            return false;
        }
        if (go.isAbove(this)) {
            return false;
        }
        return true;
    };
}

var Wall = function(x, y){
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 20;
    this.color = "#8B4513";
};
Wall.prototype = new GameObject;

var SpawnPoint = function(x, y){
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 20;
    this.color = "#FF7F50";
};
SpawnPoint.prototype = new GameObject;

var Bomb = function(x, y, radius, walls){
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 20;
    this.color = "#FF0000";
    this.radius = radius;
    this.wMax = this.w * this.radius;
    this.hMax = this.h * this.radius;
    var leftRect = new GameObject(this.x, this.y, 0, this.h, this.color);
    var rightRect = new GameObject(this.x + this.w, this.y, 0, this.h, this.color);
    var upperRect = new GameObject(this.x, this.y, this.w, 0, this.color);
    var lowerRect = new GameObject(this.x, this.y + this.h, this.w, 0, this.color);
    leftRect.active = true;
    rightRect.active = true;
    upperRect.active = true;
    lowerRect.active = true;
    var exploded = false;
    this.explode = function(){
        exploded = true;
    };
    this.update = function(){
        if (exploded) {
            if (leftRect.w < this.wMax && leftRect.active) {
                for (i = 0; i < walls.length; i++) {
                    if (leftRect.touches(walls[i])) {
                        walls.splice(i, 1);
                        leftRect.active = false;
                    }
                }
                leftRect.w++;
                leftRect.x--;
            }
            if (rightRect.w < this.wMax && rightRect.active) {
                for (i = 0; i < walls.length; i++) {
                    if (rightRect.touches(walls[i])) {
                        walls.splice(i, 1);
                        rightRect.active = false;
                    }
                }
                rightRect.w++;
            }
            if (upperRect.h < this.hMax && upperRect.active) {
                for (i = 0; i < walls.length; i++) {
                    if (upperRect.touches(walls[i])) {
                        walls.splice(i, 1);
                        upperRect.active = false;
                    }
                }
                upperRect.h++;
                upperRect.y--;
            }
            if (lowerRect.h < this.hMax && lowerRect.active) {
                for (i = 0; i < walls.length; i++) {
                    if (lowerRect.touches(walls[i])) {
                        walls.splice(i, 1);
                        lowerRect.active = false;
                    }
                }
                lowerRect.h++;
            }
        }
    }
    this.draw = function(ctx){
        this.drawRect(ctx, "#FFF000", this.x, this.y, this.w, this.h);
        leftRect.draw(ctx);
        rightRect.draw(ctx);
        upperRect.draw(ctx);
        lowerRect.draw(ctx);
    };
};
Bomb.prototype = new GameObject;

var ProtocolDataUnit = function(player){
    this.x = player.x;
    this.y = player.y;
    this.color = "#808080";
    this.w = 20;
    this.h = 20;
    this.vMax = 1;
    this.vx = player.vx;
    this.vy = player.vy;
    this.acx = player.acx;
    this.acy = player.acy;
    this.update = function(){
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= this.acx;
        this.vy *= this.acy;
    };
    this.isInEpsilon = function(){
        var x = Math.abs(this.x - player.x), y = Math.abs(this.y - player.y), vx = Math.abs(this.vx - player.vx), vy = Math.abs(this.vy - player.vy), e = x + y + vx + vy;
        if (e > 3) {
            return false;
        }
        else {
            return true;
        }
    };
    this.refresh = function(){
        this.x = player.x;
        this.y = player.y;
        this.vx = player.vx;
        this.vy = player.vy;
        this.acx = player.acx;
        this.acy = player.acy;
    }
}
ProtocolDataUnit.prototype = new GameObject;

var Player = function(spawnPoint, walls, color){
    this.x = spawnPoint.x;
    this.y = spawnPoint.y;
    this.w = 20;
    this.h = 20;
    this.vMax = 2;
    this.vx = 0;
    this.vy = 0;
    this.acx = 0.9;
    this.acy = 0.9;
    this.color = color || "#97FFFF";
    this.pdu = new ProtocolDataUnit(this);
    var bomb = null, bombRadius = 2, bombTimer = 2000, steps = 2;
    var xMid = this.x + (Math.floor(this.w / 2));
    var yMid = this.y + (Math.floor(this.h / 2));
    console.log(xMid);
    console.log(yMid);
    this.moveUp = function(){
        this.vy = -this.vMax;
    };
    this.moveDown = function(){
        this.vy = this.vMax;
    };
    this.moveLeft = function(){
        this.vx = -this.vMax;
    };
    this.moveRight = function(){
        this.vx = this.vMax;
    };
    this.dropBomb = function(){
        var bombSpawnX = Math.floor(xMid / 20);
        var bombSpawnY = Math.floor(yMid / 20);
        bombSpawnX *= 20;
        bombSpawnY *= 20;
        console.log("bombspawnX=" + bombSpawnX);
        console.log("bombspawnY=" + bombSpawnY);
        console.log("x=" + this.x);
        console.log("y=" + this.y);
        bomb = new Bomb(bombSpawnX, bombSpawnY, bombRadius, walls);
        setTimeout(this.explodeBomb, bombTimer);
    };
    this.explodeBomb = function(){
        bomb.explode();
        //        bomb = null;
    };
    this.update = function(){
        var xTmp = this.x, yTmp = this.y;
        this.x += this.vx;
        xMid = this.x;
        yMid = this.y;
        // console.log("2. ausgabe  " + "xmid=" + xMid + "yMid=" + yMid);
        this.y += this.vy;
        this.vx *= this.acx;
        this.vy *= this.acy;
        for (i = 0; i < walls.length; i++) {
            if (this.touches(walls[i])) {
                this.y = yTmp;
                this.vy = 0;
                this.x = xTmp;
                this.vx = 0;
                break;
            }
        }
        if (bomb) {
            bomb.update();
        }
    };
    this.draw = function(ctx){
        this.drawRect(ctx, this.color, this.x, this.y, this.w, this.h);
        if (bomb) {
            bomb.draw(ctx);
        }
    };
};
Player.prototype = new GameObject;
