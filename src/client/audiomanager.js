import WZManager from './wzmanager';

const AudioManager = {};

var musicVolume = 1;
var SFXVolume = 1;

AudioManager.playBGM = async function (name) {
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
    console.log(filename, child);
    const wzNode = await WZManager.get(`Sound.wz/${filename}.img/${child}`);
    this.bgm = wzNode.nGetAudio();
    this.bgm.loop = true;
    this.bgm.play();

    //Debug
    this.setMusicVolume(0.01);
    this.setSFXVolume(0.01);
  }
};

AudioManager.setMusicVolume = async function (vol) {
  if (typeof (vol) === 'number') {
    this.musicVolume = vol;
    this.bgm.volume = this.musicVolume;
  }
}

AudioManager.setSFXVolume = async function (vol) {
  if (typeof (vol) === 'number') {
    this.SFXVolume = vol;
  }
}

export default AudioManager;
