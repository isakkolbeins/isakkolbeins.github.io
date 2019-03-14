// ==============
// MOUSE HANDLING
// ==============

'use strict';

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var g_mouseX = 0,
  g_mouseY = 0;

function handleMouse(evt) {
  g_mouseX = evt.clientX - g_canvas.offsetLeft;
  g_mouseY = evt.clientY - g_canvas.offsetTop;

  // If no button is being pressed, then bail
  var button = evt.buttons === undefined ? evt.which : evt.buttons;
  if (!button) return;

  // If the game is over, and the replay button area i clicked, soft relad page
  if (
    g_gameOver &&
    util.isBetween(g_mouseX, 400 - 125, 400 + 125) &&
    util.isBetween(g_mouseY, 650 - 40, 650 + 40)
  ) {
    location.reload(false);
  }
}

// Handle "down" and "move" events the same way.
window.addEventListener('mousedown', handleMouse);
window.addEventListener('mousemove', handleMouse);
