import {BrowserWindow, ipcMain} from "electron";
import {EventConstants} from "../common/constants/event.constants";
import {IFileSave} from "../common/interface/IFileSave";
import {pandoc} from "./features/pandoc";
import {createSlidePage} from "./pages/silde.page";
import Phodit from "./phodit";

export default class PhoditIpc {
  private app: Phodit;

  constructor(app: Phodit) {
    this.app = app;
  }

  startListener() {
    ipcMain.on(EventConstants.PHODIT.OPEN_FILE, (event: any, arg: any) => {
      this.app.openFile(arg);
    });

    ipcMain.on(EventConstants.PHODIT.SAVE_FILE, (event: any, arg: IFileSave) => {
      this.app.saveFile(arg.data, arg.isTempFile);
    });

    ipcMain.on(EventConstants.PHODIT.OPEN_GUIDE, (event: any, arg: any) => {
      this.app.openAboutPage();
    });

    ipcMain.on(EventConstants.PHODIT.SHOW_SLIDES, (event: any, arg: any) => {
      createSlidePage(BrowserWindow, arg);
    });

    ipcMain.on(EventConstants.PHODIT.FULL_SCREEN, (event: any, arg: any) => {
      this.app.mainWindow.setFullScreen(true);
      this.app.mainWindow.maximize();
    });

    ipcMain.on(EventConstants.PHODIT.UN_FULL_SCREEN, (event: any, arg: any) => {
      this.app.mainWindow.setFullScreen(false);
      this.app.mainWindow.unmaximize();
    });

    ipcMain.on(EventConstants.PHODIT.RELOAD_PATH, (event: any, arg: any) => {
      this.app.reloadPath();
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
  }
}
