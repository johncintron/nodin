import StateManager from './statemanager';
import MapState from './mapstate';
import MapleMap from './maplemap';
import MyCharacter from './mycharacter';
import Camera from './camera';
import UILogin from './uilogin';

const LoginState = {};

LoginState.initialize = async function() {
  MyCharacter.deactivate();
  await MapleMap.load('MapLogin');
  await UILogin.initialize();

  Camera.x = -372;
  Camera.y = -308;
};

LoginState.doUpdate = function(msPerTick, camera) {
  if (!!MapleMap.doneLoading) {
    MapleMap.update(msPerTick);
    UILogin.doUpdate(msPerTick, camera);
  }
};

LoginState.doRender = function(camera, lag, msPerTick, tdelta) {
  if (!!MapleMap.doneLoading) {
    MapleMap.render(camera, lag, msPerTick, tdelta);
    UILogin.doRender(camera, lag, msPerTick, tdelta);
  }
};

LoginState.enterGame = async function() {
  UILogin.removeInputs();
  await StateManager.setState(MapState);
};

export default LoginState;
