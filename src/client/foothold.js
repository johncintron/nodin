import DRAW_LINE from './drawline';

class Foothold {
  static fromWzNode(wzNode) {
    const fh = new Foothold(wzNode);
    fh.load();
    return fh;
  }
  constructor(wzNode) {
    this.wzNode = wzNode;
  }
  load() {
    const wzNode = this.wzNode;

    this.id = parseInt(wzNode.nName);
    this.group = parseInt(wzNode.nParent.nName);
    this.layer = parseInt(wzNode.nParent.nParent.nName);
    this.x1 = wzNode.x1.nValue;
    this.y1 = wzNode.y1.nValue;
    this.x2 = wzNode.x2.nValue;
    this.y2 = wzNode.y2.nValue;
    this.prev = wzNode.prev.nValue;
    this.next = wzNode.next.nValue;
    this.force = wzNode.nGet('force').nGet('nValue', 0);
    this.forbid = wzNode.nGet('forbidFallDown').nGet('nValue', 0);

    this.isWall = this.x1 === this.x2;
    this.slope = !this.isWall ? ((this.y2-this.y1)/(this.x2-this.x1)) : 0;
    this.isCeiling = this.x1 > this.x2;
    if (this.isWall) {
      this.isLeftWall = this.y1 < this.y2;
      this.isRightWall = this.y1 >= this.y2;
    }
  }
  draw(camera, lag, msPerTick) {
    DRAW_LINE({
      x1: this.x1-camera.x,
      x2: this.x2-camera.x,
      y1: this.y1-camera.y,
      y2: this.y2-camera.y,
      color: '#00ff00',
    });
  }
}

export default Foothold;
