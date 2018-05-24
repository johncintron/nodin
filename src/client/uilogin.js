import DRAW_IMAGE from './drawimage';
import DRAW_TEXT from './drawtext';
import WZManager from './wzmanager';
import UICommon from './uicommon';
import MapleInput from './mapleinput';
import Random from './random';
import { MapleButton } from './maplebutton';
import MapleFrameButton from "./mapleframebutton";
import ClickManager from "./clickmanager";

const UILogin = {};

UILogin.initialize = async function() {
  await UICommon.initialize();
  const uiLogin = await WZManager.get('UI.wz/Login.img');

  this.frameImg = uiLogin.Common.frame.nGetImage();

  this.inputUsn = new MapleInput({
    x: 442,
    y: 240,
    width: 142,
    color: '#ffffff',
  });
  this.inputPwd = new MapleInput({
    x: 442,
    y: 269,
    width: 142,
    color: '#ffffff',
    type: 'password',
  });

  const loginButton = new MapleButton({
    x: 223,
    y: -85,
    img: uiLogin.Title.BtLogin.nChildren,
    onClick: self => {
      console.log('login!');
    }
  });
  ClickManager.addButton(loginButton);
  
  const dice = new MapleFrameButton({
    x: 245,
    y: -1835,
    img: uiLogin.NewChar.dice.nChildren,
    onEndFrame: self => {
      this.newCharStats = Random.generateDiceRollStats();
    },
    hoverAudio: false,
  });
  ClickManager.addButton(dice);
  
  this.newCharStats = Random.generateDiceRollStats();
};

UILogin.doUpdate = function(msPerTick, camera) {
  UICommon.doUpdate(msPerTick);
};

UILogin.doRender = function(camera, lag, msPerTick, tdelta) {
  DRAW_IMAGE({
    img: this.frameImg,
    dx: 0,
    dy: 0,
  });

  DRAW_TEXT({
    text: 'Ver. 0.62',
    fontWeight: 'bold',
    x: 595,
    y: 13,
  });

  UICommon.doRender(camera, lag, msPerTick, tdelta);
};

UILogin.removeInputs = function() {
  this.inputUsn.remove();
  this.inputPwd.remove();
  this.inputUsn = null;
  this.inputPwd = null;
};

export default UILogin;
