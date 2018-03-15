import WZManager from './wzmanager';
import DRAW_IMAGE from './drawimage';
import DRAW_TEXT from './drawtext';
import DRAW_RECT from './drawrect';
import MEASURE_TEXT from './measuretext';
import Random from './random';

class NPC {
  static async fromOpts(opts) {
    const npc = new NPC(opts);
    await npc.load();
    return npc;
  }
  constructor(opts) {
    this.opts = opts;
  }
  async load() {
    const opts = this.opts;

    this.oId = opts.oId;
    this.id = opts.id;
    this.x = opts.x;
    this.cy = opts.cy;
    this.flipped = opts.f;
    this.fh = opts.fh;
    this.rx0 = opts.rx0;
    this.rx1 = opts.rx1;

    let strId = `${this.id}`.padStart(7, '0');
    let npcFile = await WZManager.get(`Npc.wz/${strId}.img`);
    if (!!npcFile.info.link) {
      const linkId = npcFile.info.link.nValue;
      strId = `${linkId}`.padStart(7, '0');
      npcFile = await WZManager.get(`Npc.wz/${strId}.img`);
    }
    this.npcFile = npcFile;

    this.stances = {};
    npcFile.nChildren.filter(c => c.nName !== 'info').forEach(stance => {
      this.stances[stance.nName] = this.loadStance(npcFile, stance.nName);
    });

    this.strings = await this.loadStrings(this.id);

    this.floating = npcFile.info.nGet('float').nGet('nValue', 0);

    this.mapleTv = npcFile.info.nGet('MapleTV').nGet('nValue', 0);
    if (!!this.mapleTv) {
      this.mapleTvAdX = npcFile.info.MapleTVadX.nValue;
      this.mapleTvAdY = npcFile.info.MapleTVadY.nValue;
      this.mapleTvMsgX = npcFile.info.MapleTVmsgX.nValue;
      this.mapleTvMsgY = npcFile.info.MapleTVmsgY.nValue;

      const tvFile = await WZManager.get('UI.wz/MapleTV.img');
      const tvMsg = tvFile.TVmedia;

      this.tvAdStances = tvMsg.nChildren.map((stance, i) => {
        return this.loadStance(tvMsg, i);
      });

      this.setTvAdFrame(Random.randInt(0, this.tvAdStances.length-1), 0);

      this.mapleTvMsgImg = tvFile.TVbasic[0].nGetImage();
    }

    this.setFrame('stand', 0);
  }
  async loadStrings(id) {
    const stringFile = await WZManager.get('String.wz/Npc.img');
    const npcStrings = stringFile.nGet(id);
    return npcStrings.nChildren.reduce((acc, c) => {
      acc[c.nName] = c.nValue;
      return acc;
    }, {});
  }
  loadStance(wzNode={}, stance='stand') {
    if (!wzNode[stance]) {
      return {
        frames: [],
      };
    }

    const frames = [];

    wzNode[stance].nChildren.forEach(frame => {
      if (frame.nTagName === 'canvas' || frame.nTagName === 'uol') {
        const Frame = frame.nTagName === 'uol' ? frame.nResolveUOL() : frame;
        frames.push(Frame);
      } else {
        console.log(`Unhandled frame=${frame.nTagName} for cls=NPC `, this);
      }
    });

    return {
      frames,
    };
  }
  setFrame(stance='stand', frame=0, carryOverDelay=0) {
    const s = !this.stances[stance] ? 'stand' : stance;
    const f = !this.stances[s].frames[frame] ? 0 : frame;
    const stanceFrame = this.stances[s].frames[f];

    this.stance = s;
    this.frame = f;
    this.delay = carryOverDelay;
    this.nextDelay = stanceFrame.nGet('delay').nGet('nValue', 100);
  }
  setTvAdFrame(stance=0, frame=0, carryOverDelay=0) {
    const s = !this.tvAdStances[stance] ? 0 : stance;
    const f = !this.tvAdStances[s].frames[frame] ? 0 : frame;
    const stanceFrame = this.tvAdStances[s].frames[f];

    this.tvAdStance = s;
    this.tvAdFrame = f;
    this.tvAdDelay = carryOverDelay;
    this.tvAdNextDelay = stanceFrame.nGet('delay').nGet('nValue', 100);
  }
  updateTvAd(msPerTick) {
    if (!!this.mapleTv) {
      this.tvAdDelay += msPerTick;
      if (this.tvAdDelay > this.tvAdNextDelay) {
        this.setTvAdFrame(
          this.tvAdStance,
          this.tvAdFrame+1,
          this.tvAdDelay-this.tvAdNextDelay
        );
      }
    }
  }
  update(msPerTick) {
    this.delay += msPerTick;
    if (this.delay > this.nextDelay) {
      this.setFrame(this.stance, this.frame+1, this.delay-this.nextDelay);
    }
    this.updateTvAd(msPerTick);
  }
  draw(camera, lag, msPerTick, tdelta) {
    const currentFrame = this.stances[this.stance].frames[this.frame];
    const currentImage = currentFrame.nGetImage();

    const originX = currentFrame.nGet('origin').nGet('nX', 0);
    const originY = currentFrame.nGet('origin').nGet('nY', 0);

    const adjustX = !this.flipped ? originX : (currentFrame.nWidth-originX);

    DRAW_IMAGE({
      img: currentImage,
      dx: this.x-camera.x-adjustX,
      dy: this.cy-camera.y-originY,
      flipped: !!this.flipped,
    });

    this.drawName(camera, lag, msPerTick, tdelta);
    this.drawTvAd(camera, lag, msPerTick, tdelta);
  }
  drawName(camera, lag, msPerTick, tdelta) {
    const hideName = this.npcFile.info.nGet('hideName').nGet('nValue', 0);
    const hasName = !!this.strings.name;
    const hasFunc = !!this.strings.func;
    const tagHeight = 16;
    const tagPadding = 4;
    const tagColor = '#000000';
    const tagAlpha = 0.7;
    const offsetFromCy = 2;

    if (!hideName && hasName) {
      const nameOpts = {
        text: this.strings.name,
        x: this.x - camera.x,
        y: this.cy - camera.y + offsetFromCy + 3,
        color: '#ffff00',
        fontWeight: 'bold',
        align: 'center',
      };
      const nameWidth = Math.ceil(MEASURE_TEXT(nameOpts).width + tagPadding);
      const nameTagX = Math.ceil(this.x - camera.x - nameWidth/2);
      DRAW_RECT({
        x: nameTagX,
        y: this.cy - camera.y + offsetFromCy,
        width: nameWidth,
        height: tagHeight,
        color: tagColor,
        alpha: tagAlpha,
      });
      DRAW_TEXT(nameOpts);
    }
    if (!hideName && hasFunc) {
      const funcOpts = {
        text: this.strings.func,
        x: this.x - camera.x,
        y: this.cy - camera.y + offsetFromCy + tagHeight + 3 + 1,
        color: '#ffff00',
        fontWeight: 'bold',
        align: 'center',
      };
      const funcWidth = Math.ceil(MEASURE_TEXT(funcOpts).width + tagPadding);
      const funcTagX = Math.ceil(this.x - camera.x - funcWidth/2);
      DRAW_RECT({
        x: funcTagX,
        y: this.cy - camera.y + offsetFromCy + tagHeight + 1,
        width: funcWidth,
        height: tagHeight,
        color: tagColor,
        alpha: tagAlpha,
      });
      DRAW_TEXT(funcOpts);
    }
  }
  drawTvAd(camera, lag, msPerTick, tdelta) {
    if (!this.mapleTv) {
      return;
    }

    const s = this.tvAdStance;
    const f = this.tvAdFrame;
    const currentFrame = this.tvAdStances[s].frames[f];
    const currentImage = currentFrame.nGetImage();

    DRAW_IMAGE({
      img: currentImage,
      dx: this.x-camera.x+this.mapleTvAdX,
      dy: this.cy-camera.y+this.mapleTvAdY,
    });

    DRAW_IMAGE({
      img: this.mapleTvMsgImg,
      dx: this.x-camera.x + (this.mapleTvMsgX-0x10000)%0x10000,
      dy: this.cy-camera.y+this.mapleTvMsgY,
    });
  }
}

export default NPC;
