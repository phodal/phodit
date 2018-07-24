import spawnPandoc from "../native/features/pandoc/spawn-pandoc";

const {remote, clipboard} = require("electron");
const {Menu: MenuRight, MenuItem} = remote;

const menu = new MenuRight();
menu.append(new MenuItem({
  label: "Wechat", click() {
    clipboard.writeText("Example String", "selection");
  },
}));

menu.append(new MenuItem({
  label: "html", click() {

  },
}));
// menu.append(new MenuItem({type: 'separator'}));
// menu.append(new MenuItem({label: 'MenuItem2', type: 'checkbox', checked: true}));

window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  menu.popup({window: remote.getCurrentWindow()});
}, false);
