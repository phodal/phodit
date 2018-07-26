const {remote} = require("electron");
const {Menu: MenuRight, MenuItem} = remote;
let menu = new MenuRight();

const globalStore = {
  eventTarget: {}
};

function createEditorMenu() {
  menu.append(new MenuItem({
    label: "Google", click() {
      let text = (globalStore.eventTarget as any).innerText;
      require('electron').shell.openExternal(`https://www.google.com/search?q=${text}`);
    },
  }));

  menu.append(new MenuItem({
    label: "Baidu", click() {
      let text = (globalStore.eventTarget as any).innerText;
      require('electron').shell.openExternal(`https://www.baidu.com/s?wd=${text}`);
    },
  }));

  menu.append(new MenuItem({
    label: "GitHub", click() {
      let text = (globalStore.eventTarget as any).innerText;
      require('electron').shell.openExternal(`https://github.com/search?q=${text}&ref=opensearch`);
    },
  }));

  menu.append(new MenuItem({
    label: "Wiki", click() {
      let text = (globalStore.eventTarget as any).innerText;
      require('electron').shell.openExternal(`https://zh.wikipedia.org/wiki/Special:Search?search=${text}`);
    },
  }));

  menu.append(new MenuItem({
    label: "Clipboard", click() {

    },
  }));
}

function createFileMenu() {
  menu.append(new MenuItem({
    label: "Rename", click() {
      console.log("Rename");
    },
  }));

  menu.append(new MenuItem({
    label: "Delete", click() {
      console.log("Delete");
    },
  }));
}

window.addEventListener("contextmenu", (event: any) => {
  event.preventDefault();
  globalStore.eventTarget = event.target;
  if (event.target.className === "node") {
    menu = new MenuRight();
    createFileMenu();
  } else {
    menu = new MenuRight();
    createEditorMenu();
  }
  menu.popup({window: remote.getCurrentWindow()});
}, false);
