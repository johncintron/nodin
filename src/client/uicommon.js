import DRAW_IMAGE from './drawimage';
import GameCanvas from './gamecanvas';
import WZManager from './wzmanager';
import PLAY_AUDIO from './playaudio';

const UICommon = {};

UICommon.initialize = async function() {
  const cursor = await WZManager.get('UI.wz/Basic.img/Cursor');

  this.cursorImg = cursor[0][0].nGetImage();
  this.cursorOrigin = cursor[0][0].origin;

  this.cursorDownImg = cursor[12][0].nGetImage();
  this.cursorDownOrigin = cursor[12][0].origin;


  const sounds = await WZManager.get('Sound.wz/UI.img');

  this.clickAudio = sounds.BtMouseClick.nGetAudio();
  this.hoverAudio = sounds.BtMouseOver.nGetAudio();
};

UICommon.playMouseClickAudio = function() {
  PLAY_AUDIO(this.clickAudio);
};

UICommon.playMouseHoverAudio = function() {
  PLAY_AUDIO(this.hoverAudio);
};

UICommon.doUpdate = function(msPerTick) {
};

UICommon.doRender = function(camera, lag, msPerTick, tdelta) {
  const clicked = GameCanvas.clicked;
  const cursorImg = !clicked ? this.cursorImg : this.cursorDownImg;
  const cursorOrigin = !clicked ? this.cursorOrigin : this.cursorDownOrigin;

  cursorImg.style.position = 'absolute';
  cursorImg.style.zIndex = 4;
  cursorImg.style.pointerEvents = 'none';
  cursorImg.style.left = `${GameCanvas.mouseX - cursorOrigin.nX}px`;
  cursorImg.style.top = `${GameCanvas.mouseY - cursorOrigin.nY}px`;

  !!this.currentCursor && this.currentCursor.remove();
  this.currentCursor = cursorImg;
  GameCanvas.gameWrapper.appendChild(cursorImg);
};

export default UICommon;
