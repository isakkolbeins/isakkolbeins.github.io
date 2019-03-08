// ======
// Snake
// ======

"use strict";

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Snake(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    this.sprite = g_sprites.snakeHeadR;
    this.isEdible = false;
    this.isBlue = false;

}

Snake.prototype = new Entity();

// Initial, inheritable, default values
Snake.prototype.rotation = 0;
Snake.prototype.cx = 200;
Snake.prototype.cy = 200;
Snake.prototype.speed = 2;
Snake.prototype.velX = 2;
Snake.prototype.velY = 0;
Snake.prototype.length = 3;
Snake.prototype.direction = 'R';
Snake.prototype.isBlue = false;
Snake.prototype.hasLittleTime = false;
Snake.prototype.isHead = true;
Snake.prototype.scale = 1;
Snake.prototype.num = 50;

Snake.prototype.KEY_UP       = 'W'.charCodeAt(0);
Snake.prototype.KEY_DOWN     = 'S'.charCodeAt(0);
Snake.prototype.KEY_LEFT     = 'A'.charCodeAt(0);
Snake.prototype.KEY_RIGHT    = 'D'.charCodeAt(0);

Snake.prototype.ARROW_LEFT   = 37;
Snake.prototype.ARROW_UP     = 38;
Snake.prototype.ARROW_RIGHT  = 39;
Snake.prototype.ARROW_DOWN   = 40;

var powerUpEaten = false;


Snake.prototype.update = function (du) {

    spatialManager.unregister(this);

    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }

    var stig = game_score.get_score();

    if(stig > this.num){
        this.speed += 0.2;
        this.num += 50;
    }

    this.calculateDirection();


    if(!Level.checkCollisionSnake((this.cx + this.velX * du), (this.cy + this.velY * du))){
        this.cx += this.velX * du;
        this.cy += this.velY * du;
    } else {
        this.gameOver();
    }

    this.rotation = util.wrapRange(this.rotation,
                                0, consts.FULL_CIRCLE);

    this.wrapPosition();
    this.updateSprite();
    this.eatSelf();

    //check if snake has eaten a powerUp
    this.eatPowerUp();
    if(powerUpEaten === true){
        powerUpEaten = false;
        setTimeout(this.back2Normal.bind(this), 10000);
        setTimeout(this.littleTime.bind(this), 7000);
    }

    spatialManager.register(this);
};

Snake.prototype.calculateDirection = function () {

    if ((keys[this.KEY_UP] || keys[this.ARROW_UP]) && this.direction != 'D'){
        this.velX = 0;
        this.velY = -1*this.speed;
        this.direction = 'U';
        this.rotation = -Math.PI/2;
    }
    if ((keys[this.KEY_DOWN] || keys[this.ARROW_DOWN]) && this.direction != 'U'){
        this.velX = 0;
        this.velY = this.speed;
        this.direction = 'D';
        this.rotation = Math.PI/2;
    }
    if ((keys[this.KEY_LEFT] || keys[this.ARROW_LEFT]) && this.direction != 'R'){
        this.velX = -1*this.speed;
        this.velY = 0;
        this.direction = 'L';
        this.rotation = 0;
    }
    if ((keys[this.KEY_RIGHT] || keys[this.ARROW_RIGHT]) && this.direction != 'L'){
        this.velX = this.speed;
        this.velY = 0;
        this.direction = 'R';
        this.rotation = 0;
    }
};

Snake.prototype.getRadius = function () {
    return this.scale * (this.sprite.width / 2) * 0.9;
};

Snake.prototype.ghostHit = function () {
    this.gameOver();
};

Snake.prototype.gameOver = function () {
    g_gameOver = true;
    this.updateSprite();
}

Snake.prototype.eatSelf = function(){
    var hitEntitys = spatialManager.findEntityInRange(this.cx,this.cy,10);
    var tailhits =[];

    for(var i=0;i<hitEntitys.length;i++){
        if(hitEntitys[i].isTail){
            tailhits.push(hitEntitys[i]);
        }
    }


    if(tailhits.length > 0){
        tailhits.forEach(hitEntity => {
            if(hitEntity.canItKill && g_canDie ){
                console.log("you die now!!");
                this.gameOver();
            }
        });

    }
}


Snake.prototype.eatPowerUp = function () {
    // Set snake, tail and ghosts to blue
    // Make ghosts edible
    var hitEntitys = this.findHitEntity();
    if (hitEntitys.length > 0) {

        hitEntitys.forEach(hitEntity => {
            var edible = hitEntity.eat;
            if(hitEntity.isEdible){
                this.isBlue = true;
                powerUpEaten = true;
                audioManager.playBlueMusic();
                edible.call(hitEntity);
            }
            else if(hitEntity.canBeEaten){
                game_score.add_score(1);
                hitEntity.eat();
            }
        });
    }
};

Snake.prototype.back2Normal = function () {
    // After x time, the snake turns back yellow and cannot eat the ghosts
    this.isBlue = false;
    this.hasLittleTime = false;
};

Snake.prototype.littleTime = function () {
    // After x time, the snake turns back yellow and cannot eat the ghosts
    this.hasLittleTime = true;
};

Snake.prototype.updateSprite = function () {
    if(this.direction == 'L') {
        if(!this.isBlue){
            if(g_gameOver) this.sprite = g_sprites.snakeHeadDeadL;
            else this.sprite = g_sprites.snakeHeadL;
        }else {
            if(g_gameOver) this.sprite = g_sprites.snakeHeadDeadBlueL;
            else this.sprite = g_sprites.snakeHeadBlueL;
        }
    }
    else {
        if(!this.isBlue){
            if(g_gameOver) this.sprite = g_sprites.snakeHeadDeadR;
            else this.sprite = g_sprites.snakeHeadR;
        }else {
            if(g_gameOver) this.sprite = g_sprites.snakeHeadDeadBlueR;
            else this.sprite = g_sprites.snakeHeadBlueR;
        }
    }
};

Snake.prototype.render = function (ctx) {

    this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );

    ctx.globalAlpha = 1;
};
