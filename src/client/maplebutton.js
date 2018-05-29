class MapleButton {
  constructor(opts) {
    this.x = opts.x || 0;
    this.y = opts.y || 0;
    this.img = opts.img || {};
    this.layer = opts.layer || 2;
    this.hoverAudio = !(opts.hoverAudio === false);
    this.clickAudio = !(opts.clickAudio === false);
    this.onClick = opts.onClick || function(self) {};
    this.onDraw = function(camera, lag, msPerTick, tdelta, self) {};
    this.onUpdate = function(msPerTick, self) {};
    this.opts = opts;
  }
  
  update(msPerTick) {
    this.onUpdate(msPerTick, this);
  }
  
  draw(camera, lag, msPerTick, tdelta) {
    this.onDraw(camera, lag, msPerTick, tdelta, this);
  }
  
  trigger() {
    this.onClick(this);
  }

  getRect(camera) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }
}

export default MapleButton;
