import WZManager from './wzmanager';
import DRAW_IMAGE from './drawimage';

import Background from './background';
import Foothold from './foothold';
import Portal from './portal';
import Tile from './tile';
import Obj from './obj';
import NPC from './npc';
import Monster from './monster';
import MapleCharacter from './maplecharacter';
import MyCharacter from './mycharacter';

import AudioManager from './audiomanager';
import Camera from './camera'; //debugging
import Timer from './timer';

const MapleMap = {};

MapleMap.load = async function(id) {
  this.doneLoading = false;

  let filename = 'UI.wz/MapLogin.img';
  if (id !== 'MapLogin') {
    const prefix = Math.floor(id/100000000);
    const strId = `${id}`.padStart(9, '0');
    filename = `Map.wz/Map/Map${prefix}/${strId}.img`;
  }
  this.wzNode = await WZManager.get(filename);

  this.npcs = [];
  this.monsters = [];
  this.characters = [];

  await AudioManager.playBGM(this.wzNode.info.bgm.nValue);
  this.footholds = this.loadFootholds(this.wzNode.foothold);
  this.boundaries = this.loadBoundaries(this.wzNode, this.footholds);
  Camera.setBoundaries(this.boundaries); //debugging
  Camera.lookAt(this.boundaries.left, this.boundaries.top);//debugging
  this.backgrounds = await this.loadBackgrounds(this.wzNode.back);
  this.tiles = await this.loadTiles(this.wzNode);
  this.objects = await this.loadObjects(this.wzNode);
  this.portals = await this.loadPortals(this.wzNode.portal);
  this.names = await this.loadNames(id);
  await this.loadNPCs(this.wzNode.life);
  await this.loadMonsters(this.wzNode.life);

  const xMid = Math.floor((this.boundaries.right + this.boundaries.left) / 2);
  const yMid = Math.floor((this.boundaries.bottom + this.boundaries.top) / 2);
  MyCharacter.x = xMid;
  MyCharacter.y = yMid;

  Timer.doReset();

  this.id = id;
  this.doneLoading = true;
};

MapleMap.loadFootholds = function(wzNode) {
  const footholds = {};

  wzNode.nChildren.forEach(layer => {
    layer.nChildren.forEach(group => {
      group.nChildren.forEach(fhNode => {
        const fh = Foothold.fromWzNode(fhNode);
        footholds[fh.id] = fh;
      });
    });
  });

  Object.values(footholds).forEach(fh => {
    fh.prev = footholds[fh.prev];
    fh.next = footholds[fh.next];
  });

  return footholds;
};

MapleMap.loadBackgrounds = async function(wzNode) {
  const backgrounds = [];

  for (const backNode of wzNode.nChildren) {
    if (!backNode.bS.nValue) {
      continue;
    }

    const bg = await Background.fromWzNode(backNode);
    backgrounds.push(bg);
  }

  backgrounds.sort((a, b) => a.z-b.z);

  return backgrounds;
};

MapleMap.loadPortals = async function(wzNode) {
  const portals = [];

  for (const portalNode of wzNode.nChildren) {
    const portal = await Portal.fromWzNode(portalNode);
    portals.push(portal);
  }

  return portals;
};

MapleMap.loadNames = async function(id) {
  const strMap = await WZManager.get('String.wz/Map.img');

  const firstDigit = Math.floor(id/100000000);
  const firstTwoDigits = Math.floor(id/10000000);
  const firstThreeDigits = Math.floor(id/1000000);

  let area = 'maple';
  if (firstTwoDigits === 54) {
    area = 'singapore';
  } else if (firstDigit === 9) {
    area = 'etc';
  } else if (firstDigit === 8) {
    area = 'jp';
  } else if (firstThreeDigits === 682) {
    area = 'HalloweenGL';
  } else if (firstTwoDigits === 60 || firstTwoDigits === 61) {
    area = 'MasteriaGL';
  } else if (firstTwoDigits === 67 || firstTwoDigits === 68) {
    area = 'weddingGL';
  } else if (firstDigit === 2) {
    area = 'ossyria';
  } else if (firstDigit === 1) {
    area = 'victoria';
  }

  const nameNode = strMap.nGet(area).nGet(id);
  const streetName = nameNode.nGet('streetName').nGet('nValue', '');
  const mapName = nameNode.nGet('mapName').nGet('nValue', '');

  return {
    streetName,
    mapName,
  };
};

MapleMap.loadTiles = async function(wzNode) {
  const tiles = [];

  for (let layer = 0; layer <= 7; layer += 1) {
    for (const tileNode of wzNode[layer].tile.nChildren) {
      const tile = await Tile.fromWzNode(tileNode);
      tile.layer = layer;
      tiles.push(tile);
    }
  }

  tiles.sort((a, b) => a.z-b.z);

  return tiles;
};

MapleMap.loadObjects = async function(wzNode) {
  const objects = [];

  for (let layer = 0; layer <= 7; layer += 1) {
    for (const objNode of wzNode[layer].obj.nChildren) {
      const obj = await Obj.fromWzNode(objNode);
      obj.layer = layer;
      objects.push(obj);
    }
  }

  objects.sort((a, b) => a.z === b.z ? a.zid-b.zid : a.z-b.z);

  return objects;
};

