import * as path from "path";

export function buildAboutPage(BrowserWindow: any) {
  let aboutWindow: any = null;

  function openAboutWindow() {
    if (aboutWindow) {
      aboutWindow.focus();
      return;
    }

    aboutWindow = new BrowserWindow({
      height: 800,
      width: 600,
      title: "帮助",
      backgroundColor: '#ddd'
    });

    aboutWindow.on('closed', function () {
      aboutWindow = null;
    });

    aboutWindow.loadFile(path.join(__dirname, "../../../views/about.html"));

    aboutWindow.once('ready-to-show', () => aboutWindow.show());

    // aboutWindow.webContents.openDevTools();
  }

  openAboutWindow();
}
