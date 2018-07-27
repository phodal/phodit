import {app, BrowserWindow, dialog, ipcMain, Menu, shell} from "electron";
import * as fs from "fs";
import * as path from "path";

import {IFileSave} from "../common/interface/IFileSave";
import {git} from "./features/git";
import {buildMenu} from "./i18n/menu/menu";
import {buildAboutPage} from "./pages/about.page";
import {createSlidePage} from "./pages/silde.page";

const tmp = require("tmp");

const windowStateKeeper = require("electron-window-state");
const storage = require("electron-json-storage");
const defaultDataPath = storage.getDefaultDataPath();
const blogpostData = require("../../assets/data/output.json");

const lunr = require("lunr");
const dataWithIndex: any[] = [];
let lunrIdx: any;
let currentFile: string;

console.log(`storage path: ${defaultDataPath}`);

let mainWindow: Electron.BrowserWindow;
let dir;

function dirTree(filename: string) {
  const stats = fs.lstatSync(filename);
  const info: any = {
    filename,
    module: path.basename(filename),
  };

  if (stats.isDirectory()) {
    // info.type = "folder";
    info.collapsed = true;
    info.children = fs.readdirSync(filename).filter((child: string) => {
      return child !== ".git" && child !== ".DS_Store";
    }).map(function(child) {
      return dirTree(filename + "/" + child);
    });
  } else {
    info.leaf = true;
    // info.type = "file";
  }

  return info;
}

function openFile(willLoadFile: string, isTempFile: boolean = false) {
  if (/\.(jpe?g|png|gif|bmp|ico)$/i.test(willLoadFile)) {
    shell.openExternal(willLoadFile);
    dialog.showErrorBox("Error", "not support format");
    return;
  }

  if (mainWindow && !isTempFile) {
    const fileName = path.basename(willLoadFile);
    mainWindow.setTitle(fileName);
    mainWindow.setRepresentedFilename(willLoadFile);
  } else {
    checkWindow();
    storage.remove("storage.last.path");
    mainWindow.setTitle("Untitled");
  }

  storage.set("storage.last.file", {file: willLoadFile});
  currentFile = willLoadFile;
  fs.readFile(willLoadFile, "utf-8", (err, data) => {
    if (err) {
      console.log("An error ocurred reading the file :" + err.message);
      return;
    }

    app.addRecentDocument(willLoadFile);

    mainWindow.webContents.send("phodit.open.one-file", {
      data,
      isTempFile,
      file: willLoadFile,
    });
  });
}

function openPath(pathName: any) {
  checkWindow();

  storage.set("storage.last.path", {file: pathName});
  storage.remove("storage.last.file");

  let dirFiles: any[] = [];
  fs.readdir(pathName, (err, files) => {
    dirFiles = dirTree(pathName);

    mainWindow.webContents.send("phodit.git.status", git.status(pathName));
    mainWindow.webContents.send("phodit.open.path", {
      path: pathName,
      tree: dirFiles
    });
  });
}

function open() {
  dir = dialog.showOpenDialog(mainWindow, {
    filters: [
      {name: "Markdown ", extensions: ["markdown", "md", "txt"]},
      {name: "All Files", extensions: ["*"]},
    ],
    properties: ["openFile", "openDirectory", "multiSelections"],
  }, (fileNames: any) => {
    console.log(fileNames);
    if (!fileNames) {
      return;
    }

    if (fileNames.length === 1 && fs.lstatSync(fileNames[0]).isFile()) {
      openFile(fileNames[0]);
    }

    if (fileNames.length === 1 && fs.lstatSync(fileNames[0]).isDirectory()) {
      openPath(fileNames[0]);
    }
  });
}

function checkWindow() {
  if (!mainWindow) {
    return createWindow();
  }
  if (mainWindow && !mainWindow.webContents) {
    return createWindow();
  }
}

function saveFileSignal() {
  if (mainWindow.webContents) {
    mainWindow.webContents.send("client.save.file");
  } else {
    dialog.showErrorBox("error", "not open file");
  }
}

