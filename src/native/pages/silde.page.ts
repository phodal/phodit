import * as path from "path";
import {ipcMain} from "electron";

export function createSlidePage(BrowserWindow: any, content: any) {
  let slideWindow: any = null;

  function createSlidePage() {
    if (slideWindow) {
      slideWindow.focus();
      return;
    }

    slideWindow = new BrowserWindow({
      height: 1440,
      width: 960,
      title: "帮助",
      fullscreen: true,
    });

    slideWindow.on("closed", function() {
      slideWindow = null;
    });

    slideWindow.loadFile(path.join(__dirname, "../../../views/slides.html"));

    slideWindow.once("ready-to-show", () => slideWindow.show());


    slideWindow.webContents.on("did-finish-load", function() {

    });

    slideWindow.openDevTools();

    ipcMain.on("phodit.slide.ready", (event: any, arg: any) => {
      console.log('phodit.slide.ready');
      if (slideWindow.webContents) {
        slideWindow.webContents.send("phodit.slide.send.content", content);
      }
      event.sender.send('phodit.slide.send.content', 'content')
    });


    if (!slideWindow.webContents) {
      createSlidePage();
    }
  }

  createSlidePage();
}
