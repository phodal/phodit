import {BrowserWindow} from "electron";
import * as path from "path";

export function buildAboutPage() {
  let newWindow: any = null;

  function openAboutWindow() {
    if (newWindow) {
      newWindow.focus();
      return;
    }

    newWindow = new BrowserWindow({
      height: 800,
      width: 600,
      title: "帮助"
    });

    console.log(__dirname);
    console.log(path.join(__dirname, "../../views/about.html"));
    newWindow.loadURL(path.join(__dirname, "../../views/about.html"));

    newWindow.webContents.on('did-finish-load', ()=>{
      newWindow.show();
      newWindow.focus();
    });

    newWindow.on('closed', function () {
      newWindow = null;
    });

    newWindow.webContents.openDevTools();
  }

  openAboutWindow();
}
