import * as path from "path";

export function createSlidePage(BrowserWindow: any) {
  let aboutWindow: any = null;

  function openSlidePage() {
    if (aboutWindow) {
      aboutWindow.focus();
      return;
    }

    aboutWindow = new BrowserWindow({
      height: 1440,
      width: 960,
      title: "帮助",
      fullscreen: true,
    });

    aboutWindow.on("closed", function() {
      aboutWindow = null;
    });

    aboutWindow.loadFile(path.join(__dirname, "../../../views/slides.html"));

    aboutWindow.once("ready-to-show", () => aboutWindow.show());
  }

  openSlidePage();
}
