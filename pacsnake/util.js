// util.js
//
// A module of utility functions, with no private elements to hide.
// An easy case; just return an object containing the public stuff.

"use strict";


var util = {


// RANGES
// ======

clampRange: function(value, lowBound, highBound) {
    if (value < lowBound) {
	value = lowBound;
    } else if (value > highBound) {
	value = highBound;
    }
    return value;
},

wrapRange: function(value, lowBound, highBound) {
    while (value < lowBound) {
	value += (highBound - lowBound);
    }
    while (value > highBound) {
	value -= (highBound - lowBound);
    }
    return value;
},

isBetween: function(value, lowBound, highBound) {
    if (value < lowBound) { return false; }
    if (value > highBound) { return false; }
    return true;
},


// RANDOMNESS
// ==========

randRange: function(min, max) {
    return (min + Math.random() * (max - min));
},


// MISC
// ====

square: function(x) {
    return x*x;
},


// DISTANCES
// =========

distSq: function(x1, y1, x2, y2) {
    return this.square(x2-x1) + this.square(y2-y1);
},

wrappedDistSq: function(x1, y1, x2, y2, xWrap, yWrap) {
    var dx = Math.abs(x2-x1),
	dy = Math.abs(y2-y1);
    if (dx > xWrap/2) {
	dx = xWrap - dx;
    };
    if (dy > yWrap/2) {
	dy = yWrap - dy;
    }
    return this.square(dx) + this.square(dy);
},


// CANVAS OPS
// ==========

clearCanvas: function (ctx) {
    ctx.drawImage(g_images.levelBackground, 0, 0);
},

drawOverlay: function (ctx) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle ="black";
    ctx.fillRect(0, 0, 800, 800);
    ctx.restore();
},

drawReplay: function (ctx, hover) {
    ctx.save();
    // Seta réttan gulann
    ctx.fillStyle ="yellow";
    ctx.fillRect(400-125,650-40,250, 80);
    ctx.globalAlpha = 1;
    ctx.fillStyle ="black";
    ctx.fillRect(400-120,650-35,240, 70);
    ctx.fillStyle ="yellow";
    ctx.textAlign="center";
    ctx.font = "bold 41px Arial";
    ctx.globalAlpha = 0.5;
    ctx.fillText("REPLAY", 401, 666);
    ctx.globalAlpha = 1;
    ctx.font = "bold 40px Arial";
    ctx.fillText("REPLAY", 400, 665)
    ctx.restore();
},

noPause: function (ctx) {
    ctx.font = "bold 24px Arial";
    ctx.textAlign="center";
    var msg = "There is NO";
    var msg1 = "pausing in";
    var msg2 = "REAL LIFE!!";
    ctx.fillText(msg, 400, 380);
    ctx.fillText(msg1, 400, 405);
    ctx.fillText(msg2, 400, 435);
},

strokeCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
},

fillCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
},

fillBox: function (ctx, x, y, w, h, style) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = oldStyle;
}

};
