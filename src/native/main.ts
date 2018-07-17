import { app, BrowserWindow, dialog, globalShortcut, Menu, MenuItem } from "electron";
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

function createWindow () {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
  });

  mainWindow.loadFile(path.join(__dirname, "../../index.html"));

  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  const menu = Menu.buildFromTemplate(buildMenu(app, {
    open: open,
    saveFile: saveFile
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
