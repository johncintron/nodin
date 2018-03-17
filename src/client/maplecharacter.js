import AudioManager from './audiomanager';
import WZManager from './wzmanager';
import DRAW_IMAGE from './drawimage';
import DRAW_TEXT from './drawtext';
import DRAW_RECT from './drawrect';
import MEASURE_TEXT from './measuretext';
import PLAY_AUDIO from './playaudio';

class MapleCharacter {
  static async fromOpts(opts) {
    const mc = new MapleCharacter(opts);
    await mc.load();
    return mc;
  }
  constructor(opts) {
    this.active = true;

    // body
    this.skinColor = opts.skinColor || 0;
    this.stance = opts.stance || 'stand1';
    this.frame = opts.frame || 0;
    this.delay = opts.delay || 0;
    this.nextDelay = opts.nextDelay || 0;
    this.oscillateFrames = false;
    this.oscillateFactor = 1;

    this.hair = opts.hair || 30030;

    // face
    this.face = opts.face || 20000;
    this.faceExpr = opts.faceExpr || 'blink';
    this.faceFrame = opts.faceFrame || 0;
    this.faceDelay = opts.faceDelay || 0;
    this.faceNextDelay = opts.faceNextDelay || 0;

    this.equips = [];

    this.flipped = false;

    this.id = opts.id;
    this.name = opts.name;
    this.x = opts.x;
    this.y = opts.y;
    this.gender = opts.gender || 0;
    // male shirt = 1040036 male boxers = 1060026
    // female shirt = 1041046 female boxers = 1061039
  }
  async load() {
    const zmap = await WZManager.get('Base.wz/zmap.img');
    const zmapDict = [...zmap.nChildren].reverse().reduce((acc, node, i) => {
      acc[node.nName] = i;
      return acc;
    }, {});
    this.zmap = {
      dict: zmapDict,
      indexOf: name => this.zmap.dict[name] || -1,
    };

    const smap = await WZManager.get('Base.wz/smap.img');
    const nonNullSmapNodes = smap.nChildren.filter(n => !!n.nValue);
    const smapDict = nonNullSmapNodes.reduce((acc, node) => {
      acc[node.nName] = node.nValue;
      return acc;
    }, {});
    const reverseSmapDict = nonNullSmapNodes.reduce((acc, node) => {
      if (!acc[node.nValue]) {
        acc[node.nValue] = new Set();
      }
      acc[node.nValue].add(node.nName);
      return acc;
    }, {});
    this.smap = {
      dict: smapDict,
      reverseDict: reverseSmapDict,
      getValueFromName: name => this.smap.dict[name],
      getNamesFromValue: value => this.smap.reverseDict[value],
    };

    await this.setSkinColor(this.skinColor);
    await this.setFace(this.face);
    await this.setHair(this.hair);
    this.setStance(this.stance);
  }
  async setSkinColor(sc = 0) {
    this.head = await WZManager.get(`Character.wz/0001200${sc}.img`);
    this.body = await WZManager.get(`Character.wz/0000200${sc}.img`);
    this.baseBody = await WZManager.get(`Character.wz/00002000.img`);
    this.skinColor = sc;
  }
  setStance(stance = 'stand1', frame = 0) {
    if (!!this.baseBody[stance]) {
      this.stance = stance;
      this.setFrame(frame);
      this.oscillateFrames = stance.startsWith('stand');
      this.oscillateFactor = 1;
    }
  }
  setFrame(frame = 0, carryOverDelay = 0) {
    this.frame = !this.baseBody[this.stance][frame] ? 0 : frame;

    this.delay = carryOverDelay;
    this.nextDelay = Math.abs(
      this.baseBody[this.stance][this.frame].nGet('delay').nGet('nValue', 100)
    );
  }
  advanceFrame() {
    const carryOverDelay = this.delay - this.nextDelay;
    if (!this.oscillateFrames) {
      this.setFrame(this.frame + 1, carryOverDelay);
    } else {
      const nextFrame = this.frame + 1 * this.oscillateFactor;
      if (!this.baseBody[this.stance][nextFrame]) {
        this.oscillateFactor *= -1;
      }
      const nextOscillatedFrame = this.frame + 1 * this.oscillateFactor;
      this.setFrame(nextOscillatedFrame, carryOverDelay);
    }
  }
  async setFace(face = 20000) {
    this.Face = await WZManager.get(`Character.wz/Face/000${face}.img`);
    this.face = face;
  }
  setFaceExpr(faceExpr = 'blink', faceFrame = 0) {
    if (!!this.Face[faceExpr]) {
      this.faceExpr = faceExpr;
      this.setFaceFrame(faceFrame);
    }
  }
  setFaceFrame(faceFrame = 0) {
    this.faceFrame = !this.Face[this.faceExpr][faceFrame] ? 0 : faceFrame;
  }
  advanceFaceFrame() {
    this.setFaceFrame(this.faceFrame + 1);
  }
  async setHair(hair = 30030) {
    this.Hair = await WZManager.get(`Character.wz/Hair/000${hair}.img`);
    this.hair = hair;
  }
  async attachEquip(slot, id) {
    const realSlot = slot < 0 ? -(slot + 1) : slot;
    const firstThreeDigits = Math.floor(id / 10000);
    const equipMap = {
      101: { dir: 'Accessory', slot: 1 }, // face accessory
      102: { dir: 'Accessory', slot: 2 }, // eye accessory
      103: { dir: 'Accessory', slot: 3 }, // earring
      112: { dir: 'Accessory', slot: 16 }, // necklace
      100: { dir: 'Cap', slot: 0 },
      110: { dir: 'Cape', slot: 8 },
      104: { dir: 'Coat', slot: 4 },
      108: { dir: 'Glove', slot: 7, },
      105: { dir: 'Longcoat', slot: 4 },
      106: { dir: 'Pants', slot: 5 },
      180: { dir: 'PetEquip', },
      181: { dir: 'PetEquip', },
      182: { dir: 'PetEquip', },
      183: { dir: 'PetEquip', },
      111: { dir: 'Ring', },
      109: { dir: 'Shield', slot: 9 },
      107: { dir: 'Shoes', slot: 6 },
      190: { dir: 'TamingMob', },
      191: { dir: 'TamingMob', },
      193: { dir: 'TamingMob', },
      130: { dir: 'Weapon', slot: 10 },
      131: { dir: 'Weapon', slot: 10 },
      132: { dir: 'Weapon', slot: 10 },
      133: { dir: 'Weapon', slot: 10 },
      137: { dir: 'Weapon', slot: 10 },
      138: { dir: 'Weapon', slot: 10 },
      139: { dir: 'Weapon', slot: 10 },
      140: { dir: 'Weapon', slot: 10 },
      141: { dir: 'Weapon', slot: 10 },
      142: { dir: 'Weapon', slot: 10 },
      143: { dir: 'Weapon', slot: 10 },
      144: { dir: 'Weapon', slot: 10 },
      145: { dir: 'Weapon', slot: 10 },
      146: { dir: 'Weapon', slot: 10 },
      147: { dir: 'Weapon', slot: 10 },
      148: { dir: 'Weapon', slot: 10 },
      149: { dir: 'Weapon', slot: 10 },
      160: { dir: 'Weapon', slot: 10 },
      170: { dir: 'Weapon', slot: 10 },
    };
    if (realSlot === equipMap[firstThreeDigits].slot) {
      const dir = equipMap[firstThreeDigits].dir;
      const equip = await WZManager.get(`Character.wz/${dir}/0${id}.img`);
      this.equips[realSlot] = equip;
    }
  }
  detachEquip(slot) {
    const realSlot = slot < 0 ? -(slot + 1) : slot;
    this.equips[realSlot] = undefined;
  }
  destroy() {
    this.destroyed = true;
  }
  deactivate() {
    this.active = false;
  }
  activate() {
    this.active = true;
  }
  flip() {
    this.flipped = !this.flipped;
  }
  faceLeft() {
    this.flipped = false;
  }
  faceRight() {
    this.flipped = true;
  }
  async playLevelUp() {
    const levelUpNode = await WZManager.get('Sound.wz/Game.img/LevelUp');
    const levelUpAudio = levelUpNode.nGetAudio();

    const lu = await WZManager.get('Effect.wz/BasicEff.img/LevelUp');
    this.levelUpFrames = lu.nChildren;

    PLAY_AUDIO(levelUpAudio, AudioManager.SFXVolume);
    this.levelingUp = true;
    this.levelUpFrame = 0;
    this.levelUpDelay = 0;
  }
  update(msPerTick) {
    if (!this.active) {
      return;
    }

    if (!!this.levelingUp) {
      this.levelUpDelay += msPerTick;
      if (this.levelUpDelay > 120) {
        this.levelUpDelay = this.levelUpDelay - 120;
        this.levelUpFrame += 1;
      }
      if (!this.levelUpFrames[this.levelUpFrame]) {
        this.levelingUp = false;
        this.levelUpFrame = 0;
        this.levelUpDelay = 0;
      }
    }

    this.delay += msPerTick;
    if (this.delay > this.nextDelay) {
      this.advanceFrame();
    }
  }
  getDrawableFrames(stance, frame, flipped) {
    const imgdir = this.baseBody[stance][frame];
    const realStance = !imgdir.action ? stance : imgdir.action.nValue;
    const realFrame = !imgdir.action ? frame : imgdir.frame.nValue;
    const faceExpr = this.faceExpr;
    const faceFrame = this.faceFrame;
    const useBackHead = !this.body[realStance][realFrame].face.nValue;

    const isDrawable = n => n.nTagName === 'canvas' || n.nTagName === 'uol';
    const getParts = img => img.nGet(realStance).nGet(realFrame).nChildren;
    const getFParts = img => img.nGet(faceExpr).nGet(faceFrame).nChildren;

    const twoChars = /.{1,2}/g;
    const [hat, faceAcc, ...equips] = this.equips;

    const hatVslot = !hat ? '' : hat.info.vslot.nValue;
    const hatParts = !hat ? [] : getParts(hat).filter(isDrawable);
    const hatSmapValues = hatParts.reduce((acc, p) => {
      try {
        const part = p.nTagName === 'uol' ? p.nResolveUOL() : p;
        return `${acc}${this.smap.getValueFromName(part.z.nValue)}`;
      } catch (ex) {
        console.error(`Broken UOL ${p.nGetPath()}`);
        return acc;
      }
    }, '');
    const hatVslotPairs = new Set(hatVslot.match(twoChars));
    const hatSmapPairs = new Set(hatSmapValues.match(twoChars));
    const hatSmapIntersection = new Set(
      [...hatVslotPairs].filter(val => hatSmapPairs.has(val))
    );

    const map = {};
    const drawableFrames = [];

    const addFrame = (p, vslot) => {
      try {
        p.nResolveUOL();
      } catch (ex) {
        console.error(`Broken UOL ${p.nGetPath()}`);
        return;
      }

      const part = p.nTagName === 'uol' ? p.nResolveUOL() : p;
      const pointInMap = vector => !!map[vector.nName];
      const pointNotInMap = vector => !map[vector.nName];

      const mappedPoints = part.map.nChildren.filter(pointInMap);
      const xSum = mappedPoints.reduce((acc, mappedPoint) => {
        const adjustedPointX = !flipped ? mappedPoint.nX : -mappedPoint.nX;
        return acc + map[mappedPoint.nName].x - adjustedPointX;
      }, 0);
      const ySum = mappedPoints.reduce((acc, mappedPoint) => {
        return acc + map[mappedPoint.nName].y - mappedPoint.nY;
      }, 0);
      const numMappedPoints = Math.max(mappedPoints.length, 1);
      let x = Math.floor(xSum / numMappedPoints);
      let y = Math.floor(ySum / numMappedPoints);

      part.map.nChildren.filter(pointNotInMap).forEach(mappedPoint => {
        map[mappedPoint.nName] = {
          x: x + (!flipped ? mappedPoint.nX : -mappedPoint.nX),
          y: y + mappedPoint.nY
        };
      });

      const originX = part.origin.nX;
      const adjustX = !flipped ? originX : (part.nWidth - originX);
      x -= adjustX;
      y -= part.origin.nY;

      const partVslot = vslot;
      const partSmapValue = this.smap.getValueFromName(part.z.nValue) || '';
      const partVslotPairs = new Set(vslot.match(twoChars));
      const partSmapPairs = new Set(partSmapValue.match(twoChars));
      const partSmapIntersection = new Set(
        [...partVslotPairs].filter(val => partSmapPairs.has(val))
      );
      const intersectionWithHat = [...partSmapIntersection].filter(val => {
        return hatSmapIntersection.has(val);
      });
      const invisibleZs = intersectionWithHat.reduce((acc, val) => {
        (this.smap.getNamesFromValue(val) || []).forEach(z => {
          acc.add(z);
        });
        return acc;
      }, new Set());
      if (invisibleZs.has(part.z.nValue)) {
        return;
      }

      const realZ = part.z.nValue === 0 ? part.nName : part.z.nValue;
      drawableFrames.push({
        img: part.nGetImage(),
        z: this.zmap.indexOf(realZ),
        x,
        y,
      });
    };

    const imgs = [
      this.body,
      this.head,
      this.Hair,
      this.Face,
      hat,
      faceAcc,
      ...equips
    ];

    imgs.forEach(img => {
      if (!img) {
        return;
      }

      const imgVslot = img.info.vslot.nValue;
      const isHead = img === this.head;
      const isFace = img === this.Face || img === faceAcc;
      const isHair = img === this.Hair;

      if (isFace && useBackHead) {
        return;
      }

      let imgParts;
      if (isHead) {
        imgParts = useBackHead ? img.back.nChildren : img.front.nChildren;
      } else if (isFace) {
        imgParts = getFParts(img);
      } else if (isHair) {
        imgParts = getParts(img).filter(n => n.nName !== 'hairShade');
      } else {
        imgParts = getParts(img);
      }

      const drawableImgParts = imgParts.filter(isDrawable);

      drawableImgParts.forEach(p => addFrame(p, imgVslot));
    });

    drawableFrames.sort((a, b) => a.z - b.z);

    return drawableFrames;
  }
  draw(camera, lag, msPerTick, tdelta) {
    const characterIsFlipped = !!this.flipped;
    const imgdir = this.baseBody[this.stance][this.frame];
    const imgdirFlip = !!imgdir.nGet('flip').nGet('nValue', 0);
    const frameIsFlipped = characterIsFlipped ^ imgdirFlip;

    const drawableFrames = this.getDrawableFrames(
      this.stance,
      this.frame,
      frameIsFlipped,
    );

    const mx = imgdir.nGet('move').nGet('nX', 0);
    const moveX = !characterIsFlipped ? mx : -mx;
    const moveY = imgdir.nGet('move').nGet('nY', 0);
    const rotate = imgdir.nGet('rotate').nGet('nValue', 0);
    const angle = !characterIsFlipped ? rotate : (360 - rotate);

    drawableFrames.forEach(frame => {
      DRAW_IMAGE({
        img: frame.img,
        dx: Math.floor(this.x + frame.x - camera.x + moveX),
        dy: Math.floor(this.y + frame.y - camera.y + moveY),
        flipped: frameIsFlipped,
        rx: -frame.x,
        ry: -frame.y,
        angle,
      });
    });

    this.drawName(camera, lag, msPerTick, tdelta);
  }
  drawName(camera, lag, msPerTick, tdelta) {
    const tagHeight = 16;
    const tagPadding = 4;
    const tagColor = '#000000';
    const tagAlpha = 0.7;
    const offsetFromY = 2;
    const nameOpts = {
      text: this.name,
      x: Math.floor(this.x - camera.x),
      y: Math.floor(this.y - camera.y + offsetFromY + 3),
      color: '#ffffff',
      align: 'center',
    };
    const nameWidth = Math.ceil(MEASURE_TEXT(nameOpts).width + tagPadding);
    const nameTagX = Math.round(this.x - camera.x - nameWidth / 2);
    DRAW_RECT({
      x: nameTagX,
      y: Math.floor(this.y - camera.y + offsetFromY),
      width: nameWidth,
      height: tagHeight,
      color: tagColor,
      alpha: tagAlpha,
    });
    DRAW_TEXT(nameOpts);
  }
}

export default MapleCharacter;

