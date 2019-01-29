export function openHtmlPage(BrowserWindow: any, filePath: any) {
  let htmlPage: any = null;

  function buildHtmlPage() {
    if (htmlPage) {
      htmlPage.focus();
      return;
    }

    htmlPage = new BrowserWindow({
      height: 768,
      width: 1024,
      title: "网页",
      backgroundColor: "#fff",
    });

    htmlPage.on("closed", () => {
      htmlPage = null;
    });

    htmlPage.loadFile(filePath);
    htmlPage.once("ready-to-show", () => htmlPage.show());
    // htmlPage.webContents.openDevTools();
  }

  buildHtmlPage();
}
