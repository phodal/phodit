const helpers = require('./global-setup');
const path = require('path');
const fs = require('fs');

const describe = global.describe;
const it = global.it;
const beforeEach = global.beforeEach;
const afterEach = global.afterEach;
const expect = require('chai').expect;

describe('input test', function () {
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

  describe('webContents.sendInputEvent', function () {
    xit('triggers a keypress DOM event', async function () {
      await app.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'A' });
      const elem = await app.client.$('.keypress-count');
      console.log(elem);
      let text = await elem.getText();
      expect(text).to.equal('A');
      await app.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'B' });
      text = await elem.getText();
      expect(text).to.equal('B');
    });
  });
});