MapleMap.spawnMonster = async function(opts={}) {
  const mob = await Monster.fromOpts(opts);
  const whichFoothold = this.footholds[mob.fh];
  if (!!whichFoothold) {
    mob.layer = whichFoothold.layer;
  }

  this.monsters.push(mob);
};

MapleMap.loadMonsters = async function(wzNode) {
  for (const mobNode of wzNode.nChildren.filter(n => n.type.nValue === 'm')) {
    await this.spawnMonster({
      oId: null,
      id: mobNode.id.nValue,
      x: mobNode.x.nValue,
      y: mobNode.y.nValue,
      stance: '',
      fh: mobNode.fh.nValue,
    });
  }
};

MapleMap.spawnNPC = async function(opts={}) {
  const npc = await NPC.fromOpts(opts);
  const whichFoothold = this.footholds[npc.fh];
  if (!!whichFoothold) {
    npc.layer = whichFoothold.layer;
  }

  this.npcs.push(npc);
};

MapleMap.loadNPCs = async function(wzNode) {
  for (const npcNode of wzNode.nChildren.filter(n => n.type.nValue === 'n')) {
    await this.spawnNPC({
      oId: null,
      id: npcNode.id.nValue,
      x: npcNode.x.nValue,
      cy: npcNode.cy.nValue,
      f: npcNode.nGet('f').nGet('nValue', 0),
      fh: npcNode.fh.nValue,
      rx0: npcNode.rx0.nValue,
      rx1: npcNode.rx1.nValue,
    });
  }
};

MapleMap.loadBoundaries = function(wzNode, footholds) {
  if ('VRLeft' in wzNode.info) {
    return {
      left: wzNode.info.VRLeft.nValue,
      right: wzNode.info.VRRight.nValue,
      top: wzNode.info.VRTop.nValue,
      bottom: wzNode.info.VRBottom.nValue,
    };
  }

  const xValues = Object.values(footholds).reduce((acc, fh) => {
    acc.push(fh.x1, fh.x2);
    return acc;
  }, []);

  const yValues = Object.values(footholds).reduce((acc, fh) => {
    acc.push(fh.y1, fh.y2);
    return acc;
  }, []);

  return {
    left: Math.min(...xValues) + 10,
    right: Math.max(...xValues) - 10,
    top: Math.min(...yValues) - 360,
    bottom: Math.max(...yValues) + 110,
  };
};

MapleMap.update = function(msPerTick) {
  if (!this.doneLoading) {
    return;
  }

  // handle destroyed objects
  this.monsters = this.monsters.filter(m => !m.destroyed);

  this.backgrounds.forEach(bg => bg.update(msPerTick));
  this.objects.forEach(obj => obj.update(msPerTick));
  this.npcs.forEach(npc => npc.update(msPerTick));
  this.monsters.forEach(mob => mob.update(msPerTick));
  this.characters.forEach(chr => chr.update(msPerTick));
  this.portals.forEach(p => p.update(msPerTick));

  MyCharacter.update(msPerTick);
};

MapleMap.render = function(camera, lag, msPerTick, tdelta) {
  if (!this.doneLoading) {
    return;
  }

  const draw = obj => obj.draw(camera, lag, msPerTick, tdelta);

  this.backgrounds.filter(bg => !bg.front).forEach(draw);

  for (let i = 0; i <= 7; i += 1) {
    const inCurrentLayer = obj => obj.layer === i;
    this.objects.filter(inCurrentLayer).forEach(draw);
    this.tiles.filter(inCurrentLayer).forEach(draw);
    this.monsters.filter(inCurrentLayer).forEach(draw);
    this.characters.filter(inCurrentLayer).forEach(draw);
    this.npcs.filter(inCurrentLayer).forEach(draw);
  }
  // how about obj.layer = null?
  const notInAnyLayer = obj => !(obj.layer >= 0 && obj.layer <= 7);

  this.monsters.filter(notInAnyLayer).forEach(draw);
  this.characters.filter(notInAnyLayer).forEach(draw);
  this.npcs.filter(notInAnyLayer).forEach(draw);

  if (!!MyCharacter.active) {
    MyCharacter.draw(camera, lag, msPerTick, tdelta);
  }

  this.portals.forEach(draw);

  this.backgrounds.filter(bg => !!bg.front).forEach(draw);

  // draw speech bubbles
  // draw levelup
  const drawLevelUp = c => {
    const levelUpFrame = c.levelUpFrames[c.levelUpFrame];
    DRAW_IMAGE({
      img: levelUpFrame.nGetImage(),
      dx: c.x - levelUpFrame.origin.nX - camera.x,
      dy: c.y - levelUpFrame.origin.nY - camera.y,
    });
  };
  this.characters.filter(c => !!c.levelingUp).forEach(drawLevelUp);
  if (!!MyCharacter.levelingUp) {
    drawLevelUp(MyCharacter);
  }
  // draw damage

  Object.values(this.footholds).forEach(draw);
};

export default MapleMap;
