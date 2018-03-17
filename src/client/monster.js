import AudioManager from './audiomanager';
import WZManager from './wzmanager';
import PLAY_AUDIO from './playaudio';
import DRAW_IMAGE from './drawimage';

class Monster {
  static async fromOpts(opts) {
    const mob = new Monster(opts);
    await mob.load();
    return mob;
  }
  constructor(opts) {
    this.opts = opts;
  }
  async load() {
    const opts = this.opts;

    this.oId = opts.oId;
    this.id = opts.id;
    this.x = opts.x;
    this.y = opts.y;
    this.stance = opts.stance;
    this.fh = opts.fh;

    let strId = `${this.id}`.padStart(7, '0');
    let mobFile = await WZManager.get(`Mob.wz/${strId}.img`);
    if (!!mobFile.info.link) {
      const linkId = mobFile.info.link.nValue;
      strId = `${linkId}`.padStart(7, '0');
      mobFile = await WZManager.get(`Mob.wz/${strId}.img`);
    }
    this.mobFile = mobFile;

    const mobSounds = await WZManager.get('Sound.wz/Mob.img');
    const thisMobSounds = mobSounds.nGet(strId);
    this.sounds = thisMobSounds.nChildren.reduce((acc, node) => {
      try {
        const Node = node.nTagName === 'sound' ? node : node.nResolveUOL();
        acc[Node.nName] = Node.nGetAudio();
      } catch (ex) {
        console.error(`Broken UOL ${node.nGetPath()}`);
      }
      return acc;
    }, {});

    this.stances = {};
    mobFile.nChildren.filter(c => c.nName !== 'info').forEach(stance => {
      this.stances[stance.nName] = this.loadStance(mobFile, stance.nName);
    });

    this.setFrame(!this.stances.fly ? 'stand' : 'fly', 0);
  }
  loadStance(wzNode = {}, stance = 'stand') {
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
        console.log(`Unhandled frame=${frame.nTagName} for cls=Mob`, this);
      }
    });

    return {
      frames,
    };
  }
  playAudio(name) {
    if (!!this.sounds[name]) {
      PLAY_AUDIO(this.sounds[name], AudioManager.SFXVolume);
    }
  }
  die() {
    this.setFrame(!this.stances.die ? 'die1' : 'die');
    this.playAudio('Die');
    this.dying = true;
  }
  destroy() {
    this.destroyed = true;
  }
  setFrame(stance, frame = 0, carryOverDelay = 0) {
    if (!this.stances[stance]) {
      return;
    }

    const f = !this.stances[stance].frames[frame] ? 0 : frame;
    const stanceFrame = this.stances[stance].frames[f];

    this.stance = stance;
    this.frame = f;
    this.delay = carryOverDelay;
    this.nextDelay = stanceFrame.nGet('delay').nGet('nValue', 100);
  }
  update(msPerTick) {
    this.delay += msPerTick;

    if (this.delay > this.nextDelay) {
      const hasNextFrame = !!this.stances[this.stance].frames[this.frame + 1];
      if (!!this.dying && !hasNextFrame) {
        this.destroy();
        return;
      }
      this.setFrame(this.stance, this.frame + 1, this.delay - this.nextDelay);
    }
  }
  draw(camera, lag, msPerTick, tdelta) {
    const currentFrame = this.stances[this.stance].frames[this.frame];
    const currentImage = currentFrame.nGetImage();

    const originX = currentFrame.nGet('origin').nGet('nX', 0);
    const originY = currentFrame.nGet('origin').nGet('nY', 0);

    const adjustX = !this.flipped ? originX : (currentFrame.nWidth - originX);

    DRAW_IMAGE({
      img: currentImage,
      dx: this.x - camera.x - adjustX,
      dy: this.y - camera.y - originY,
      flipped: !!this.flipped,
    });
  }
}

export default Monster;

