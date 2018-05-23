import DRAW_IMAGE from './drawimage';

const STANCE = {
  NORMAL: 'normal',
  MOUSE_OVER: 'mouseOver',
  PRESSED: 'pressed',
};

class MapleButton {
  constructor(opts) {
    this.x = opts.x || 0;
    this.y = opts.y || 0;
    this.img = opts.img || {};
    this.stance = opts.stance || STANCE.NORMAL;
    this.stances = this.img.reduce((stances, stance) => {
      stances[stance.nName] = stance.nChildren[0];
      return stances;
    }, {});
    this.onUpdate = opts.onUpdate || function(msPerTick, opts) {
    };
    this.onDraw = opts.onDraw || function(camera, lag, msPerTick, tdelta, opts) {
      const currentFrame = this.stances[this.stance];
      const currentImage = currentFrame.nGetImage();
      DRAW_IMAGE({
        img: currentImage,
        dx: this.x - camera.x,
        dy: this.y - camera.y,
      });
    };
    this.onClick = opts.onClick || function(opts) {
    };
    this.layer = opts.layer || 2;
    this.hoverAudio = !(opts.hoverAudio === false);
    this.clickAudio = !(opts.clickAudio === false);
    this.opts = opts;
  }
  
  update(msPerTick) {
    this.onUpdate(msPerTick, this.opts);
  }
  
  draw(camera, lag, msPerTick, tdelta) {
    this.onDraw(camera, lag, msPerTick, tdelta, this.opts);
  }
  
  trigger() {
    this.onClick(this.opts);
  }
  
  getRect(camera) {
    const image = this.stances.normal.nGetImage();
    return {
      x: this.x - camera.x,
      y: this.y - camera.y,
      width: image.width,
      height: image.height,
    };
  }
  
  setStance(val) {
    this.stance = val;
  }
}

export { MapleButton, STANCE }