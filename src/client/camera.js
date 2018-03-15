const Camera = {};

Camera.initialize = function() {
  this.width = 800;
  this.height = 600;
  this.x = 0;
  this.y = 0;
  this.boundaries = {};
};

Camera.setBoundaries = function({ left, right, top, bottom }) {
  this.boundaries = { left, right, top, bottom };
};

Camera.lookAt = function(x, y) {
  const width = this.width;
  const height = this.height;
  const boundaries = this.boundaries;

  if (boundaries.right-boundaries.left < width) {
    const leftGap = (width - (boundaries.right-boundaries.left)) / 2;
    this.x = Math.round(boundaries.left - leftGap);
  } else if (x - width/2 < boundaries.left) {
    this.x = boundaries.left;
  } else if (x + width/2 > boundaries.right) {
    this.x = boundaries.right - width;
  } else {
    this.x = Math.round(x - width/2);
  }

  if (boundaries.bottom-boundaries.top < height) {
    const topGap = (height - (boundaries.bottom-boundaries.top)) / 2;
    this.y = Math.round(boundaries.top - topGap);
  } else if (y - height/2 < boundaries.top) {
    this.y = boundaries.top;
  } else if (y + height/2 > boundaries.bottom) {
    this.y = boundaries.bottom - height;
  } else {
    this.y = Math.round(y - height/2);
  }
};

Camera.update = function() {

};

Camera.doReset = function() {

};

export default Camera;
