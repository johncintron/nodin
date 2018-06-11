import { MapleStanceButton, BUTTON_STANCE } from './maplestancebutton';
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
    stanceButton: [],
    frameButton: [],
  }
};

ClickManager.doUpdate = function(msPerTick, camera) {
  const mousePoint = { x: GameCanvas.mouseX, y: GameCanvas.mouseY };
  const clickedOnLastUpdate = this.clicked;
  const clickedOnThisUpdate = GameCanvas.clicked;
  const releasedClick = clickedOnLastUpdate && !clickedOnThisUpdate;
  const lastActiveButton = this.activeButton;
  const buttons = [...this.buttons.stanceButton, ...this.buttons.frameButton];
  let currActiveButton = null;
  
  if (buttons.length === 0) {
    return;
  }
  
  for (const button of buttons) {
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
    this.buttons.stanceButton.forEach(button => button.stance = BUTTON_STANCE.NORMAL);
    for (const button of this.buttons.stanceButton) {
      if (this.activeButton === button) {
        if (button.hoverAudio) {
          UICommon.playMouseHoverAudio();
        }
        button.stance = BUTTON_STANCE.MOUSE_OVER;
        break;
      }
    }
  }
  
  // click event
  for (const button of buttons) {
    if (this.activeButton === button) {
      const originallyClickedButton = GUIUtil.pointInRectangle(
        this.lastClickedPosition,
        button.getRect(camera)
      );
      if (clickedOnThisUpdate) {
        switch (button.constructor) {
          case MapleStanceButton: {
            button.stance = !originallyClickedButton ? BUTTON_STANCE.MOUSE_OVER : BUTTON_STANCE.PRESSED;
            break;
          }
          case MapleFrameButton: {
            break;
          }
        }
      } else {
        switch (button.constructor) {
          case MapleStanceButton: {
            button.stance = BUTTON_STANCE.MOUSE_OVER;
            const trigger = releasedClick && originallyClickedButton;
            if (trigger) {
              if (button.clickAudio) {
                UICommon.playMouseClickAudio();
              }
              button.trigger();
            }
            break;
          }
          case MapleFrameButton: {
            const trigger = releasedClick && originallyClickedButton && button.canClick;
            if (trigger) {
              button.canClick = false;
              button.canUpdate = true;
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
    case MapleStanceButton: {
      this.buttons.stanceButton.push(button);
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
  this.buttons.stanceButton = [];
  this.buttons.frameButton = [];
};

export default ClickManager;
