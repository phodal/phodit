import {EventConstants} from "../common/constants/event.constants";
import * as fs from "fs";
import {IFileOpen} from "../common/interface/IFileOpen";

const {remote, ipcRenderer} = require("electron");

const {Menu: MenuRight, MenuItem} = remote;
let menu = new MenuRight();
let node: any = null;

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
    label: "Phodal.com", click() {
      let text = (globalStore.eventTarget as any).innerText;
      require('electron').shell.openExternal(`http://www.phodal.com/search/?q=${text}`);
    },
  }));
}

function createFileMenu() {
  menu.append(new MenuItem({
    label: "Rename", click() {
      console.log("Rename", node.filename);
      const bar = document.querySelector('interact-bar');

      bar.setAttribute('style', "display: block;");
      bar.addEventListener('action', (event:any) => {
        bar.setAttribute('style', "display: none;");
      });

      node = null;
    },
  }));

  if (node.hasOwnProperty('collapsed')) {
    return;
  }

  menu.append(new MenuItem({
    label: "Delete", click() {
      console.log("Delete", node.filename);
      fs.unlink(node.filename,function(err: any){
        if(err) return console.log(err);
        ipcRenderer.send(EventConstants.PHODIT.RELOAD_PATH);

        node = null;
      });
    },
  }));
}

// FileMenu Click
window.document.addEventListener(EventConstants.CLIENT.FILE_MENU_CLICK, (data: any) => {
  let nodeInfo = JSON.parse(data.detail);
  node = nodeInfo;
});

window.addEventListener("contextmenu", (event: any) => {
  event.preventDefault();
  globalStore.eventTarget = event.target;
  if (event.target.className === "node" || event.target.className === "node is-active") {
    menu = new MenuRight();
    createFileMenu();
  } else {
    menu = new MenuRight();
    createEditorMenu();
  }
  menu.popup({window: remote.getCurrentWindow()});
}, false);
