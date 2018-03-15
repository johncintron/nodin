import CANVAS_CTX from './canvasctx';

/**
 * Draws rectangle onto canvas.
 *
 * @param {int} [opts.x=0] - Destination x.
 * @param {int} [opts.y=0] - Destination y.
 * @param {int} [opts.width=0] - Width.
 * @param {int} [opts.height=0] - Height.
 * @param {int} [opts.angle=0] - Degrees clockwise rotation.
 * @param {float} [opts.alpha=1] - Opacity.
 * @param {string] [opts.color='#000000'] - Color.
 */
function DRAW_RECT(opts={}) {
  const x = opts.x || 0;
  const y = opts.y || 0;
  const width = opts.width || 0;
  const height = opts.height || 0;
  const angle = opts.angle || 0;
  const alpha = opts.alpha || 1;
  const color = opts.color || '#000000';

  CANVAS_CTX.save();

  CANVAS_CTX.globalAlpha = alpha;
  CANVAS_CTX.fillStyle = color;
  CANVAS_CTX.translate(x, y);
  CANVAS_CTX.rotate((angle%360) * Math.PI/180);
  CANVAS_CTX.fillRect(0, 0, width, height);

  CANVAS_CTX.restore();
}

export default DRAW_RECT;
