import {app, BrowserWindow, dialog, Menu, nativeImage, OpenDialogReturnValue, shell, Tray} from "electron";
import * as fs from "fs";
import * as path from "path";
import {EventConstants} from "../common/constants/event.constants";
import {createHelpPage} from "./pages/help.page";
import {openHtmlPage} from "./pages/html.page";
import PhoditIpc from "./phodit-ipc";
import {dirTree} from "./support/file-support";
import {buildMenu} from "./ui/menu";
import {dockMenu} from "./ui/menu.dock";
import buildTouchBar from "./ui/touch-bar";
import windowStateKeeper = require("electron-window-state");

const tmp = require("tmp");
const chokidar = require("chokidar");

const storage = require("electron-json-storage");

export default class Phodit {
  mainWindow: Electron.BrowserWindow;
  currentFile: string;
  tray: Tray = null;
  dir: any;
  private storage: any;

  constructor() {
    this.storage = storage;
  }

  init() {
    app.dock.setMenu(Menu.buildFromTemplate(dockMenu));
    app.allowRendererProcessReuse = false;

    app.on("ready", this.onAppReady.bind(this));

    app.on("window-all-closed", () => {
      const isMacOS = process.platform === "darwin";
      if (!isMacOS) {
        app.quit();
      }
    });

    app.on("activate", () => {
      if (this.mainWindow === null) {
        this.onAppReady();
      }
    });

    app.on("open-file", (event, arg) => {
      this.openFile(arg);
    });

    // TODO: add protocol support
    app.setAsDefaultProtocolClient("md");
    app.setAsDefaultProtocolClient("markdown");

    const phoditIpc = new PhoditIpc(this);
    phoditIpc.startListener();
  }

  onAppReady() {
    const that = this;

    const mainWindowState = windowStateKeeper({
      defaultHeight: 800,
      defaultWidth: 1000,
    });

    const image = nativeImage.createFromPath(__dirname + '../../assets/imgs/icons/mac/icon.icns');
    image.setTemplateImage(true);

    this.mainWindow = new BrowserWindow({
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
        enableRemoteModule: true,
        // offscreen: true
      },
    });

    this.setTray();

    mainWindowState.manage(this.mainWindow);
    this.mainWindow.loadFile(path.join(__dirname, "../../views/index.html"));
    this.mainWindow.setTouchBar(buildTouchBar(this.mainWindow));

    this.mainWindow.on("closed", () => {
      this.mainWindow = null;
    });

    this.mainWindow.setDocumentEdited(true);
    this.mainWindow.webContents.on("did-finish-load", () => {
      storage.get("storage.last.file", (error: any, data: any) => {
        if (error) throw error;
        if (data && data.file) {
          that.openFile(data.file);
        }
      });
      storage.get("storage.last.path", (error: any, data: any) => {
        if (error) throw error;
        if (data && data.file) {
          that.openPath(data.file);
        }
      });

      this.mainWindow.webContents.setFrameRate(30);
      this.mainWindow.webContents.send(EventConstants.PHODIT.LOADED);

      this.mainWindow.show();
      this.mainWindow.focus();
    });
    this.mainWindow.webContents.on("will-navigate", (event: any, url) => {
      if (url !== this.mainWindow.webContents.getURL()) {
        event.preventDefault();
        const win = new BrowserWindow({show: false});
        win.loadURL(url);
        win.show();
        event.newGuest = win;
      }
    });

