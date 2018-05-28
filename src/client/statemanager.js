import ClickManager from './clickmanager';

const StateManager = {};

StateManager.initialize = function() {
  this.currentState = undefined;
  this.transitioning = false;
};

StateManager.setState = async function(state) {
  this.transitioning = true;
  ClickManager.clearButton();
  await state.initialize();
  this.currentState = state;
  this.transitioning = false;
};

StateManager.doUpdate = function(msPerTick, camera) {
  if (!this.transitioning) {
    this.currentState.doUpdate(msPerTick, camera);
    ClickManager.doUpdate(msPerTick, camera);
  }
};

StateManager.doRender = function(camera, lag, msPerTick, tdelta) {
  if (!this.transitioning) {
    this.currentState.doRender(camera, lag, msPerTick, tdelta);
  }
};

export default StateManager;
