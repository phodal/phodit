import {app, BrowserWindow, dialog, ipcMain, Menu, nativeImage, OpenDialogReturnValue, shell, Tray} from "electron";
import * as fs from "fs";
import * as path from "path";
import {touchBar} from "../app/touch-bar";

import {EventConstants} from "../common/constants/event.constants";
import {IFileSave} from "../common/interface/IFileSave";
import {pandoc} from "./features/pandoc";
import {buildMenu} from "./i18n/menu/menu";
import {dockMenu} from "./i18n/menu/menu.dock";
import {createHelpPage} from "./pages/help.page";
import {openHtmlPage} from "./pages/html.page";
import {createSlidePage} from "./pages/silde.page";

const tmp = require("tmp");
const chokidar = require("chokidar");

const windowStateKeeper = require("electron-window-state");
const storage = require("electron-json-storage");
const defaultDataPath = storage.getDefaultDataPath();

let currentFile: string;

let mainWindow: Electron.BrowserWindow;
let dir;
let tray = null;

function dirTree(filename: string) {
  let stats;
  try {
    stats = fs.lstatSync(filename);
  } catch (e) {
    storage.remove("storage.last.path");
    return;
  }
  const info: any = {
    filename,
    module: path.basename(filename),
  };

  if (stats.isDirectory()) {
    info.collapsed = true;
    info.children = fs.readdirSync(filename).filter((child: string) => {
      return child !== ".git" && child !== ".DS_Store" && child !== ".idea";
    }).map((child) => dirTree(filename + "/" + child));
  } else {
    info.leaf = true;
  }

  return info;
}

function openFile(willLoadFile: string, isTempFile: boolean = false) {
  const imageRegex = /\.(jpe?g|png|gif|bmp|ico)$/i;
  const htmlRegex = /\.(html)$/i;
  const wordRegex = /\.(doc?x)$/i;

  if (imageRegex.test(willLoadFile)) {
    return mainWindow.previewFile(willLoadFile);
  } else if (htmlRegex.test(willLoadFile)) {
    return openHtmlPage(BrowserWindow, willLoadFile);
  } else if (wordRegex.test(willLoadFile)) {
    return shell.openPath(willLoadFile).then(() => {
    });
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
      .on("unlink", () => {
        reloadPath(true);
      })
      .on("add", () => {
        reloadPath(true);
      });
  }

  fs.readdir(pathName, (err, files) => {
    try {
      dirFiles = dirTree(pathName);
    } catch (e) {
      storage.remove("storage.last.path");
      console.log(e);
    }

    // mainWindow.webContents.send(EventConstants.PHODIT.GIT_STATUS, git.status(pathName));
    mainWindow.webContents.send(EventConstants.PHODIT.OPEN_PATH, {
      path: pathName,
      tree: dirFiles,
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
  }).then((dialogValue: OpenDialogReturnValue) => {
    const fileNames = dialogValue.filePaths;
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
    return onAppReady();
  }
  if (mainWindow && !mainWindow.webContents) {
    return onAppReady();
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
    dialog.showSaveDialog(mainWindow, {}).then((filename: any) => {
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
  tmp.file(function _tempFileCreated(err: any, lastPath: any, fd: any, cleanupCallback: any) {
    if (err) {
      throw err;
    }

    checkWindow();

    storage.set("storage.last.file", {file: lastPath});
    openFile(lastPath, true);
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

function onAppReady() {
  const mainWindowState = windowStateKeeper({
    defaultHeight: 800,
    defaultWidth: 1000,
  });

  const image = nativeImage.createFromPath(__dirname + '../../assets/imgs/icons/mac/icon.icns');
  image.setTemplateImage(true);

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    icon: image,
    show: false,
    backgroundColor: "#fff",
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      // offscreen: true
    },
  });

  const iconPath = path.join(__dirname, '../../assets/imgs/icons/png/16x16.png');
  tray = new Tray(nativeImage.createFromPath(iconPath));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
  ])
  tray.setToolTip('Phodit')
  tray.setContextMenu(contextMenu)

  mainWindowState.manage(mainWindow);

  mainWindow.loadFile(path.join(__dirname, "../../views/index.html"));
  mainWindow.setTouchBar(touchBar);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.setDocumentEdited(true);
  mainWindow.webContents.on("did-finish-load", () => {
    storage.get("storage.last.file", (error: any, data: any) => {
      if (error) {
        throw error;
      }

      if (data && data.file) {
        openFile(data.file);
      }
    });
    storage.get("storage.last.path", (error: any, data: any) => {
      if (error) {
        throw error;
      }

      if (data && data.file) {
        openPath(data.file);
      }
    });

    mainWindow.webContents.setFrameRate(30)
    mainWindow.webContents.send("phodit.lifecycle.load");

    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.webContents.on("will-navigate", (event: any, url) => {
    if (url !== mainWindow.webContents.getURL()) {
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
}

function reloadPath(isWatch = false) {
  storage.get("storage.last.path", (error: any, data: any) => {
    if (error) {
      throw error;
    }

    if (data && data.file) {
      openPath(data.file, isWatch);
    }
  });
}

ipcMain.on(EventConstants.PHODIT.OPEN_FILE, (event: any, arg: any) => {
  openFile(arg);
});

ipcMain.on(EventConstants.PHODIT.SAVE_FILE, (event: any, arg: IFileSave) => {
  saveFile(arg.data, arg.isTempFile);
});

ipcMain.on(EventConstants.PHODIT.OPEN_GUIDE, (event: any, arg: any) => {
  openAboutPage();
});

ipcMain.on(EventConstants.PHODIT.SHOW_SLIDES, (event: any, arg: any) => {
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

ipcMain.on(EventConstants.PHODIT.RELOAD_PATH, (event: any, arg: any) => {
  reloadPath();
});

ipcMain.on(EventConstants.PHODIT.SHOW_WORD, (event: any, arg: any) => {
  pandoc.word(arg);
});

ipcMain.on(EventConstants.PHODIT.SHOW_PDF, (event: any, arg: any) => {
  pandoc.pdf(arg);
});

ipcMain.on(EventConstants.PHODIT.OPEN_SYSTEM_PATH, (event: any, arg: any) => {
  require("electron").shell.showItemInFolder(arg);
});

function initMain() {
  console.log(`storage path: ${defaultDataPath}`);
  app.dock.setMenu(Menu.buildFromTemplate(dockMenu));
  app.allowRendererProcessReuse = false;

  app.on("ready", onAppReady);

  app.on("window-all-closed", () => {
    const isMacOS = process.platform === "darwin";
    if (!isMacOS) {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (mainWindow === null) {
      onAppReady();
    }
  });

  app.on("open-file", (event, arg) => {
    openFile(arg);
  });

  // TODO: add protocol support
  app.setAsDefaultProtocolClient("md");
  app.setAsDefaultProtocolClient("markdown");
}

initMain();
