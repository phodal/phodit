import * as path from "path";

export function createHelpPage(BrowserWindow: any) {
  let helpWindow: any = null;

  function openAboutWindow() {
    if (helpWindow) {
      helpWindow.focus();
      return;
    }

    helpWindow = new BrowserWindow({
      height: 800,
      width: 600,
      title: "Markdown 帮助",
      backgroundColor: "#ddd",
    });

    helpWindow.on("closed", function() {
      helpWindow = null;
    });

    helpWindow.loadFile(path.join(__dirname, "../../../views/help.html"));

    helpWindow.once("ready-to-show", () => helpWindow.show());
  }

  openAboutWindow();
}
