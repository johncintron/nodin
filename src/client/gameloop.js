import REQUEST_ANIMATION_FRAME from './raf';
import DRAW_RECT from './drawrect';
import Timer from './timer';
import GameCanvas from './gamecanvas';
import Camera from './camera';
import StateManager from './statemanager';

const GameLoop = {
  fps: 60,
  msPerTick: 1000/60,
  lag: 0,
};

GameLoop.doUpdate = function(msPerTick, camera) {
  StateManager.doUpdate(msPerTick, camera);
};

GameLoop.doRender = function(camera, lag, msPerTick, tdelta) {
  DRAW_RECT({ x: 0, y: 0, width: 800, height: 600, color: '#000000', });
  StateManager.doRender(camera, lag, msPerTick, tdelta);
};

GameLoop.postRender = function() {
  GameCanvas.resetMousewheel();
};

GameLoop.gameLoop = function(highResTimestamp) {
  REQUEST_ANIMATION_FRAME(GameLoop.gameLoop);

  Timer.update();
  GameLoop.lag += Timer.delta;
  while (GameLoop.lag >= GameLoop.msPerTick) {
    GameLoop.lag -= GameLoop.msPerTick;
    Timer.tdelta += GameLoop.msPerTick;
    GameLoop.doUpdate(GameLoop.msPerTick, Camera);
  }
  GameLoop.doRender(Camera, GameLoop.lag, GameLoop.msPerTick, Timer.tdelta);
  GameLoop.postRender();
};

export default GameLoop;
