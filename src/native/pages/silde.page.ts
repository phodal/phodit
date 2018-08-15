import * as path from "path";
import {ipcMain} from "electron";
import {pandoc} from "../features/pandoc";

export function createSlidePage(BrowserWindow: any, arg: any) {
  let slideWindow: any = null;

  function createSlidePage(filePath: any) {
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

    slideWindow.loadFile(filePath);

    slideWindow.once("ready-to-show", () => slideWindow.show());


    slideWindow.webContents.on("did-finish-load", function() {

    });

    slideWindow.openDevTools();

    // ipcMain.on("phodit.slide.ready", (event: any, arg: any) => {
    //   console.log(arg);
    //   if (slideWindow && slideWindow.webContents) {
    //     slideWindow.webContents.send("phodit.slide.send.arg", arg);
    //   }
    //   event.sender.send('phodit.slide.send.arg', 'arg')
    // });


    if (!slideWindow.webContents) {
      createSlidePage(filePath);
    }
  }

  pandoc.slide(arg.file).then((filePath: any) => {
    createSlidePage(filePath);
  })
}
