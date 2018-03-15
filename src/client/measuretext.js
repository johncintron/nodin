import CANVAS_CTX from './canvasctx';

/**
 * Measures text.
 *
 * @param {string} [opts.text=''] - Text.
 * @param {string} [opts.color='#000000'] - Color.
 * @param {string} [opts.fontWeight=''] - Font weight, such as bold or 900.
 * @param {string} [opts.fontStyle=''] - Font style, such as italic.
 * @param {int} [opts.fontSize=12] - Font size.
 * @param {string} [opts.fontFamily='Arial'] - Font family.
 * @return {TextMetrics} Text measurements given options.
 */
function MEASURE_TEXT(opts={}) {
  const text = opts.text || '';
  const color = opts.color || '#000000';
  const fontWeight = opts.fontWeight || '';
  const fontStyle = opts.fontStyle || '';
  const fontSize = opts.fontSize || 12;
  const fontFamily = opts.fontFamily || 'Arial';

  CANVAS_CTX.save();

  CANVAS_CTX.textBaseline = 'top';
  CANVAS_CTX.fillStyle = color;
  CANVAS_CTX.font = `${fontWeight} ${fontStyle} ${fontSize}px ${fontFamily}`;

  const textMetrics = CANVAS_CTX.measureText(text);

  CANVAS_CTX.restore();

  return textMetrics;
}

export default MEASURE_TEXT;
