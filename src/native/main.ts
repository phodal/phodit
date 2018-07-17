import { app, BrowserWindow, dialog, globalShortcut, Menu } from "electron";
import * as path from "path";
import * as fs from "fs";
import { buildMenu } from "./i18n/menu/menu";

let mainWindow: Electron.BrowserWindow;
let dir;

app.on('ready', () => {
  globalShortcut.register('CommandOrControl+O', () => {
    dir = dialog.showOpenDialog(mainWindow, {
      filters: [
        {name: 'Markdown ', extensions: ['markdown', 'md', 'txt']},
        {name: 'All Files', extensions: ['*']}
      ],
      properties: ['openFile', 'openDirectory', 'multiSelections']
    }, (fileNames: any) => {
      console.log("--------------------");
      console.log(fileNames);

      if (!fileNames) {
        return;
      }

      fs.readFile(fileNames[0], 'utf-8', (err, data) => {
        if (err) {
          alert("An error ocurred reading the file :" + err.message);
          return;
        }

        mainWindow.webContents.send('phodit.open.one-file', data);
      });
    });
  })
});

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

  const menu = Menu.buildFromTemplate(buildMenu(app));
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
