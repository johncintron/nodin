const GameCanvas = {};

GameCanvas.initialize = function() {
  this.scaleX = 1;
  this.scaleY = 1;
  this.mouseX = 0;
  this.mouseY = 0;
  this.clicked = false;
  this.rightClicked = false;
  this.focusGame = false;
  this.focusInput = false;
  this.scrolledUp = false;
  this.scrolledDown = false;
  this.keys = {
    esc: 27,
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123,
    tilde: 192,
    '1': 49,
    '2': 50,
    '3': 51,
    '4': 52,
    '5': 53,
    '6': 54,
    '7': 55,
    '8': 56,
    '9': 57,
    '0': 48,
    minus: 173,
    plus: 61,
    q: 81,
    w: 87,
    e: 69,
    r: 82,
    t: 84,
    y: 89,
    u: 85,
    i: 73,
    o: 79,
    p: 80,
    '[': 219,
    ']': 221,
    pipe: 220,
    a: 65,
    s: 83,
    d: 68,
    f: 70,
    g: 71,
    h: 72,
    j: 74,
    k: 75,
    l: 76,
    colon: 59,
    quote: 222,
    enter: 13,
    shift: 16,
    z: 90,
    x: 88,
    c: 67,
    v: 86,
    b: 66,
    n: 78,
    m: 77,
    comma: 188,
    period: 190,
    ctrl: 17,
    alt: 18,
    space: 32,
    insert: 45,
    home: 36,
    pageup: 33,
    delete: 46,
    end: 35,
    pagedown: 34,
    up: 38,
    left: 37,
    down: 40,
    right: 39,
    num0: 96,
  };
  this.pressedKeys = {};

  this.game = document.querySelector('#game');
  this.gameWrapper = document.querySelector('#game-wrapper');
  this.menuIcon = document.querySelector('#menu-container');
  this.controlPanel = document.querySelector('#control-panel');
  this.controlPanelX = document.querySelector('#control-panel-x');
  this.controlPanelBar = document.querySelector('#control-panel-bar');
  this.inputW = document.querySelector('#input-w');
  this.inputH = document.querySelector('#input-h');
  this.inputX = document.querySelector('#input-x');
  this.inputY = document.querySelector('#input-y');

  this.listenControlPanel();
  this.showControlPanelOnClick();
  this.enableControlPanelDragging();
  this.listenMouse();
  this.listenKeyboard();
};

GameCanvas.showControlPanel = function() {
  this.controlPanel.style.display = 'initial';
};

GameCanvas.hideControlPanel = function() {
  this.controlPanel.style.display = 'none';
};

GameCanvas.moveControlPanel = function(x, y) {
  this.controlPanel.style.left = `${parseInt(x)}px`;
  this.controlPanel.style.top = `${parseInt(y)}px`;
};

GameCanvas.moveGame = function(x=0, y=0) {
  const X = parseInt(x) || 0;
  const Y = parseInt(y) || 0;
  const newX = X + ((this.scaleX - 1) * 400);
  const newY = Y + ((this.scaleY - 1) * 300);
  this.gameWrapper.style.left = `${newX}px`;
  this.gameWrapper.style.top = `${newY}px`;
};

GameCanvas.scaleGame = function(width=800, height=600) {
  let Width = parseInt(width);
  let Height = parseInt(height);
  if (isNaN(Width) || Width < 800) { Width = 800; }
  if (isNaN(Height) || Height < 600) { Height = 600; }
  this.scaleX = Width / 800;
  this.scaleY = Height / 600;
  this.gameWrapper.style.transform = `scale(${this.scaleX}, ${this.scaleY})`;
  this.moveGame(this.inputX.value || 0, this.inputY.value || 0);
};

GameCanvas.listenControlPanel = function() {
  const inputW = this.inputW
  const inputH = this.inputH
  const inputX = this.inputX
  const inputY = this.inputY
  const detectESC = e => { e.keyCode === 27 && this.hideControlPanel(); };
  const scaleGame = () => { this.scaleGame(inputW.value, inputH.value); };
  const moveGame = () => { this.moveGame(inputX.value, inputY.value); };

  inputW.oninput = scaleGame;
  inputH.oninput = scaleGame
  inputX.oninput = moveGame;
  inputY.oninput = moveGame;
  inputW.onkeypress = detectESC;
  inputH.onkeypress = detectESC;
  inputX.onkeypress = detectESC;
  inputY.onkeypress = detectESC;
  this.controlPanelX.onclick = this.hideControlPanel.bind(this);
};

GameCanvas.enableControlPanelDragging = function() {
  let x;
  let y;
  const move = e => this.moveControlPanel(e.clientX-x, e.clientY-y);
  this.controlPanelBar.addEventListener('mousedown', e => {
    x = e.clientX - parseInt(this.controlPanel.offsetLeft);
    y = e.clientY - parseInt(this.controlPanel.offsetTop);
    window.addEventListener('mousemove', move, true);
  }, false);
  this.controlPanelBar.addEventListener('mouseup', () => {
    window.removeEventListener('mousemove', move, true);
  }, false);
};

GameCanvas.showControlPanelOnClick = function() {
  this.menuIcon.onclick = this.showControlPanel.bind(this);
};

GameCanvas.listenMouse = function() {
  this.gameWrapper.addEventListener('mousemove', e => {
    const rectangle = this.gameWrapper.getBoundingClientRect();
    this.mouseX = (e.clientX-rectangle.left) / this.scaleX;
    this.mouseY = (e.clientY-rectangle.top) / this.scaleY;
  });
  this.gameWrapper.addEventListener('mousedown', e => {
    if (e.which === 1) {
      this.clicked = true;
    } else if (e.which === 3) {
      this.rightClicked = true;
    }
  });
  this.gameWrapper.addEventListener('mouseup', e => {
    if (e.which === 1) {
      this.clicked = false;
    } else if (e.which === 3) {
      this.rightClicked = false;
    }
  });
  this.gameWrapper.addEventListener('contextmenu', e => {
    e.preventDefault();
  });
  this.gameWrapper.addEventListener('mouseout', e => {
    const stillHoveringGameWrapper = !!e.relatedTarget &&
      e.relatedTarget.parentNode === this.gameWrapper;
    if (!stillHoveringGameWrapper) {
      this.clicked = false;
      this.rightClicked = false;
    }
  });
  window.addEventListener('mousedown', e => {
    this.focusGame = e.target === this.game;
  });
  this.gameWrapper.addEventListener('DOMMouseScroll', e => { // firefox
    this.scrolledUp = e.detail < 0;
    this.scrolledDown = e.detail > 0;
  });
  this.gameWrapper.addEventListener('mousewheel', e => { // chrome
    this.scrolledUp = e.wheelDelta > 0;
    this.scrolledDown = e.wheelDelta < 0;
  });
};

GameCanvas.listenKeyboard = function() {
  window.onkeydown = e => {
    if (this.focusGame && !this.focusInput) {
      e.preventDefault();
      this.pressedKeys[e.keyCode] = true;
    }
  };
  window.onkeyup = e => {
    if (this.focusGame && !this.focusInput) {
      e.preventDefault();
      this.pressedKeys[e.keyCode] = false;
    }
  };
};

GameCanvas.isKeyDown = function(key) {
  return !!this.pressedKeys[this.keys[key]] || !!this.pressedKeys[key];
};

GameCanvas.resetMousewheel = function() {
  this.scrolledUp = false;
  this.scrolledDown = false;
};

GameCanvas.releaseFocusInput = function() {
  this.pressedKeys[this.keys.enter] = false;
  this.game.focus();
}

export default GameCanvas;
