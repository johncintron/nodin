import CANVAS_CTX from './canvasctx';

/**
 * Draws text onto canvas.
 *
 * @param {string} [opts.text=''] - Text.
 * @param {int} [opts.x=0] - Destination x.
 * @param {int} [opts.y=0] - Destination y.
 * @param {string} [opts.color='#000000'] - Color.
 * @param {string} [opts.fontWeight=''] - Font weight, such as bold or 900.
 * @param {string} [opts.fontStyle=''] - Font style, such as italic.
 * @param {int} [opts.fontSize=12] - Font size.
 * @param {string} [opts.fontFamily='Arial'] - Font family.
 * @param {string} [opts.align='left'] - Alignment relative to destination x.
 */
function DRAW_TEXT(opts={}) {
  const text = opts.text || '';
  const x = opts.x || 0;
  const y = opts.y || 0;
  const color = opts.color || '#000000';
  const fontWeight = opts.fontWeight || '';
  const fontStyle = opts.fontStyle || '';
  const fontSize = opts.fontSize || 12;
  const fontFamily = opts.fontFamily || 'Arial';
  const textAlign = opts.align || 'left';

  CANVAS_CTX.save();

  CANVAS_CTX.textBaseline = 'top';
  CANVAS_CTX.fillStyle = color;
  CANVAS_CTX.font = `${fontWeight} ${fontStyle} ${fontSize}px ${fontFamily}`;
  CANVAS_CTX.textAlign = textAlign;

  CANVAS_CTX.fillText(text, x, y);

  CANVAS_CTX.restore();
}

export default DRAW_TEXT;
