import {BrowserWindow} from "electron";

const {TouchBar} = require('electron');

import {EventConstants} from '../../common/constants/event.constants';

const {TouchBarButton, TouchBarSpacer} = TouchBar;

export default function buildTouchBar(mainWindow: BrowserWindow) {
  let dark = false;
  const theme = new TouchBarButton({
    label: '🎰 Theme',
    backgroundColor: '#384452',
    click: () => {
      mainWindow.webContents.send(EventConstants.PHODIT.TOGGLE_THEME, {});
      dark = !dark;
      if(dark) {
        theme.backgroundColor = '#384452';
      } else {
        theme.backgroundColor = '#fff';
      }
    }
  });

  return new TouchBar({
    items: [
      theme,
      new TouchBarSpacer({size: 'large'}),
    ]
  });
}
