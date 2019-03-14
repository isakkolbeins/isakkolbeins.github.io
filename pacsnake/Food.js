// ======
// FOOD
// ======

'use strict';

function Food(descr) {
  this.setup(descr);

  this.sprite = g_sprites.snakeBoddy;
  this.scale = 0.4;
  this.canBeEaten = true;
}

Food.prototype = new Entity();

// Eat the food
Food.prototype.eat = function() {
  this.kill(); // kill entity
  setTimeout(this.respawn_food.bind(this), 60000); // respawn it after 1min
};

// Respawn food entity
Food.prototype.respawn_food = function() {
  this.resurrect();
  entityManager.createFood(this);
};

Food.prototype.getRadius = function() {
  return this.scale * (this.sprite.width / 2) * 0.9;
};

Food.prototype.update = function() {
  spatialManager.unregister(this);
  if (this._isDeadNow) return entityManager.KILL_ME_NOW;
  spatialManager.register(this);
};

Food.prototype.render = function(ctx) {
  this.sprite.scale = this.scale;
  this.sprite.drawWrappedCentredAt(ctx, this.cx, this.cy, this.rotation);
};
