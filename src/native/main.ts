import { app, BrowserWindow, dialog, globalShortcut, ipcMain } from "electron";
import * as path from "path";
import * as fs from "fs";

let mainWindow: Electron.BrowserWindow;
let dir;

app.on('ready', () => {
  globalShortcut.register('CommandOrControl+O', () => {
    dir = dialog.showOpenDialog(mainWindow, {
      filters: [
        {name: 'Markdown ', extensions: ['markdown', 'md', 'txt']},
        {name: 'All Files', extensions: ['*']}
      ],
      properties: ['openFile', 'openDirectory', 'multiSelections']
    }, (fileNames: any) => {
      console.log("--------------------");
      console.log(fileNames);

      fs.readFile(fileNames[0], 'utf-8', (err, data) => {
        if (err) {
          alert("An error ocurred reading the file :" + err.message);
          return;
        }

        // Change how to handle the file content
        console.log("The file content is : " + data);
        mainWindow.webContents.send('open-file', data);
      });
    });
  })
});

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../../index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('asynchronous-message', (event: any, arg: any) => {
  event.sender.send('asynchronous-reply', 'pong')
});

ipcMain.on('synchronous-message', (event: any, arg: any) => {
  console.log(arg); // prints "ping"
  event.returnValue = 'pong'
});

