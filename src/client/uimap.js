import DRAW_IMAGE from './drawimage';
import DRAW_TEXT from './drawtext';
import GameCanvas from './gamecanvas';
import MyCharacter from './mycharacter';
import WZManager from './wzmanager';
import UICommon from './uicommon';

const UIMap = {};

UIMap.initialize = async function() {
  await UICommon.initialize();

  const basic = await WZManager.get('UI.wz/Basic.img');
  this.statusBarLevelDigits = basic.LevelNo.nChildren.map(d => d.nGetImage());

  const statusBar = await WZManager.get('UI.wz/StatusBar.img');
  this.statusBg = statusBar.base.backgrnd.nGetImage();
  this.statusBg2 = statusBar.base.backgrnd2.nGetImage();
  this.bars = statusBar.gauge.bar.nGetImage();
  this.graduation = statusBar.gauge.graduation.nGetImage();
  this.barGray = statusBar.gauge.gray.nGetImage();

  this.numbers = statusBar.number.nChildren.reduce((numbers, node) => {
    numbers[node.nName] = node.nGetImage();
    return numbers;
  }, {});
};

UIMap.doUpdate = function(msPerTick) {

  UICommon.doUpdate(msPerTick);
};

UIMap.drawLevel = function(level) {
  const dy = 576;
  if (level >= 100) {
    const first = Math.floor(level / 100);
    const second = (Math.floor(level / 10) - 10) % 10;
    const third = level % 10;
    DRAW_IMAGE({
      img: this.statusBarLevelDigits[first],
      dx: 36,
      dy,
    });
    DRAW_IMAGE({
      img: this.statusBarLevelDigits[second],
      dx: 48,
      dy,
    });
    DRAW_IMAGE({
      img: this.statusBarLevelDigits[third],
      dx: 60,
      dy,
    });
  } else if (level >= 10) {
    const first = Math.floor(level / 10);
    const second = level % 10;
    DRAW_IMAGE({
      img: this.statusBarLevelDigits[first],
      dx: 42,
      dy,
    });
    DRAW_IMAGE({
      img: this.statusBarLevelDigits[second],
      dx: 54,
      dy,
    });
  } else {
    DRAW_IMAGE({
      img: this.statusBarLevelDigits[level],
      dx: 48,
      dy,
    });
  }
};

UIMap.drawNumbers = function(hp, maxHp, mp, maxMp) {
  DRAW_IMAGE({
    img: this.numbers.Lbracket,
    dx: 234,
    dy: 570,
  });

  const hpX = [...`${hp}`, 'slash', ...`${maxHp}`].reduce((x, digit) => {
    DRAW_IMAGE({
      img: this.numbers[digit],
      dx: x,
      dy: 571,
    });
    x += this.numbers[digit].width + 1;
    return x;
  }, 238);

  DRAW_IMAGE({
    img: this.numbers.Rbracket,
    dx: hpX + 1,
    dy: 570,
  });

  DRAW_IMAGE({
    img: this.numbers.Lbracket,
    dx: 346,
    dy: 570,
  });

  const mpX = [...`${mp}`, 'slash', ...`${maxMp}`].reduce((x, digit) => {
    DRAW_IMAGE({
      img: this.numbers[digit],
      dx: x,
      dy: 571,
    });
    x += this.numbers[digit].width + 1;
    return x;
  }, 350);

  DRAW_IMAGE({
    img: this.numbers.Rbracket,
    dx: mpX + 1,
    dy: 570,
  });
};

UIMap.doRender = function(camera, lag, msPerTick, tdelta) {
  DRAW_IMAGE({
    img: this.statusBg,
    dx: 0,
    dy: 529,
  });

  DRAW_IMAGE({
    img: this.statusBg2,
    dx: 0,
    dy: 529,
  });

  this.drawLevel(MyCharacter.level);

  DRAW_TEXT({
    text: MyCharacter.name,
    color: '#ffffff',
    x: 85,
    y: 585,
  });

  DRAW_IMAGE({
    img: this.bars,
    dx: 215,
    dy: 567,
  });

  const { hp, maxHp, mp, maxMp } = MyCharacter;

  const numHpGrays = 105 - Math.floor((hp / maxHp) * 105);
  for (let i = 0; i < numHpGrays; i += 1) {
    DRAW_IMAGE({
      img: this.barGray,
      dx: 321 - i,
      dy: 581,
    });
  }

  const numMpGrays = 105 - Math.floor((mp / maxMp) * 105);
  for (let i = 0; i < numMpGrays; i += 1) {
    DRAW_IMAGE({
      img: this.barGray,
      dx: 429 - i,
      dy: 581,
    });
  }

  DRAW_IMAGE({
    img: this.graduation,
    dx: 215,
    dy: 566,
  });

  this.drawNumbers(hp, maxHp, mp, maxMp);

  UICommon.doRender(camera, lag, msPerTick, tdelta);
};

export default UIMap;
