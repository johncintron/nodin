import { MapleButton, STANCE } from './maplebutton';
import MapleFrameButton from './mapleframebutton';
import UICommon from './uicommon'
import GUIUtil from './guiutil';
import GameCanvas from './gamecanvas';
import MapleMap from './maplemap';

const ClickManager = {};

ClickManager.initialize = function() {
  this.clicked = false;
  this.lastClickedPosition = {};
  this.activeButton = null;
  this.buttons = {
    normalButton: [],
    frameButton: [],
  }
};

ClickManager.doUpdate = function(msPerTick, camera) {
  if (this.buttons.normalButton.length === 0 && this.buttons.frameButton.length === 0) {
    return;
  }
  
  const mousePoint = { x: GameCanvas.mouseX, y: GameCanvas.mouseY };
  const clickedOnLastUpdate = this.clicked;
  const clickedOnThisUpdate = GameCanvas.clicked;
  const releasedClick = clickedOnLastUpdate && !clickedOnThisUpdate;
  const lastActiveButton = this.activeButton;
  const buttons = [...this.buttons.normalButton, ...this.buttons.frameButton];
  let currActiveButton = null;
  
  for (let ind in buttons) {
    let button = buttons[ind];
    const buttonRect = button.getRect(camera);
    const hoverButton = GUIUtil.pointInRectangle(mousePoint, buttonRect);
    if (hoverButton) {
      currActiveButton = button;
      break;
    }
  }
  
  // hover event
  if (lastActiveButton !== currActiveButton) {
    this.activeButton = currActiveButton;
    this.buttons.normalButton.forEach(button => button.setStance(STANCE.NORMAL));
    for (let ind in buttons) {
      let button = buttons[ind];
      if (this.activeButton === button) {
        if (button.hoverAudio) {
          UICommon.playMouseHoverAudio();
        }
        button.setStance(STANCE.MOUSE_OVER);
        break;
      }
    }
  }
  
  // click event
  for (let ind in buttons) {
    let button = buttons[ind];
    if (this.activeButton === button) {
      const originallyClickedButton = GUIUtil.pointInRectangle(
        this.lastClickedPosition,
        button.getRect(camera)
      );
      if (clickedOnThisUpdate) {
        switch (button.constructor) {
          case MapleButton: {
            const s = !originallyClickedButton ? STANCE.MOUSE_OVER : STANCE.PRESSED;
            button.setStance(s);
            break;
          }
          case MapleFrameButton: {
            break;
          }
        }
      } else {
        switch (button.constructor) {
          case MapleButton: {
            button.setStance(STANCE.MOUSE_OVER);
            const trigger = releasedClick && originallyClickedButton;
            if (trigger) {
              if (button.clickAudio) {
                UICommon.playMouseClickAudio();
              }
              button.onClick();
            }
            break;
          }
          case MapleFrameButton: {
            if (releasedClick && originallyClickedButton && button.canClick) {
              button.setCanClick(false);
              button.setCanUpdate(true);
              if (button.clickAudio) {
                UICommon.playMouseClickAudio();
              }
            }
            break;
          }
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
      
      break;
    }
  }
};

ClickManager.addButton = function(button) {
  switch (button.constructor) {
    case MapleButton: {
      this.buttons.normalButton.push(button);
      break;
    }
    case MapleFrameButton: {
      this.buttons.frameButton.push(button);
      break;
    }
    default: {
      throw new Error("Only button is accepted!!");
    }
  }
  MapleMap.objects.push(button);
};

ClickManager.clearButton = function() {
  this.buttons.normalButton = [];
  this.buttons.frameButton = [];
};

export default ClickManager;
