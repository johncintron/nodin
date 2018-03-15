const Timer = {};

Timer.initialize = function() {
  this.getNow = !performance ? Date.now : performance.now.bind(performance);
  this.lastUpdate = this.getNow();
  this.delta = 0;
  this.tdelta = 0;
};

Timer.doReset = function() {
  this.lastUpdate = this.getNow();
  this.delta = 0;
  this.tdelta = 0;
};

Timer.update = function() {
  const now = this.getNow();
  this.delta = now - this.lastUpdate;
  this.lastUpdate = now;
};

export default Timer;
