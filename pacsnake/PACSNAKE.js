// =========
// PACSNAKE
// =========

'use strict';

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// ====================
// CREATE BEGINNING SNAKE
// ====================

function createBeginningSnake() {
  entityManager.generateSnake({
    cx: 100,
    cy: 100,
    length: 2,
    direction: 'R'
  });
}

//=========================
// SHOW SCORE
//=========================

var game_score = {
  score: 0,

  add_score: function(num) {
    if (!g_gameOver) {
      // To prevent js hackers
      this.score = this.score + num;
    }
  },

  get_score: function() {
    return this.score;
  },

  show_score: function(ctx) {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.font = 'bold 20px Arial';
    var text = 'Score: ' + this.score;
    ctx.fillText(text, 400, 20);
    ctx.restore();
  }
};

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
  // Nothing to do here!
  // The event handlers do everything we need for now.
}

// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`

// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
  processDiagnostics();
  // If the game is over, stop the updates
  if (!g_gameOver) {
    entityManager.update(du);
    audioManager.update(du);
  } else gameOver.update(du); // If over, start countdown to animation
}

// GAME-SPECIFIC DIAGNOSTICS

var g_renderSpatialDebug = false;
var KEY_SPATIAL = keyCode('X');
var g_isPaused = false;
var KEY_PAUSE = keyCode('P');

function processDiagnostics() {
  if (eatKey(KEY_PAUSE)) g_isPaused = !g_isPaused;
  if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;
}

// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`

function renderSimulation(ctx) {
  // Render all the entities in enitiyManager
  entityManager.render(ctx);
  // If the game is over, draw an overlay and start the gameover animation
  if (g_gameOver) gameOver.render(ctx);

  if (g_renderSpatialDebug) spatialManager.render(ctx);
}

// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {
  var requiredImages = {
    levelBackground:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/backgroundvol2.png',

    ghostBlue:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_ghostBlue.png',
    ghostRed:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_ghostRead.png',
    ghostPink:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_ghostPink.png',
    ghostOrange:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_ghostOrange.png',
    ghostEdible:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_ghostEdible.png',
    ghostWhite:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_ghostWhite.png',
    ghostEyes:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_ghostEyes.png',

    snakeBoddy:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_snakeBoddy.png',
    snakeBoddyBlue:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_snakeBoddyBlue.png',

    snakeHead0L:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_snakeHead0.png',
    snakeHead1L:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_snakeHead1.png',
    snakeHead2L:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_snakeHead2.png',
    snakeHead3L:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_snakeHead3.png',

    snakeHead0R:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_SnakeHeadR0.png',
    snakeHead1R:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_SnakeHeadR1.png',
    snakeHead2R:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_SnakeHeadR2.png',
    snakeHead3R:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_SnakeHeadR3.png',

    snakeHeadBlue0L:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_snakeHeadBlue0.png',
    snakeHeadBlue1L:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_snakeHeadBlue1.png',
    snakeHeadBlue2L:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_snakeHeadBlue2.png',
    snakeHeadBlue3L:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_snakeHeadBlue3.png',

    snakeHeadBlue0R:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_SnakeHeadBlueR0.png',
    snakeHeadBlue1R:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_SnakeHeadBlueR1.png',
    snakeHeadBlue2R:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_SnakeHeadBlueR2.png',
    snakeHeadBlue3R:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_SnakeHeadBlueR3.png',

    snakeHeadDeadL:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_snakeHeadDeadL.png',
    snakeHeadDeadR:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_snakeHeadDeadR.png',
    snakeHeadDeadBlueL:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_snakeHeadDeadBlueL.png',
    snakeHeadDeadBlueR:
      'https://notendur.hi.is/~iak5/tolvuleikjaforritun/PackSnake/img/sprite_snakeHeadDeadBlueR.png',

    gameFinished:
      'https://notendur.hi.is/boo11/Tolvuleikjaforritun/pac-snake/GameOver/sprite_gameOver80.png'
  };

  getGameOver(requiredImages);

  imagesPreload(requiredImages, g_images, preloadDone);
}

function getGameOver(json) {
  for (var i = 0; i < 80; i++) {
    var num = i;
    if (i < 10) num = '0' + i;
    json['gameOver' + num] =
      'https://notendur.hi.is/boo11/Tolvuleikjaforritun/pac-snake/GameOver/sprite_gameOver' +
      num +
      '.png';
  }
}

function getGameOverImgs() {
  var gameOverImgs = [];
  Object.keys(g_images).forEach(key => {
    if (key.includes('gameOver')) {
      gameOverImgs.push(g_images[key]);
    }
  });
  return gameOverImgs;
}

var g_sprites = {};

function preloadDone() {
  g_sprites.ghostBlue = new Sprite(1, [g_images.ghostBlue]);
  g_sprites.ghostRed = new Sprite(1, [g_images.ghostRed]);
  g_sprites.ghostOrange = new Sprite(1, [g_images.ghostOrange]);
  g_sprites.ghostPink = new Sprite(1, [g_images.ghostPink]);
  g_sprites.ghostEdible = new Sprite(1, [g_images.ghostEdible]);

  g_sprites.snakeBoddy = new Sprite(1, [g_images.snakeBoddy]);
  g_sprites.snakeBoddyBlue = new Sprite(1, [g_images.snakeBoddyBlue]);

  g_sprites.snakeHeadDeadL = new Sprite(1, [g_images.snakeHeadDeadL]);
  g_sprites.snakeHeadDeadR = new Sprite(1, [g_images.snakeHeadDeadR]);
  g_sprites.snakeHeadDeadBlueL = new Sprite(1, [g_images.snakeHeadDeadBlueL]);
  g_sprites.snakeHeadDeadBlueR = new Sprite(1, [g_images.snakeHeadDeadBlueR]);

  var snakeUpdateSpeed = 0.03;

  g_sprites.snakeHeadL = new Sprite(snakeUpdateSpeed, [
    g_images.snakeHead0L,
    g_images.snakeHead1L,
    g_images.snakeHead2L,
    g_images.snakeHead3L
  ]);

  g_sprites.snakeHeadR = new Sprite(snakeUpdateSpeed, [
    g_images.snakeHead0R,
    g_images.snakeHead1R,
    g_images.snakeHead2R,
    g_images.snakeHead3R
  ]);

  g_sprites.snakeHeadBlueL = new Sprite(snakeUpdateSpeed, [
    g_images.snakeHeadBlue0L,
    g_images.snakeHeadBlue1L,
    g_images.snakeHeadBlue2L,
    g_images.snakeHeadBlue3L
  ]);

  g_sprites.snakeHeadBlueR = new Sprite(snakeUpdateSpeed, [
    g_images.snakeHeadBlue0R,
    g_images.snakeHeadBlue1R,
    g_images.snakeHeadBlue2R,
    g_images.snakeHeadBlue3R
  ]);

  g_sprites.ghostBlinking = new Sprite(0.005, [
    g_images.ghostEdible,
    g_images.ghostWhite
  ]);

  g_sprites.gameFinished = new Sprite(1, [g_images.gameFinished]);

  var gameOverImgs = getGameOverImgs();

  g_sprites.gameOver = new Sprite(0.04, gameOverImgs);

  entityManager.init();
  audioManager.init();
  createBeginningSnake();

  main.init();
}

// Kick it off
requestPreloads();

var g_canDie = false;

function canDie() {
  g_canDie = true;
}

setTimeout(canDie, 3000);
