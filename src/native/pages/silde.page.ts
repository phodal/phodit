import * as path from "path";
import {pandoc} from "../features/pandoc";
import * as fs from "fs";
import {ipcMain} from "electron";

export function createSlidePage(BrowserWindow: any, arg: any) {
  let slideWindow: any = null;

  function createSlidePage(data: any) {
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

    slideWindow.on("closed", function () {
      slideWindow = null;
    });


    slideWindow.loadFile(path.join(__dirname, "../../../views/slide.html"));

    slideWindow.once("ready-to-show", () => slideWindow.show());
    slideWindow.webContents.on("did-finish-load", function () {

    });

    slideWindow.openDevTools();

    if (!slideWindow.webContents) {
      createSlidePage(data);
    }

    ipcMain.on("phodit.slide.ready", (event: any, arg: any) => {
      if (slideWindow.webContents) {
        slideWindow.webContents.send("phodit.slide.send.content", data);
      }
    });
  }

  pandoc.slide(arg.file).then((filePath: any) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.log("An error ocurred reading the file :" + err.message);
        return;
      }

      createSlidePage(data);
    })
  });
}
