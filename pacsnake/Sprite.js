// ============
// SPRITE STUFF
// ============

"use strict";

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// Construct a "sprite" from the given `image`,
//
function Sprite(speed, images) {
    this.images = images;

    this.width = images[0].width;
    this.height = images[0].height;
    this.frameCount = images.length-1;
    this.scale = 1;
    this.frame = 0;
    this.speed = speed;
    this.speedCounter = 0;
}

Sprite.prototype.getFrame = function () {

    if(this.frame > this.frameCount){
        this.frame = 0;
    }
    var img = this.images[this.frame];

    this.speedCounter += this.speed;
    if (this.speedCounter >= 1){
        this.frame += 1;
        this.speedCounter = 0;
    }
    return img;
}

Sprite.prototype.setToFirstFrame = function () {
    this.frame = 0;
}

Sprite.prototype.isLastFrame = function() {
    return this.frame === this.frameCount;
}

Sprite.prototype.drawCentredAt = function (ctx, cx, cy, rotation) {
    if (rotation === undefined) rotation = 0;

    var w = this.width,
        h = this.height;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(this.scale, this.scale);


    var img = this.getFrame();
    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin
    ctx.drawImage(img, -w/2, -h/2);

    ctx.restore();
};

Sprite.prototype.drawWrappedCentredAt = function (ctx, cx, cy, rotation) {

    // Get "screen width"
    var sw = g_canvas.width;

    // Draw primary instance
    this.drawWrappedVerticalCentredAt(ctx, cx, cy, rotation);

    // Left and Right wraps
    this.drawWrappedVerticalCentredAt(ctx, cx - sw, cy, rotation);
    this.drawWrappedVerticalCentredAt(ctx, cx + sw, cy, rotation);
};

Sprite.prototype.drawWrappedVerticalCentredAt = function (ctx, cx, cy, rotation) {

    // Get "screen height"
    var sh = g_canvas.height;

    // Draw primary instance
    this.drawCentredAt(ctx, cx, cy, rotation);

    // Top and Bottom wraps
    this.drawCentredAt(ctx, cx, cy - sh, rotation);
    this.drawCentredAt(ctx, cx, cy + sh, rotation);
};
