import WZManager from './wzmanager';
import DRAW_IMAGE from './drawimage';

class Tile {
  static async fromWzNode(wzNode) {
    const tile = new Tile(wzNode);
    await tile.load();
    return tile;
  }
  constructor(wzNode) {
    this.wzNode = wzNode;
  }
  async load() {
    const wzNode = this.wzNode;
    const type = wzNode.nParent.nParent.info.tS.nValue;
    const u = wzNode.u.nValue;
    const no = wzNode.no.nValue;
    const tileFile = await WZManager.get(`Map.wz/Tile/${type}.img`);
    const spriteNode = tileFile[u][no];

    this.img = spriteNode.nGetImage();

    this.originX = spriteNode.origin.nX;
    this.originY = spriteNode.origin.nY;

    this.x = wzNode.x.nValue;
    this.y = wzNode.y.nValue;
    this.z = spriteNode.nGet('z').nGet('nValue', 0) || wzNode.zM.nValue;
  }
  draw(camera, lag, msPerTick) {
    DRAW_IMAGE({
      img: this.img,
      dx: this.x-camera.x-this.originX,
      dy: this.y-camera.y-this.originY,
    });
  }
}

export default Tile;
