// ====
// Tail
// ====

"use strict";

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Tail(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Default sprite and scale, if not otherwise specified
    this.sprite = g_sprites.snakeBoddy;
    this.scale  = this.scale  || 1;
    
    this.isWaiting = true;
    this.isBlue = false;
    this.isTail = true;
    this.decDelay = 1;
    this.num = 50;
    this.isGhostWall = true;

};

Tail.prototype = new Entity();

Tail.prototype.delay = 200 / NOMINAL_UPDATE_INTERVAL;

Tail.prototype.getNewPos = function(){
    this.isWaiting = false;


    this.cx = this.follow.cx;
    this.cy = this.follow.cy;
    this.direction = this.follow.direction;

    this.delay = 200 / NOMINAL_UPDATE_INTERVAL;
}

Tail.prototype.update = function (du) {

    spatialManager.unregister(this);

    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }

    if(!this.follow.isWaiting){
        this.isWaiting=true;
    }

    if(this.isWaiting){
        this.delay -= 0.4 + this.decDelay;
    }

    var stig = game_score.get_score();

    if(stig > this.num){
        this.decDelay += 0.2;
        this.num += 50;
    }

    if (this.delay < 0) {
        this.getNewPos();
    }

    this.rotation += this.velRot;
    this.rotation = util.wrapRange(this.rotation, 0, consts.FULL_CIRCLE);

    this.wrapPosition();

    this.updateSprite();

    spatialManager.register(this);
};

Tail.prototype.getRadius = function () {
    return this.scale * (this.sprite.width / 2) * 0.9;
};

Tail.prototype.updateSprite = function () {
    if(entityManager.getSnakeIsBlue()) this.isBlue = true;
    else this.isBlue = false;
    if(this.isBlue) this.sprite = g_sprites.snakeBoddyBlue;
    else this.sprite = g_sprites.snakeBoddy;
}

Tail.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    this.sprite.scale = this.scale;
    this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
