export function openHtmlPage(BrowserWindow: any, filePath: any) {
  let htmlPage: any = null;

  function buildHtmlPage() {
    if (htmlPage) {
      htmlPage.focus();
      return;
    }

    htmlPage = new BrowserWindow({
      height: 800,
      width: 600,
      title: "网页",
      backgroundColor: "#fff",
    });

    htmlPage.on("closed", function() {
      htmlPage = null;
    });

    htmlPage.loadFile(filePath);

    htmlPage.once("ready-to-show", () => htmlPage.show());

    // htmlPage.webContents.openDevTools();
  }

  buildHtmlPage();
}
