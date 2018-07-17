import { app, BrowserWindow, dialog, globalShortcut, Menu, MenuItem } from "electron";
const windowStateKeeper = require('electron-window-state');

import * as path from "path";
import * as fs from "fs";

import { buildMenu } from "./i18n/menu/menu";

let mainWindow: Electron.BrowserWindow;
let dir;


function open() {
  dir = dialog.showOpenDialog(mainWindow, {
    filters: [
      {name: 'Markdown ', extensions: ['markdown', 'md', 'txt']},
      {name: 'All Files', extensions: ['*']}
    ],
    properties: ['openFile', 'openDirectory', 'multiSelections']
  }, (fileNames: any) => {
    console.log(fileNames);
    if (!fileNames) {
      return;
    }

    if (fileNames.length === 1 && fs.lstatSync(fileNames[0]).isFile()) {
      fs.readFile(fileNames[0], 'utf-8', (err, data) => {
        if (err) {
          console.log("An error ocurred reading the file :" + err.message);
          return;
        }

        app.addRecentDocument(fileNames[0]);

        mainWindow.webContents.send('phodit.open.one-file', data);
      });
    }

    if (fileNames.length === 1 && fs.lstatSync(fileNames[0]).isDirectory()) {
      const dirFiles: any[] = [];
      fs.readdir(fileNames[0], (err, files) => {
        for (const file of files) {
          dirFiles.push(file);
        }

        mainWindow.webContents.send('phodit.open.path', dirFiles);
      });
    }
  });
}

function saveFile() {
  console.log(saveFile);
}

function debug() {
  mainWindow.webContents.openDevTools();
}

function createWindow () {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  });

  mainWindow = new BrowserWindow({
    'x': mainWindowState.x,
    'y': mainWindowState.y,
    'width': mainWindowState.width,
    'height': mainWindowState.height
  });

  mainWindowState.manage(mainWindow);

  mainWindow.loadFile(path.join(__dirname, "../../index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  const menu = Menu.buildFromTemplate(buildMenu(app, {
    open: open,
    saveFile: saveFile,
    debug: debug
  }));
  Menu.setApplicationMenu(menu);
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
