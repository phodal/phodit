const helpers = require('./global-setup');
const path = require('path');
const fs = require('fs');

const describe = global.describe;
const it = global.it;
const beforeEach = global.beforeEach;
const afterEach = global.afterEach;
const expect = require('chai').expect;

describe('ipc command test', function () {
  beforeEach(function () {
    return helpers
      .startApplication({
        args: [path.join(__dirname, '..')],
      })
      .then(function (startedApp) {
        app = startedApp;
      });
  });

  afterEach(function () {
    return helpers.stopApplication(app);
  });

  describe('electron.ipcRenderer.send', function () {
    xit('sends the message to the main process', async function () {
      let ipcCount = await app.electron.remote.getGlobal('ipcEventCount');
      expect(ipcCount).to.equal(0);
      await app.electron.ipcRenderer.send('ipc-event', 123);
      ipcCount = await app.electron.remote.getGlobal('ipcEventCount');
      expect(ipcCount).to.equal(123);
      await app.electron.ipcRenderer.send('ipc-event', 456);
      ipcCount = await app.electron.remote.getGlobal('ipcEventCount');
      expect(ipcCount).to.equal(579);
    });
  });
});


