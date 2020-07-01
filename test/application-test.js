const helpers = require('./global-setup');
const path = require('path');
const fs = require('fs');

const describe = global.describe;
const it = global.it;
const beforeEach = global.beforeEach;
const afterEach = global.afterEach;
const expect = require('chai').expect;

describe('application loading', function () {
  helpers.setupTimeout(this);

  let app = null;

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

  it('launches the application', async function () {
    app.browserWindow.getBounds().should.eventually.roughly(5).deep.equal({
      x: 25,
      y: 35,
      width: 200,
      height: 100
    });
    app.client.waitUntilTextExists('html', 'Hello');
    app.client.getTitle().should.eventually.equal('Test');
  });

  describe('browserWindow.capturePage', function () {
    it('returns a Buffer screenshot of the given rectangle', async function () {
      const buffer = await app.browserWindow.capturePage({
        x: 0,
        y: 0,
        width: 10,
        height: 10
      })

      expect(buffer).to.be.an.instanceof(Buffer);
      expect(buffer.length).to.be.above(0);
    });

    it('returns a Buffer screenshot of the entire page when no rectangle is specified', async function () {
      const buffer = await app.browserWindow.capturePage();
      expect(buffer).to.be.an.instanceof(Buffer);
      expect(buffer.length).to.be.above(0);
    });
  });
});
