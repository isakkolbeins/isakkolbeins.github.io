/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

'use strict';

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {
  // "PRIVATE" DATA

  _nextSpatialID: 1, // make all valid IDs non-falsey (i.e. don't start at 0)

  _entities: [],

  // PUBLIC METHODS

  getNewSpatialID: function() {
    return this._nextSpatialID++;
  },

  register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();

    entity.posX = pos.posX;
    entity.posY = pos.posY;
    entity.radius = entity.getRadius();

    this._entities[spatialID] = entity;
  },

  unregister: function(entity) {
    var spatialID = entity.getSpatialID();
    delete this._entities[spatialID];
  },

  findEntityInRange: function(posX, posY, radius) {
    var entityInRange = [];
    this._entities.forEach(entity => {
      // Distance from center of entity forom x and y
      let dist = Math.sqrt(util.distSq(posX, posY, entity.posX, entity.posY));
      // Check if on range from both radiuses
      if (entity.radius + radius > dist) {
        entityInRange.push(entity);
      }
    });
    return entityInRange;
  },

  render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = 'red';

    for (var ID in this._entities) {
      var e = this._entities[ID];
      util.strokeCircle(ctx, e.posX, e.posY, e.radius);
    }
    ctx.strokeStyle = oldStyle;
  }
};
