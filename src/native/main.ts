import {app, BrowserWindow, dialog, Menu, ipcMain} from "electron";
import * as path from "path";
import * as fs from "fs";

import {buildMenu} from "./i18n/menu/menu";
import {git} from "./features/git";
import * as os from "os";

const windowStateKeeper = require('electron-window-state');
const storage = require('electron-json-storage');
const defaultDataPath = storage.getDefaultDataPath();

console.log(`storage path: ${defaultDataPath}`);


let mainWindow: Electron.BrowserWindow;
let dir;

function dirTree(filename: string) {
  let stats = fs.lstatSync(filename);
  let info: any = {
    filename: filename,
    module: path.basename(filename)
  };

  if (stats.isDirectory()) {
    // info.type = "folder";
    info.collapsed = true;
    info.children = fs.readdirSync(filename).filter((child: string) => {
      return child !== '.git' && child !== '.DS_Store';
    }).map(function (child) {
      return dirTree(filename + '/' + child);
    });
  } else {
    info.leaf = true;
    // info.type = "file";
  }

  return info;
}

function openFile(willLoadFile: string) {
  if (mainWindow) {
    let fileName = path.basename(willLoadFile);
    mainWindow.setTitle(fileName);
  }
  storage.set('storage.last.file', { file: willLoadFile }, function(error: any) {
    if (error) throw error;
  });
  fs.readFile(willLoadFile, 'utf-8', (err, data) => {
    if (err) {
      console.log("An error ocurred reading the file :" + err.message);
      return;
    }

    app.addRecentDocument(willLoadFile);

    mainWindow.webContents.send('phodit.open.one-file', data);
  });
}

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
      let willLoadFile = fileNames[0];
      openFile(willLoadFile);
    }

    if (fileNames.length === 1 && fs.lstatSync(fileNames[0]).isDirectory()) {
      let dirFiles: any[] = [];
      fs.readdir(fileNames[0], (err, files) => {
        dirFiles = dirTree(fileNames[0]);

        mainWindow.webContents.send('phodit.git.status', git.status(fileNames[0]));
        mainWindow.webContents.send('phodit.open.path', {
          module: 'react-ui-tree',
          children: [dirFiles]
        });
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

function reload() {
  mainWindow.webContents.reload();
}

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  });

  mainWindow = new BrowserWindow({
    'x': mainWindowState.x,
    'y': mainWindowState.y,
    'width': mainWindowState.width,
    'height': mainWindowState.height,
    // frame: false,
    backgroundColor: '#fff'
  });

  mainWindowState.manage(mainWindow);

  mainWindow.loadFile(path.join(__dirname, "../../index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', function() {
    storage.get('storage.last.file', function(error: any, data: any) {
      if (error) throw error;

      openFile(data.file);
    });

  })

  mainWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });

  mainWindow.webContents.on('will-navigate', function(e, url) {
    /* If url isn't the actual page */
    if(url != mainWindow.webContents.getURL()) {
      e.preventDefault();
      require('electron').shell.openExternal(url);
    }
  });

  const menu = Menu.buildFromTemplate(buildMenu(app, {
    open: open,
    saveFile: saveFile,
    debug: debug,
    reload: reload
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

app.on("open-file", (event, arg) => {
  openFile(arg);
});

ipcMain.on('phodit.open.file', (event: any, arg: any) => {
  openFile(arg);
});
