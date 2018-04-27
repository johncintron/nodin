import DRAW_IMAGE from './drawimage';
import DRAW_TEXT from './drawtext';
import PLAY_AUDIO from './playaudio';
import DRAW_RECT from './drawrect';
import GameCanvas from './gamecanvas';
import WZManager from './wzmanager';
import UICommon from './uicommon';
import MapleInput from './mapleinput';
import MapleMap from './maplemap';
import GUIUtil from './guiutil';
import Random from './random';
import Timer from './timer';
import Easing from './easing';

const UILogin = {};

UILogin.initialize = async function() {
  await UICommon.initialize();
  const uiLogin = await WZManager.get('UI.wz/Login.img');
  console.dir(uiLogin);
  
  this.NUMBER_OF_WORLDS = 20;
  this.cameraWork = {
    start: 0,
    end: 0,
    startTime: 0,
    duration: 400,
    work: false,
    step: () => {
      const diff = Timer.getNow() - this.cameraWork.startTime;
      const state = diff / this.cameraWork.duration;
      const pos = Easing.easeOutQuart(state, diff, 0, 1, this.cameraWork.duration);
      console.log(pos);
      if (pos > 0.999) {
        this.cameraWork.work = false;
        return this.cameraWork.end;
      }
      return this.cameraWork.start + ((this.cameraWork.end - this.cameraWork.start) * pos);
    },
  };
  
  this.clicked = false;
  this.lastClickedPosition = {};
  this.activeButton = null;

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

  this.loginButtonX = 223;
  this.loginButtonY = -85;
  this.loginButton = {
    stance: 'normal',
    stances: uiLogin.Title.BtLogin.nChildren.reduce((stances, stance) => {
      stances[stance.nName] = stance.nChildren[0];
      return stances;
    }, {}),
    update: msPerTick => {
    },
    draw: (camera, lag, msPerTick, tdelta) => {
      const currentFrame = this.loginButton.stances[this.loginButton.stance];
      const currentImage = currentFrame.nGetImage();
      DRAW_IMAGE({
        img: currentImage,
        dx: this.loginButtonX - camera.x,
        dy: this.loginButtonY - camera.y,
      });
    },
    layer: 2,
  };
  // Login button appears above signboard and below effect
  MapleMap.objects.push(this.loginButton);

  const dice = uiLogin.NewChar.dice;
  this.dice = dice.nChildren;
  this.diceFrame = 0;
  this.diceX = 245;
  this.diceY = -1835;
  this.canClickDice = true;
  this.updateDice = false;
  this.diceDelay = 100;

  this.newCharStats = Random.generateDiceRollStats();
  
  const sounds = await WZManager.get('Sound.wz/UI.img');
  
  this.rollUpAudio = sounds.RollUp.nGetAudio();
  this.rollDownAudio = sounds.RollDown.nGetAudio();
  this.scrollUpAudio = sounds.ScrollUp.nGetAudio();
  
  const scrollDelay = 100;
  
  this.scrollX = -210;
  this.scrollY = -830;
  this.scrollDelay = scrollDelay;
  this.scroll = {
    stance: 0,
    stances: uiLogin.WorldSelect.scroll.nChildren[0].nChildren.reduce((stances, stance) => {
      stances[Number(stance.nName)] = stance;
      return stances;
    }, {}),
    open: false,
    show: false,
    update: msPerTick => {
      if (this.scroll.open && (this.scroll.stance !== 3)) {
        this.scrollDelay -= msPerTick;
        if (this.scrollDelay <= 0) {
          this.scroll.stance += 1;
          this.scrollDelay = scrollDelay - this.scrollDelay;
        }
        if (this.scroll.stance === 3) {
          this.scroll.show = true;
          this.scrollDelay = scrollDelay;
        }
      } else if (!this.scroll.open && (this.scroll.stance !== 0)) {
        this.scrollDelay -= msPerTick;
        if (this.scrollDelay <= 0) {
          this.scroll.stance -= 1;
          this.scrollDelay = scrollDelay - this.scrollDelay;
        }
        if (this.scroll.stance === 2) {
          this.scroll.show = false;
        }
        if (this.scroll.stance === 0) {
          this.scrollDelay = scrollDelay;
        }
      }
    },
    draw: (camera, lag, msPerTick, tdelta) => {
      const currentFrame = this.scroll.stances[this.scroll.stance];
      const currentImage = currentFrame.nGetImage();
      DRAW_IMAGE({
        img: currentImage,
        dx: this.scrollX - camera.x,
        dy: this.scrollY - camera.y,
      });
    },
    layer: 2,
  };
  MapleMap.objects.push(this.scroll);
  
  this.worldSelectAudio = sounds.WorldSelect.nGetAudio();
  
  this.worldsX = 300;
  this.worldsY = -805;
  this.worldsGap = 27;
  this.worlds = [];
  for(let i = 0; i < this.NUMBER_OF_WORLDS; i++) {
    this.worlds.push({
      stance: 'normal',
      stances: uiLogin.WorldSelect.BtWorld[i].nChildren.reduce((stances, stance) => {
        stances[stance.nName] = stance.nChildren[0];
        return stances;
      }, {}),
      active: false,
      id: i,
      update: msPerTick => {
      },
      draw: (camera, lag, msPerTick, tdelta) => {
        const nStance = this.worlds[i].active ? 'pressed' : this.worlds[i].stance;
        const currentFrame = this.worlds[i].stances[nStance];
        const currentImage = currentFrame.nGetImage();
        DRAW_IMAGE({
          img: currentImage,
          dx: this.worldsX - camera.x - this.worldsGap * i,
          dy: this.worldsY - camera.y,
        });
      },
      layer: 2,
    });
    MapleMap.objects.push(this.worlds[i]);
  }
  
  this.worldLogoX = -135;
  this.worldLogoY = -690;
  this.worldLogo = {
    stance: 0,
    stances: uiLogin.WorldSelect.world.nChildren.reduce((stances, stance) => {
      const no = Number(stance.nName);
      if (!Number.isNaN(no)) {
        stances[no] = stance;
      }
      return stances;
    }, {}),
    update: msPerTick => {
    },
    draw: (camera, lag, msPerTick, tdelta) => {
      if (this.scroll.show) {
        const currentFrame = this.worldLogo.stances[this.worldLogo.stance];
        const currentImage = currentFrame.nGetImage();
        DRAW_IMAGE({
          img: currentImage,
          dx: this.worldLogoX - camera.x,
          dy: this.worldLogoY - camera.y,
        });
      }
    },
    layer: 2,
  };
  MapleMap.objects.push(this.worldLogo);
  
  this.channelsX = -135;
  this.channelsY = -632;
  this.channelsRowGap = 32;
  this.channelsColGap = 94;
  this.chgaugeX = -128;
  this.chgaugeY = -615;
  this.channels = [];
  const chgauge = uiLogin.WorldSelect.channel.chgauge;
  const chgaugeImage = uiLogin.WorldSelect.channel.chgauge.nGetImage();
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 4; col++) {
      let index = row * 4 + col;
      this.channels.push({
        stance: 'normal',
        stances: uiLogin.WorldSelect.channel[index].nChildren.reduce((stances, stance) => {
          stances[stance.nName] = stance;
          return stances;
        }, {}),
        gauge: 50,
        update: msPerTick => {
        },
        draw: (camera, lag, msPerTick, tdelta) => {
          if (this.scroll.show) {
            const currentFrame = this.channels[index].stances[this.channels[index].stance];
            const currentImage = currentFrame.nGetImage();
            DRAW_IMAGE({
              img: currentImage,
              dx: this.channelsX - camera.x + this.channelsColGap * col,
              dy: this.channelsY - camera.y + this.channelsRowGap * row,
            });
            DRAW_IMAGE({
              img: chgaugeImage,
              dx: this.chgaugeX - camera.x + this.channelsColGap * col,
              dy: this.chgaugeY - camera.y + this.channelsRowGap * row,
              sw: chgauge.nWidth * (this.channels[index].gauge / 100),
              sh: chgauge.nHeight,
            });
          }
        },
        layer: 2,
      });
      MapleMap.objects.push(this.channels[index]);
    }
  }
};

