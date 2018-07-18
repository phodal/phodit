const {remote} = require('electron');
const {Menu, MenuItem} = remote;

const menu = new Menu();
menu.append(new MenuItem({
  label: 'Wechat', click() {
    console.log('item 1 clicked')
  }
}));
// menu.append(new MenuItem({type: 'separator'}));
// menu.append(new MenuItem({label: 'MenuItem2', type: 'checkbox', checked: true}));

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  menu.popup({window: remote.getCurrentWindow()})
}, false);
