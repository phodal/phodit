import {app, BrowserWindow, dialog, ipcMain, Menu, shell} from "electron";
import * as fs from "fs";
import * as path from "path";

import {IFileSave} from "../common/interface/IFileSave";
import {git} from "./features/git";
import {buildMenu} from "./i18n/menu/menu";
import {createHelpPage} from "./pages/help.page";
import {createSlidePage} from "./pages/silde.page";
import {openHtmlPage} from "./pages/html.page";
import {EventConstants} from "../common/constants/event.constants";
import {pandoc} from "./features/pandoc";
import {dockMenu} from "./i18n/menu/menu.dock";

const tmp = require("tmp");
const chokidar = require('chokidar');

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
    info.collapsed = true;
    info.children = fs.readdirSync(filename).filter((child: string) => {
      return child !== ".git" && child !== ".DS_Store" && child !== ".idea";
    }).map(function(child) {
      return dirTree(filename + "/" + child);
    });
  } else {
    info.leaf = true;
  }

  return info;
}

function openFile(willLoadFile: string, isTempFile: boolean = false) {
  if (/\.(jpe?g|png|gif|bmp|ico)$/i.test(willLoadFile)) {
    return mainWindow.previewFile(willLoadFile);
  }

  if (/\.(html)$/i.test(willLoadFile)) {
    return openHtmlPage(BrowserWindow, willLoadFile);
  }

  if (/\.(doc?x)$/i.test(willLoadFile)) {
    return shell.openItem(willLoadFile);
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

function openPath(pathName: any, isWatch = false) {
  checkWindow();

  storage.set("storage.last.path", {file: pathName});
  storage.remove("storage.last.file");

  let dirFiles: any[] = [];
  if (!isWatch) {
    chokidar
      .watch(pathName, {ignored: /(^|[\/\\])\../})
      .on('unlink', (event: any, path: any) => {
        reloadPath(true);
      })
      .on('add', (event: any, path: any) => {
        reloadPath(true);
      });
  }

  fs.readdir(pathName, (err, files) => {
    dirFiles = dirTree(pathName);

    // mainWindow.webContents.send(EventConstants.PHODIT.GIT_STATUS, git.status(pathName));
    mainWindow.webContents.send(EventConstants.PHODIT.OPEN_PATH, {
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
    // console.log(fileNames);
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
    mainWindow.webContents.send(EventConstants.CLIENT.SAVE_FILE);
  } else {
    dialog.showErrorBox("error", "not open file");
  }
}

function saveFile(data: any, isTempFile: boolean) {
  if (!currentFile) {
    return;
  }
  // console.log(currentFile);
  if (!isTempFile && !currentFile.endsWith(".tmp")) {
    fs.writeFileSync(currentFile, data);
  } else {
    dialog.showSaveDialog(mainWindow, {}, (filename) => {
      isTempFile = false;

      mainWindow.webContents.send(EventConstants.TEMP_FILE_STATUS, {
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
  createHelpPage(BrowserWindow);
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
        // console.log(data);
        openFile(data.file);
      }
    });
    storage.get("storage.last.path", function(error: any, data: any) {
      if (error) {
        throw error;
      }

      if (data && data.file) {
        // console.log(data);
        openPath(data.file);
      }
    });

    mainWindow.webContents.send("phodit.lifecycle.load");
  });
  //
  // mainWindow.webContents.on('new-window', function(e, url) {
  //   e.preventDefault();
  //   require('electron').shell.openExternal(url);
  // });

  mainWindow.webContents.on("will-navigate", function(event: any, url) {
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

app.dock.setMenu(Menu.buildFromTemplate(dockMenu));

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

// TODO: add protocol support
app.setAsDefaultProtocolClient("md");

ipcMain.on(EventConstants.PHODIT.OPEN_FILE, (event: any, arg: any) => {
  openFile(arg);
});

ipcMain.on(EventConstants.PHODIT.SAVE_FILE, (event: any, arg: IFileSave) => {
  saveFile(arg.data, arg.isTempFile);
});

ipcMain.on(EventConstants.PHODIT.OPEN_GUIDE, (event: any, arg: any) => {
  openAboutPage();
});

ipcMain.on("phodit.show.echoesworks", (event: any, arg: any) => {
  createSlidePage(BrowserWindow, arg);
});

ipcMain.on(EventConstants.PHODIT.FULL_SCREEN, (event: any, arg: any) => {
  mainWindow.setFullScreen(true);
  mainWindow.maximize();
});

ipcMain.on(EventConstants.PHODIT.UN_FULL_SCREEN, (event: any, arg: any) => {
  mainWindow.setFullScreen(false);
  mainWindow.unmaximize();
});

function reloadPath(isWatch = false) {
  storage.get("storage.last.path", function (error: any, data: any) {
    if (error) {
      throw error;
    }

    if (data && data.file) {
      openPath(data.file, isWatch);
    }
  });
}

ipcMain.on(EventConstants.PHODIT.RELOAD_PATH, (event: any, arg: any) => {
  reloadPath();
});

ipcMain.on(EventConstants.PHODIT.SHOW_WORD, (event: any, arg: any) => {
  pandoc.word(arg);
});

ipcMain.on("phodit.system.open.path", (event: any, arg: any) => {
  console.log(arg);
  require('electron').shell.showItemInFolder(arg);
});

ipcMain.on(EventConstants.PHODIT.GET_SUGGEST, (event: any, arg: any) => {
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

  mainWindow.webContents.send(EventConstants.PHODIT.SUGGEST_SEND, response);
});
