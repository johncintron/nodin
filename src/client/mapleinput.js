import GameCanvas from './gamecanvas';

class MapleInput {
  constructor(opts) {
    const x = opts.x || 0;
    const y = opts.y || 0;
    const width = opts.width || 150;
    const height = opts.height || 12;
    const background = opts.background || 'transparent';
    const border = opts.border || 'none';
    const color = opts.color || '#000000';
    const fontSize = opts.fontSize || 12;
    const cursor = opts.cursor || 'none';
    const type = opts.type || 'text';
    const focusListeners = opts.focusListeners || [];
    const focusoutListeners = opts.focusoutListeners || [];
    const submitListeners = opts.submitListeners || [];
    const input = document.createElement('input');

    this.opts = opts;
    this.input = input;
    this.focusListeners = [
      () => { GameCanvas.focusInput = true; },
      ...focusListeners,
    ];
    this.focusoutListeners = [
      () => { GameCanvas.focusInput = false; },
      ...focusoutListeners,
    ];
    this.submitListeners = [
      ...submitListeners
    ];

    input.style.left = `${x}px`;
    input.style.top = `${y}px`;
    input.style.width = `${width}px`;
    input.style.height = `${height}px`;
    input.style.background = background;
    input.style.border = border;
    input.style.color = color;
    input.style.fontSize = `${fontSize}px`;
    input.style.cursor = cursor;
    input.type = type;

    input.addEventListener('focus', () => {
      this.focusListeners.forEach(listener => listener());
    });
    input.addEventListener('focusout', () => {
      this.focusoutListeners.forEach(listener => listener());
    });
    input.addEventListener('keydown', e => {
      if (e.keyCode === GameCanvas.keys.enter) {
        this.submitListeners.forEach(listener => listener());
      }
    });

    GameCanvas.gameWrapper.appendChild(input);
  }
  addFocusListener(listener) {
    this.focusListeners.push(listener);
  }
  addFocusoutListener(listener) {
    this.focusoutListeners.push(listener);
  }
  addSubmitListener(listener) {
    this.submitListeners.push(listener);
  }
  remove() {
    this.input.remove();
  }
}

export default MapleInput;