function saveFile(data: any, isTempFile: boolean) {
  console.log(currentFile);
  if (!isTempFile && !currentFile.endsWith(".tmp")) {
    fs.writeFileSync(currentFile, data);
  } else {
    dialog.showSaveDialog(mainWindow, {}, (filename) => {
      isTempFile = false;

      mainWindow.webContents.send("phodit.temp.file.status", {
        isTempFile: false,
      });
      currentFile = filename;
      mainWindow.setTitle(filename);
      fs.writeFileSync(filename, data);
    });
  }
}

function newFile() {
  tmp.file(function _tempFileCreated(err: any, path: any, fd: any, cleanupCallback: any) {
    if (err) { throw err; }

    checkWindow();

    storage.set("storage.last.file", {file: path});
    openFile(path, true);
  });
}

function debug() {
  mainWindow.webContents.openDevTools();
}

function reload() {
  mainWindow.webContents.reload();
}

function openAboutPage() {
  buildAboutPage(BrowserWindow);
}

function createWindow() {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800,
  });

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    // frame: false,
    icon: path.join(__dirname,'../../assets/imgs/icons/mac/icon.icns'),
    backgroundColor: "#fff",
    webPreferences: {
      nodeIntegrationInWorker: true,
    },
  });
  console.log(path.join(__dirname,'../../assets/imgs/icons/mac/icon.icns'));

  mainWindowState.manage(mainWindow);

  mainWindow.loadFile(path.join(__dirname, "../../views/index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.setDocumentEdited(true);
  mainWindow.webContents.on("did-finish-load", function() {
    storage.get("storage.last.file", function(error: any, data: any) {
      if (error) {
        throw error;
      }

      if (data && data.file) {
        console.log(data);
        openFile(data.file);
      }
    });
    storage.get("storage.last.path", function(error: any, data: any) {
      if (error) {
        throw error;
      }

      if (data && data.file) {
        console.log(data);
        openPath(data.file);
      }
    });
  });
  //
  // mainWindow.webContents.on('new-window', function(e, url) {
  //   e.preventDefault();
  //   require('electron').shell.openExternal(url);
  // });

  mainWindow.webContents.on("will-navigate", function(event: any, url) {
    console.log("will-navigate");
    if (url != mainWindow.webContents.getURL()) {
      event.preventDefault();
      const win = new BrowserWindow({show: false});
      win.loadURL(url);
      win.show();
      event.newGuest = win;
    }
  });

  const menu = Menu.buildFromTemplate(buildMenu(app, {
    open,
    saveFileSignal,
    debug,
    reload,
    openAboutPage,
    newFile,
  }));
  Menu.setApplicationMenu(menu);

  // if (!cluster.isMaster) {
  lunrIdx = lunr(function() {
    this.field("title", {boost: 10});
    // this.field('content');

    for (const item of blogpostData) {
      this.add(item);
      dataWithIndex[item.id] = item;
    }
  });
  // }
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

ipcMain.on("phodit.open.file", (event: any, arg: any) => {
  openFile(arg);
});

ipcMain.on("phodit.save.file", (event: any, arg: IFileSave) => {
  saveFile(arg.data, arg.isTempFile);
});

ipcMain.on("phodit.open.guide", (event: any, arg: any) => {
  openAboutPage();
});

ipcMain.on("phodit.show.slides", (event: any, arg: any) => {
  createSlidePage(BrowserWindow, arg);
});

ipcMain.on("phodit.fullscreen", (event: any, arg: any) => {
  mainWindow.setFullScreen(true);
  mainWindow.maximize();
});

ipcMain.on("phodit.unfullscreen", (event: any, arg: any) => {
  mainWindow.setFullScreen(false);
  mainWindow.unmaximize();
});

ipcMain.on("phodit.suggest.get", (event: any, arg: any) => {
  if (arg.length < 2) {
    mainWindow.webContents.send("phodit.suggest.send", []);
  }

  const searchResults = lunrIdx.search(arg);
  const response = [];

  for (const result of searchResults) {
    const blogpost = dataWithIndex[result.ref];
    response.push({
      text: `[${blogpost.title}](https://www.phodal.com/blog/${blogpost.slug})》`,
      displayText: blogpost.title,
    });
  }

  mainWindow.webContents.send("phodit.suggest.send", response);
});