    const menu = Menu.buildFromTemplate(buildMenu(app, that));
    Menu.setApplicationMenu(menu);
  }

  private setTray() {
    const iconPath = path.join(__dirname, '../../assets/imgs/icons/png/16x16.png');
    this.tray = new Tray(nativeImage.createFromPath(iconPath));
    const contextMenu = Menu.buildFromTemplate([
      {label: 'Item1', type: 'radio'},
      {label: 'Exit', type: 'radio', role: "quit" },
    ]);
    this.tray.setToolTip('Phodit');
    this.tray.setContextMenu(contextMenu);
  }

  openFile(willLoadFile: string, isTempFile: boolean = false) {
    const imageRegex = /\.(jpe?g|png|gif|bmp|ico)$/i;
    const htmlRegex = /\.(html)$/i;
    const wordRegex = /\.(doc?x)$/i;

    if (imageRegex.test(willLoadFile)) {
      return this.mainWindow.previewFile(willLoadFile);
    } else if (htmlRegex.test(willLoadFile)) {
      return openHtmlPage(BrowserWindow, willLoadFile);
    } else if (wordRegex.test(willLoadFile)) {
      return shell.openPath(willLoadFile).then(() => {
        // do something
      });
    }

    if (this.mainWindow && !isTempFile) {
      const fileName = path.basename(willLoadFile);
      this.mainWindow.setTitle(fileName);
      this.mainWindow.setRepresentedFilename(willLoadFile);
    } else {
      this.checkWindow();
      storage.remove("storage.last.path");
      this.mainWindow.setTitle("Untitled");
    }

    storage.set("storage.last.file", {file: willLoadFile});
    this.currentFile = willLoadFile;
    fs.readFile(willLoadFile, "utf-8", (err, data) => {
      if (err) {
        console.log("An error ocurred reading the file :" + err.message);
        return;
      }

      app.addRecentDocument(willLoadFile);

      this.mainWindow.webContents.send("phodit.open.one-file", {
        data,
        isTempFile,
        file: willLoadFile,
      });
    });
  }

  openPath(pathName: any, isWatch = false) {
    this.checkWindow();

    storage.set("storage.last.path", {file: pathName});
    storage.remove("storage.last.file");

    let dirFiles: any[] = [];
    if (!isWatch) {
      chokidar
        .watch(pathName, {ignored: /(^|[\/\\])\../})
        .on("unlink", () => {
          this.reloadPath(true);
        })
        .on("add", () => {
          this.reloadPath(true);
        });
    }

    fs.readdir(pathName, (err, files) => {
      try {
        dirFiles = dirTree(pathName);
      } catch (e) {
        storage.remove("storage.last.path");
        console.log(e);
      }

      this.mainWindow.webContents.send(EventConstants.PHODIT.OPEN_PATH, {
        path: pathName,
        tree: dirFiles,
      });
    });
  }

  open() {
    this.dir = dialog.showOpenDialog(this.mainWindow, {
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
        this.openFile(fileNames[0]);
      }

      if (fileNames.length === 1 && fs.lstatSync(fileNames[0]).isDirectory()) {
        this.openPath(fileNames[0]);
      }
    });
  }

  saveFileSignal() {
    if (this.mainWindow.webContents) {
      this.mainWindow.webContents.send(EventConstants.CLIENT.SAVE_FILE);
    } else {
      dialog.showErrorBox("error", "not open file");
    }
  }

  saveFile(data: any, isTempFile: boolean) {
    if (!this.currentFile) {
      return;
    }
    if (!isTempFile && !this.currentFile.endsWith(".tmp")) {
      fs.writeFileSync(this.currentFile, data);
    } else {
      dialog.showSaveDialog(this.mainWindow, {}).then((filename: any) => {
        isTempFile = false;

        this.mainWindow.webContents.send(EventConstants.TEMP_FILE_STATUS, {
          isTempFile: false,
        });
        this.currentFile = filename;
        this.mainWindow.setTitle(filename);
        fs.writeFileSync(filename, data);
      });
    }
  }

  newFile() {
    tmp.file((err: any, lastPath: any, fd: any, cleanupCallback: any) => {
      if (err) {
        throw err;
      }

      this.checkWindow();

      storage.set("storage.last.file", {file: lastPath});
      this.openFile(lastPath, true);
    });
  }

  debug() {
    this.mainWindow.webContents.openDevTools();
  }

  reload() {
    this.mainWindow.webContents.reload();
  }

  openAboutPage() {
    createHelpPage(BrowserWindow);
  }

  reloadPath(isWatch = false) {
    storage.get("storage.last.path", (error: any, data: any) => {
      if (error) {
        throw error;
      }

      if (data && data.file) {
        this.openPath(data.file, isWatch);
      }
    });
  }

  checkWindow() {
    if (!this.mainWindow) {
      return this.onAppReady();
    }
    if (this.mainWindow && !this.mainWindow.webContents) {
      return this.onAppReady();
    }
  }

}