UILogin.playRollUpAudio = function() {
  PLAY_AUDIO(this.rollUpAudio);
};

UILogin.playRollDownAudio = function() {
  PLAY_AUDIO(this.rollDownAudio);
};

UILogin.playScrollUpAudio = function() {
  PLAY_AUDIO(this.scrollUpAudio);
};

UILogin.playWorldSelectAudio = function() {
  PLAY_AUDIO(this.worldSelectAudio);
};

UILogin.smoothCameraWork = function(moveY, camera, duration=400) {
  this.cameraWork.startTime = Timer.getNow();
  this.cameraWork.duration = duration;
  this.cameraWork.start = camera.y;
  this.cameraWork.end = camera.y + moveY;
  this.cameraWork.work = true;
};

UILogin.doUpdate = function(msPerTick, camera) {
  const mousePoint = { x: GameCanvas.mouseX, y: GameCanvas.mouseY };
  const clickedOnLastUpdate = this.clicked;
  const clickedOnThisUpdate = GameCanvas.clicked;
  const releasedClick = clickedOnLastUpdate && !clickedOnThisUpdate;
  const lastActiveButton = this.activeButton;
  let currActiveButton = null;

  if (this.cameraWork.work) {
    camera.y = this.cameraWork.step();
  }

  const loginButtonImage = this.loginButton.stances.normal.nGetImage();
  const loginButtonRect = {
    x: this.loginButtonX - camera.x,
    y: this.loginButtonY - camera.y,
    width: loginButtonImage.width,
    height: loginButtonImage.height,
  };
  const hoverLogin = GUIUtil.pointInRectangle(mousePoint, loginButtonRect);
  if (hoverLogin) {
    currActiveButton = this.loginButton;
  }

  const dice = this.dice[0];
  const diceImage = dice.nGetImage();
  const diceRect = {
    x: this.diceX - camera.x - dice.origin.nX,
    y: this.diceY - camera.y - dice.origin.nY,
    width: diceImage.width,
    height: diceImage.height,
  };
  const hoverDice = GUIUtil.pointInRectangle(mousePoint, diceRect);
  if (hoverDice) {
    currActiveButton = this.dice;
  }

  let worldRect = undefined;
  let world = undefined;
  for (let i = 0; i < this.NUMBER_OF_WORLDS; i++) {
    world = this.worlds[i];
    const worldImage = world.stances.normal.nGetImage();
    worldRect = {
      x: this.worldsX - camera.x - this.worldsGap * i,
      y: this.worldsY - camera.y,
      width: worldImage.width,
      height: worldImage.height,
    };
    const hoverWorld = GUIUtil.pointInRectangle(mousePoint, worldRect);
    if (hoverWorld) {
      currActiveButton = world;
      break;
    }
  }

  if (lastActiveButton !== currActiveButton) {
    this.activeButton = currActiveButton;

    // reset all buttons
    this.loginButton.stance = 'normal';
    this.worlds.forEach(w => w.stance = 'normal');

    if (this.activeButton === this.loginButton) {
      UICommon.playMouseHoverAudio();
      this.loginButton.stance = 'mouseOver';
    }

    if (this.activeButton === world) {
      if (world.stance !== 'mouseOver' && world.stance !== 'pressed') {
        UICommon.playMouseHoverAudio();
      }
      world.stance = 'mouseOver';
    }
  }

  // update active button
  if (this.activeButton === this.loginButton) {
    const originallyClickedLoginButton = GUIUtil.pointInRectangle(
      this.lastClickedPosition,
      loginButtonRect
    );
    if (clickedOnThisUpdate) {
      const s = !originallyClickedLoginButton ? 'mouseOver' : 'pressed';
      this.loginButton.stance = s;
    } else {
      this.loginButton.stance = 'mouseOver';
      const trigger = releasedClick && originallyClickedLoginButton;
      if (trigger) {
        UICommon.playMouseClickAudio();
        this.removeInputs();
        console.log('login!');
        this.playScrollUpAudio();
        this.smoothCameraWork(-600, camera, 800);
      }
    }
  } else if (this.activeButton === this.dice) {
    const originallyClickedDice = GUIUtil.pointInRectangle(
      this.lastClickedPosition,
      diceRect
    );
    if (releasedClick && originallyClickedDice && this.canClickDice) {
      this.canClickDice = false;
      this.updateDice = true;
      UICommon.playMouseClickAudio();
    }
  } else if (this.activeButton === world) {
    const originallyClickedWorld = GUIUtil.pointInRectangle(
        this.lastClickedPosition,
        worldRect
    );
    if (clickedOnThisUpdate) {
      const s = !originallyClickedWorld ? 'mouseOver' : 'pressed';
      world.stance = s;
    } else {
      world.stance = 'mouseOver';
      const trigger = releasedClick && originallyClickedWorld;
      if (trigger) {
        UICommon.playMouseClickAudio();
        if (!this.scroll.open) {
          this.playRollDownAudio();
        }
        this.worlds.forEach(w => w.active = false);
        world.active = true;
        this.scroll.open = true;
        this.worldLogo.stance = world.id;
        console.log('World clicked');
      }
    }
  }

  if (this.updateDice) {
    this.diceDelay -= msPerTick;
    if (this.diceDelay <= 0) {
      this.diceFrame += 1;
      this.diceDelay = 100 - this.diceDelay;
    }
    const diceDoneRolling = this.diceFrame === 4;
    if (diceDoneRolling) {
      this.newCharStats = Random.generateDiceRollStats();
      this.diceFrame = 0;
      this.diceDelay = 100;
      this.updateDice = false;
      this.canClickDice = true;
    }
  }

  if (clickedOnThisUpdate) {
    if (!clickedOnLastUpdate) {
      this.lastClickedPosition = mousePoint;
    }
    this.clicked = true;
  } else {
    this.clicked = false;
  }

  UICommon.doUpdate(msPerTick);
};

UILogin.doRender = function(camera, lag, msPerTick, tdelta) {
  const currDiceFrame = this.dice[this.diceFrame];
  const currDiceImage = currDiceFrame.nGetImage();
  DRAW_IMAGE({
    img: currDiceImage,
    dx: this.diceX - camera.x - currDiceFrame.origin.nX,
    dy: this.diceY - camera.y - currDiceFrame.origin.nY,
  });

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
