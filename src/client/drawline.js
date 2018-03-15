import CANVAS_CTX from './canvasctx';

/**
 * Draws line onto canvas.
 *
 * @param {int} [opts.x1=0] - Destination x1.
 * @param {int} [opts.y1=0] - Destination y1.
 * @param {int} [opts.x2=0] - Destination x2.
 * @param {int} [opts.y2=0] - Destination y2.
 * @param {float} [opts.width=1] - Thickness.
 * @param {float} [opts.alpha=1] - Opacity.
 * @param {string] [opts.color='#000000'] - Color.
 */
function DRAW_LINE(opts={}) {
  const x1 = opts.x1 || 0;
  const y1 = opts.y1 || 0;
  const x2 = opts.x2 || 0;
  const y2 = opts.y2 || 0;
  const alpha = opts.alpha || 1;
  const color = opts.color || '#000000';
  const width = opts.width || 1;

  CANVAS_CTX.save();
  CANVAS_CTX.beginPath();
  CANVAS_CTX.moveTo(x1, y1);
  CANVAS_CTX.lineTo(x2, y2);
  CANVAS_CTX.globalAlpha = alpha;
  CANVAS_CTX.strokeStyle = color;
  CANVAS_CTX.lineWidth = width;
  CANVAS_CTX.stroke();
  CANVAS_CTX.restore();
}

export default DRAW_LINE;
