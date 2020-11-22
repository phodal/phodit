const {app, BrowserWindow, TouchBar} = require('electron');
const {TouchBarLabel, TouchBarButton, TouchBarSpacer} = TouchBar;

const theme = new TouchBarButton({
  label: '🎰 Theme',
  backgroundColor: '#7851A9',
  click: () => {

  }
});

export const touchBar = new TouchBar({
  items: [
    theme,
    new TouchBarSpacer({size: 'large'}),
  ]
});
