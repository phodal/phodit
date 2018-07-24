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
    console.log(text);
    require('electron').shell.openExternal(`https://www.google.com/search?q=${text}`);
  },
}));

window.addEventListener("contextmenu", (event: any) => {
  event.preventDefault();
  console.log(event);
  globalStore.eventTarget = event.target;
  menu.popup({window: remote.getCurrentWindow()});
}, false);
