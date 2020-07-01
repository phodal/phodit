const helpers = require('./global-setup');
const path = require('path');
const { expect } = require('chai');

const describe = global.describe;
const it = global.it;
const beforeEach = global.beforeEach;
const afterEach = global.afterEach;

describe('<webview> tags', function () {
  helpers.setupTimeout(this);

  let app = null;

  beforeEach(function () {
    return helpers
      .startApplication({
        args: [path.join(__dirname, '..')]
      })
      .then(function (startedApp) {
        app = startedApp;
      });
  });

  afterEach(function () {
    return helpers.stopApplication(app);
  });

  it('allows the web view to be accessed', async function () {
    // waiting for windowHandles ensures waitUntilWindowLoaded doesn't access a nil webContents.
    // TODO: this issue should be fixed by waitUntilWindowLoaded instead of this workaround.
    await app.client.waitUntilWindowLoaded();
    const elem = await app.client.$('body .editor-statusbar');
    // const text = await elem.getText();
    // expect(text).to.equal('web view');
    app.webContents.getTitle().should.eventually.equal('Web View');
  });
});

