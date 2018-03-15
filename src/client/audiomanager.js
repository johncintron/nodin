import WZManager from './wzmanager';

const AudioManager = {};

AudioManager.playBGM = async function(name) {
  if (name !== this.bgmName) {
    if (!!this.bgm) {
      this.bgm.pause();
      this.bgm.currentTime = 0;
    }
    this.bgmName = name;
    if (!name) {
      return;
    }
    const [filename, child] = name.split('/');
    const wzNode = await WZManager.get(`Sound.wz/${filename}.img/${child}`);
    this.bgm = wzNode.nGetAudio();
    this.bgm.loop = true;
    this.bgm.play();
  }
};

export default AudioManager;
