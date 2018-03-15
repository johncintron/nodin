import CANVAS_CTX from './canvasctx';

/**
 * Draws image onto canvas.
 *
 * Crops image using sx, sy, sw, sh.
 * Scales image using scaleX, scaleY.
 * Flips image if flip.
 * Rotates image using angle.
 * Draws image using dx, dy.
 *
 * @param {Image} opts.img - Source image.
 * @param {int} [opts.sx=0] - Source x.
 * @param {int} [opts.sy=0] - Source y.
 * @param {int} [opts.sw=opts.img.width-opts.sx] - Source width.
 * @param {int} [opts.sh=opts.img.height-opts.sy] - Source height.
 * @param {int} [opts.dx=0] - Destination x.
 * @param {int} [opts.dy=0] - Destination y.
 * @param {int} [opts.dw=opts.sw] - Destination width (prefer scaleX).
 * @param {int} [opts.dh=opts.sh] - Destination height (prefer scaleY).
 * @param {bool} [opts.flipped=false] - Flipped horizontally.
 * @param {float} [opts.scaleX=1] - Scale x.
 * @param {float} [opts.scaleY=1] - Scale y.
 * @param {int} [opts.angle=0] - Degrees clockwise rotation.
 * @param {int} [opts.rx=opts.dw*opts.scaleX/2] - Center x of rotation.
 * @param {int} [opts.ry=opts.dh*opts.scaleY/2] - Center y of rotation.
 * @param {float} [opts.alpha=1] - Opacity.
 */
function DRAW_IMAGE(opts={}) {
  const img = opts.img;

  if (!img) {
    return;
  }

  const sx = !('sx' in opts) ? 0 : opts.sx;
  const sy = !('sy' in opts) ? 0 : opts.sy;
  const sw = !('sw' in opts) ? (img.width - sx) : opts.sw;
  const sh = !('sh' in opts) ? (img.height - sy) : opts.sh;

  const dx = !('dx' in opts) ? 0 : opts.dx;
  const dy = !('dy' in opts) ? 0 : opts.dy;
  const dw = !('dw' in opts) ? sw : opts.dw;
  const dh = !('dh' in opts) ? sh : opts.dh;

  const flipped = !('flipped' in opts) ? false : opts.flipped;
  const angle = !('angle' in opts) ? 0 : opts.angle;
  const alpha = !('alpha' in opts) ? 1 : opts.alpha;
  const scaleX = !('scaleX' in opts) ? 1 : opts.scaleX;
  const scaleY = !('scaleY' in opts) ? 1 : opts.scaleY;

  const effectiveWidth = dw*scaleX;
  const effectiveHeight = dh*scaleY;

  const rx = !('rx' in opts) ? effectiveWidth/2 : opts.rx;
  const ry = !('ry' in opts) ? effectiveHeight/2 : opts.ry;

  CANVAS_CTX.save();

  CANVAS_CTX.globalAlpha = alpha;

  CANVAS_CTX.translate(dx+rx, dy+ry);
  CANVAS_CTX.rotate((angle%360) * Math.PI/180);
  CANVAS_CTX.translate(-rx, -ry);

  if (!!flipped) {
    CANVAS_CTX.translate(img.width*scaleX*sw/img.width, 0);
    CANVAS_CTX.scale(-1, 1);
  }

  CANVAS_CTX.drawImage(
    img,
    sx,
    sy,
    sw,
    sh,
    0,
    0,
    effectiveWidth,
    effectiveHeight
  );

  CANVAS_CTX.restore();
}

export default DRAW_IMAGE;
