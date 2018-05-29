import DRAW_IMAGE from './drawimage';
import MapleButton from './maplebutton';

const BUTTON_STANCE = {
  NORMAL: 'normal',
  MOUSE_OVER: 'mouseOver',
  PRESSED: 'pressed',
};

class MapleStanceButton extends MapleButton {
  constructor(opts) {
    super(opts);
    this.stance = opts.stance || BUTTON_STANCE.NORMAL;
    this.stances = this.img.reduce((stances, stance) => {
      stances[stance.nName] = stance.nChildren[0];
      return stances;
    }, {});
    this.onUpdate = opts.onUpdate || function(msPerTick, self) {};
    this.onDraw = opts.onDraw || function(camera, lag, msPerTick, tdelta, self) {
      const currentFrame = this.stances[this.stance];
      const currentImage = currentFrame.nGetImage();
      DRAW_IMAGE({
        img: currentImage,
        dx: this.x - camera.x,
        dy: this.y - camera.y,
      });
    };
  }
  
  update(msPerTick) {
    this.onUpdate(msPerTick, this);
  }
  
  draw(camera, lag, msPerTick, tdelta) {
    this.onDraw(camera, lag, msPerTick, tdelta, this);
  }
}

export { MapleStanceButton, BUTTON_STANCE };
