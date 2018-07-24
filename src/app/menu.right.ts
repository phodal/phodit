const {remote, clipboard} = require("electron");
const {Menu: MenuRight, MenuItem} = remote;
const menu = new MenuRight();

const globalStore = {
  eventTarget: ''
};

menu.append(new MenuItem({
  label: "Wechat", click() {
    clipboard.writeText("Example String", "selection");
  },
}));

menu.append(new MenuItem({
  label: "html", click() {

  },
}));

menu.append(new MenuItem({
  label: "Google It", click() {
    let text = (globalStore.eventTarget as any).innerText;
    require('electron').shell.openExternal(`https://www.google.com/search?q=${text}`);
  },
}));

menu.append(new MenuItem({
  label: "Wiki", click() {
    let text = (globalStore.eventTarget as any).innerText;
    require('electron').shell.openExternal(`https://zh.wikipedia.org/wiki/Special:Search?search=${text}`);
  },
}));

window.addEventListener("contextmenu", (event: any) => {
  event.preventDefault();
  console.log(event);
  globalStore.eventTarget = event.target;
  menu.popup({window: remote.getCurrentWindow()});
}, false);
