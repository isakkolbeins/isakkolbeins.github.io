// =========
// GameOver
// =========

'use strict';

var gameOver = {
  animationFinished: false,
  startAnimation: false,
  buttonHover: false,

  update: function(du) {
    this.startAnimation = true;
    audioManager.playGameOverMusic();
  },

  render: function(ctx) {
    util.drawOverlay(ctx);
    if (this.startAnimation) {
      if (!this.animationFinished) {
        g_sprites.gameOver.drawWrappedCentredAt(ctx, 400, 400, 0);
        util.drawReplay(ctx);
      } else {
        g_sprites.gameFinished.drawWrappedCentredAt(ctx, 400, 400, 0);
        util.drawReplay(ctx);
      }
      if (g_sprites.gameOver.isLastFrame()) this.animationFinished = true;
    }
  }
};
