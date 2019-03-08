// ==========
// Ghost STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Ghost(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    this.speed = 1; //speed ratio
    this.num = 50;  //speed update interval
    this.randomisePosition();
    
    this.scale = 1;
    this.isEdible = false;
    this.hasRespawned = false;

    if (!this.color) {
        this.color = 0;
    }

    //different colors for the ghosts
    switch (this.color) {
        case 0:
            this.sprite = g_sprites.ghostRed;
            break;
        case 1:
            this.sprite = g_sprites.ghostOrange;
            break;
        case 2:
            this.sprite = g_sprites.ghostPink;
            break;
        case 3:
            this.sprite = g_sprites.ghostBlue;
            break;

        default:
            this.sprite = this.sprite.ghostBlue;
            break;
    }
    this.rememberResets();
};

Ghost.prototype = new Entity();

Ghost.prototype.delay = 1000 / NOMINAL_UPDATE_INTERVAL;

//generate a random starting position and direction within the starting box 
//for the ghosts when they spawn in the beginning of the game
Ghost.prototype.randomisePosition = function () {
    this.cx = this.cx || 360 + Math.random() * 80;
    this.cy = this.cy || 370 + Math.random() * 60;
    var ran = Math.floor(Math.random() * 4);
    switch (ran) {
        case 0:
            this.velX = 1;
            this.velY = 0;
            break;
        case 1:
            this.velX = -1;
            this.velY = 0;
            break;
        case 2:
            this.velY = 1;
            this.velX = 0;
            break;
        case 3:
            this.velY = -1;
            this.velX = 0;
            break;

        default:
            break;
    }
    this.rotation = this.rotation || 0;
};

Ghost.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
    this.reset_sprite = this.sprite;
};

// Initial, inheritable, default values
Ghost.prototype.rotation = 0;

//Killing the snake if the ghost and snake collide
//providing the ghost is edible and its the snakes head
Ghost.prototype.getSnake = function () {
    var hitEntitys = spatialManager.findEntityInRange(this.cx, this.cy, 10);

    hitEntitys.forEach(hitEntity => {
        if (!hitEntity.isEdible && hitEntity.isHead) {
            hitEntity.gameOver();
        }
    });
}

//generating a move for the ghost trying to catch the snake a little
Ghost.prototype.getBestMove = function () {
    var snakePos = entityManager.getSnakePos();

    var bestX = snakePos.cx - this.cx;
    var bestY = snakePos.cy - this.cy;

    if (Math.abs(bestX) >= Math.abs(bestY)) {
        this.velY = 0;
        this.velX = bestX / Math.abs(bestX);
    } else {
        this.velX = 0;
        this.velY = bestY / Math.abs(bestY);
    }
}

//generating a move for the ghost trying to avoid the snake a little
Ghost.prototype.getWorstMove = function () {
    var snakePos1 = entityManager.getSnakePos();

    var worstX = snakePos1.cx - this.cx;
    var worstY = snakePos1.cy - this.cy;

    if (Math.abs(worstX) >= Math.abs(worstY)) {
        this.velX = 0;
        this.velY = worstX / Math.abs(worstX);
    } else {
        this.velY = 0;
        this.velX = worstY / Math.abs(worstY);
    }
}

//generating a random move for the ghost
Ghost.prototype.getRandomMove = function () {
    var rand = Math.floor(Math.random() * 4 + 1);
    switch (rand) {
        case 1:
            this.velX = 1;
            this.velY = 0;
            break;
        case 2:
            this.velX = -1;
            this.velY = 0;
            break;
        case 3:
            this.velX = 0;
            this.velY = 1;
            break;
        case 4:
            this.velX = 0;
            this.velY = -1;
            break;
        default:
            this.velX = 1;
            this.velY = 0;
            break;
    }

}

Ghost.prototype.update = function (du) {

    spatialManager.unregister(this);

    // Every 50 score interval, the ghost speed up
    if(game_score.get_score() > this.num){
        this.speed += 0.2;
        this.num += 50;
    }

    //checking if the ghost is dead
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    //The ghosts become blue and edible if the snake is blue
    if (entityManager.getSnakeIsBlue() && !this.hasRespawned) {
        this.isEdible = true;
        if(entityManager.getSnakeHasLittleTime()){
            this.sprite = g_sprites.ghostBlinking;
        } else {
            this.sprite = g_sprites.ghostEdible;
        }
    } //If it has respawned while the powerup is active, it becomes inedible again
    else if (!entityManager.getSnakeIsBlue() && !this.hasRespawned) {
        this.isEdible = false;
        this.sprite = this.reset_sprite;
    }
    
    var rand = Math.random();
    this.delay -= du;
    //The ghosts follow the snake with a little bit of tactic and 
    //also run away not completly random
    //Delay used to limit the responstime of ghosts 
    this.getSnake();
    if (this.delay < 0) {
        if (this.isEdible) {
            if (rand > 0.2) {
                this.getWorstMove();
            } else {
                this.getRandomMove();
            }
            this.delay = 1000 / NOMINAL_UPDATE_INTERVAL; 
        } else {
            if (rand > 0.2) {
                this.getBestMove();
            } else {
                this.getRandomMove();
            }
            this.delay = 1000 / NOMINAL_UPDATE_INTERVAL;
        }
    }
    this.wrapPosition();

    var nextX = this.cx + this.velX * this.speed * du;
    var nextY = this.cy + this.velY * this.speed * du;

    // If ghost collides with wall or tail, change direction
    if (Level.checkCollisionGhost((nextX), (nextY)) || this.hitTail()) {
        this.changeDirection(rand);
        nextX = this.cx + this.velX * this.speed * du;
        nextY = this.cy + this.velY * this.speed * du;
    } 

    this.cx = nextX;
    this.cy = nextY;

    spatialManager.register(this);
};

// Checks if the ghost hit a tail
Ghost.prototype.hitTail = function () {
    var hitEntitys = this.findHitEntity();
    if (hitEntitys.length > 0) {
        var hit = false;
        hitEntitys.forEach(hitEntity => {
            if(hitEntity.isGhostWall) hit = true;
        });   
    }
    return hit;
};

Ghost.prototype.changeDirection = function(rand) {
    //chooses a random number -1 or 1
    var random = 1;
    if (rand < 0.5) {
        random = -1;
    }
    //if the ghosts hit a wall the turn left or right 
    if (this.velX === 1) {
        this.velX = 0;
        this.velY = 1 * random;
    } else if (this.velX === -1) {
        this.velX = 0;
        this.velY = 1 * random;
    } else if (this.velY === 1) {
        this.velX = 1 * random;
        this.velY = 0;
    } else if (this.velY === -1) {
        this.velX = 1 * random;
        this.velY = 0;
    }
};

Ghost.prototype.getRadius = function () {
    return this.scale * (this.sprite.width / 2);
};

//if the ghost is eaten it dies and the player gets 20 points
Ghost.prototype.eat = function () {
    game_score.add_score(20);
    this.kill();
};

//resetting the ghost 
Ghost.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    this.sprite = this.reset_sprite;
};

//the ghost then respawns in the middle 
Ghost.prototype.respawn = function () {
    this.reset();
    this.setPos(g_canvas.width * 0.5, g_canvas.height * 0.5);
    this.isEdible = false;
    this.hasRespawned = true;
    this.resurrect();
    entityManager.resurrectGhost(this);
}

Ghost.prototype.render = function (ctx) {
    this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
