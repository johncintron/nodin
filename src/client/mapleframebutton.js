import DRAW_IMAGE from './drawimage';
import { MapleButton } from './maplebutton'

class MapleFrameButton extends MapleButton {
  constructor(opts) {
    super(opts);
    this.canClick = true;
    this.canUpdate = false;
    this.frame = opts.frame || 0;
    this.delay = opts.delay || 100;
    this.endFrame = opts.endFrame || this.img.length;
    this.onEndFrame = opts.onEndFrame || function (opts) {
    };
    this.onDraw = opts.onDraw || function(camera, lag, msPerTick, tdelta, opts) {
      const currentFrame = this.img[this.frame];
      const currentImage = currentFrame.nGetImage();
      DRAW_IMAGE({
        img: currentImage,
        dx: this.x - camera.x - currentFrame.origin.nX,
        dy: this.y - camera.y - currentFrame.origin.nY,
      });
    };
    const delay = this.delay;
    this.onUpdate = opts.onUpdate || function(msPerTick, opts) {
      if(this.canUpdate) {
        this.delay -= msPerTick;
        if (this.delay <= 0) {
          this.frame += 1;
          this.delay = delay - this.delay;
        }
        const isDone = this.frame === this.endFrame;
        if (isDone) {
          this.frame = 0;
          this.delay = delay;
          this.canUpdate = false;
          this.canClick = true;
          this.onEndFrame(opts);
        }
      }
    };
  }
  
  setCanClick(val) {
    this.canClick = val;
  }
  
  setCanUpdate(val) {
    this.canUpdate = val;
  }
  
  getRect(camera) {
    const frame = this.img[0];
    const image = frame.nGetImage();
    return {
      x: this.x - camera.x - frame.origin.nX,
      y: this.y - camera.y - frame.origin.nY,
      width: image.width,
      height: image.height,
    };
  }
}

export default MapleFrameButton;