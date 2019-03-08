// ==========
// PowerUp stuff
// ==========

"use strict";

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function PowerUp(descr) {

    this.setup(descr);

    this.randomisePosition();
    this.randomiseVelocity();

    // Default sprite and scale, if not otherwise specified
    this.sprite = g_sprites.snakeBoddyBlue;
    this.scale  = 0.7;
    this.isEdible = true;
};

PowerUp.prototype = new Entity();

PowerUp.prototype.randomisePosition = function () {
    // PowerUp randomisation defaults (if nothing otherwise specified)
    this.cx = this.cx || Math.random() * g_canvas.width;
    this.cy = this.cy || Math.random() * g_canvas.height;
    this.rotation = this.rotation || 0;
};

PowerUp.prototype.randomiseVelocity = function () {
    var MIN_SPEED = 20,
        MAX_SPEED = 70;

    var speed = util.randRange(MIN_SPEED, MAX_SPEED) / SECS_TO_NOMINALS;
    var dirn = Math.random() * consts.FULL_CIRCLE;

    this.velX = this.velX || speed * Math.cos(dirn);
    this.velY = this.velY || speed * Math.sin(dirn);

    var MIN_ROT_SPEED = 0.5,
        MAX_ROT_SPEED = 2.5;

    this.velRot = this.velRot ||
        util.randRange(MIN_ROT_SPEED, MAX_ROT_SPEED) / SECS_TO_NOMINALS;
};

PowerUp.prototype.update = function (du) {

    spatialManager.unregister(this);

    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    this.rotation += 1 * this.velRot;
    this.rotation = util.wrapRange(this.rotation,
                                    0, consts.FULL_CIRCLE);

    this.wrapPosition();

    spatialManager.register(this);

};

PowerUp.prototype.getRadius = function () {
    return this.scale * (this.sprite.width / 2) * 0.9;
};


PowerUp.prototype.eat = function () {
    this.kill();
    setTimeout(function(){
       entityManager.generatePowerUp();
    },20000);
};


PowerUp.prototype.render = function (ctx) {
    this.sprite.scale = this.scale;
    this.sprite.alpha = 0.7;
    this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
