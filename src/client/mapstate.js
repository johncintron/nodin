import MapleMap from './maplemap';
import GameCanvas from './gamecanvas';
import MyCharacter from './mycharacter';
import Camera from './camera';
import UIMap from './uimap';

const MapState = {};

MapState.initialize = async function() {
  await MyCharacter.load();
  MyCharacter.activate();
  await MapleMap.load(200000000);
  await UIMap.initialize();
};

MapState.doUpdate = function(msPerTick) {
  if (!!MapleMap.doneLoading) {
    MapleMap.update(msPerTick);
    let x = Camera.x+400;
    let y = Camera.y+300;
    if (GameCanvas.isKeyDown('up')) {
      MyCharacter.y -= msPerTick;
    }
    if (GameCanvas.isKeyDown('down')) {
      MyCharacter.y += msPerTick;
    }
    if (GameCanvas.isKeyDown('left')) {
      MyCharacter.faceLeft();
      MyCharacter.x -= msPerTick;
    }
    if (GameCanvas.isKeyDown('right')) {
      MyCharacter.faceRight();
      MyCharacter.x += msPerTick;
    }
    //Camera.lookAt(x, y);
    Camera.lookAt(MyCharacter.x, MyCharacter.y-78);

    UIMap.doUpdate(msPerTick);
  }
};

MapState.doRender = function(camera, lag, msPerTick, tdelta) {
  if (!!MapleMap.doneLoading) {
    MapleMap.render(camera, lag, msPerTick, tdelta);
    UIMap.doRender(camera, lag, msPerTick, tdelta);
  }
};

export default MapState;
