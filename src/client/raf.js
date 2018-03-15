const REQUEST_ANIMATION_FRAME = (() => {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      setTimeout(() => {
        callback && callback();
      }, 1000 / 60);
    }
  );
})();

export default REQUEST_ANIMATION_FRAME;
