// =================
// ENTITY MANAGEMENT
// =================

'use strict';

var entityManager = {
  // "PRIVATE" DATA

  _ghosts: [],
  _tail: [],
  _snake: [],
  _powerup: [],
  _food: [],

  // "PRIVATE" METHODS

  // Generates 4 ghosts each with diffrent color id
  _generateGhosts: function() {
    var i,
      ghostCount = 4;
    for (i = 0; i < ghostCount; ++i) {
      this.generateGhost({ color: i });
    }
  },

  _generateFood: function() {
    var x = 60;
    var y = 60;

    for (var i = 0; i < 18; i++) {
      for (var j = 0; j < 18; j++) {
        if (i < 2 || i > 15) {
          this.createFood(new Food({ cx: x, cy: y }));
        } else if (j < 2 || j > 15) {
          this.createFood(new Food({ cx: x, cy: y }));
        } else if ((i === 5 || i === 6) && (j > 3 && j < 14)) {
          this.createFood(new Food({ cx: x, cy: y }));
        } else if ((i === 11 || i === 12) && (j > 3 && j < 14)) {
          this.createFood(new Food({ cx: x, cy: y }));
        } else if ((j === 4 || j === 5) && (i >= 5 && i <= 12)) {
          this.createFood(new Food({ cx: x, cy: y }));
        } else if ((j === 12 || j === 13) && (i >= 5 && i <= 12)) {
          this.createFood(new Food({ cx: x, cy: y }));
        }

        x += 40;
      }
      x = 60;
      y += 40;
    }
  },

  _forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
      fn.call(aCategory[i]);
    }
  },

  // PUBLIC METHODS

  // A special return value, used by other objects,
  // to request the blessed release of death!
  //
  KILL_ME_NOW: -1,

  // Some things must be deferred until after initial construction
  // i.e. thing which need `this` to be defined.
  //
  deferredSetup: function() {
    this._categories = [
      this._food,
      this._tail,
      this._snake,
      this._powerup,
      this._ghosts
    ];
  },

  init: function() {
    this._generateGhosts();
    this._generateFood();
    this.generatePowerUp();
  },

  generateSnake: function(descr) {
    var snake = new Snake(descr);
    this._snake.push(snake);
    this.generateTail(this._snake[0]);
    for (let i = 0; i < descr.length; i++) {
      this.generateTail(this._tail[i]);
    }
  },

  generateTail: function(follow) {
    var delay = 0;
    var delayMax = this._tail.length;
    var itCanKill = true;

    if (this._tail.length < 5) {
      itCanKill = false;
    }
    var descr = {
      follow: follow,
      cx: follow.cx,
      cy: follow.cy,
      direction: follow.direction,
      delay: delay,
      canItKill: itCanKill,
      delayMax: delayMax
    };
    this._tail.push(new Tail(descr));
  },

  generateGhost: function(descr) {
    this._ghosts.push(new Ghost(descr));
  },

  // Resurrects a killed ghost
  resurrectGhost: function(ghost) {
    this._ghosts.push(ghost);
  },

  // Resets ghost respawn atribute, so they can go edible again
  resetGhostRespawn: function() {
    for (var i = 0; i < this._ghosts.length; i++) {
      this._ghosts[i].hasRespawned = false;
    }
  },

  // Generates a new powerup & resets ghost respawn
  generatePowerUp: function(descr) {
    this._powerup.push(new PowerUp(descr));
    this.resetGhostRespawn();
  },

  // Returns the (x,y) position of the snake
  getSnakePos: function() {
    var pos = {
      cx: this._snake[0].cx,
      cy: this._snake[0].cy
    };
    return pos;
  },

  // Returns whether or not the snake is Blue(powerup is active)
  getSnakeIsBlue: function() {
    if (this._snake[0]) {
      return this._snake[0].isBlue;
    }
    return false;
  },

  // Returns whether or not a short time of active powerup remains
  getSnakeHasLittleTime: function() {
    return this._snake[0].hasLittleTime;
  },

  // Generates the food
  createFood: function(food) {
    this._food.push(food);
  },

  update: function(du) {
    for (var c = 0; c < this._categories.length; ++c) {
      var aCategory = this._categories[c];
      var i = 0;

      while (i < aCategory.length) {
        if (aCategory === this._tail) {
          // For each tail part on the snake
          // For each 10 points the snake grows by one tail
          if (
            Math.floor((game_score.get_score() + 80) / 10) >
            this._snake[0].length
          ) {
            this._snake[0].length += 1;
            var len = this._tail.length;
            this.generateTail(aCategory[len - 1]);
          }
        }

        var status = aCategory[i].update(du);

        if (status === this.KILL_ME_NOW) {
          if (aCategory === this._ghosts) {
            // if the entetie killed is a ghost
            var deadGhost = aCategory[i];
            setTimeout(deadGhost.respawn.bind(deadGhost), 3000); // Respawn it after 3sec
          }

          // remove the dead guy, and shuffle the others down to
          // prevent a confusing gap from appearing in the array
          aCategory.splice(i, 1);
        } else {
          ++i;
        }
      }
    }
  },

  render: function(ctx) {
    for (var c = 0; c < this._categories.length; ++c) {
      var aCategory = this._categories[c];

      // Render tail from last to first, looks better
      if (aCategory === this._tail) {
        for (var i = aCategory.length - 1; i >= 0; --i) {
          aCategory[i].render(ctx);
        }
      } else {
        for (var i = 0; i < aCategory.length; ++i) {
          aCategory[i].render(ctx);
        }
      }
    }

    // Render the gamescore
    game_score.show_score(ctx);

    if (g_isUpdatePaused) {
      util.noPause(ctx);
    }
  }
};

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
