module.exports = {
  'step one' : function (browser) {
    browser
      .url('https://ya.ru')
      .waitForElementVisible('body', 1000)
      .setValue('input#text', 'nightwatch')
      .waitForElementVisible('button[type=submit]', 1000)
  },

  'step two' : function (browser) {
    browser
      .click('button[type=submit]')
      .pause(1000)
      .assert.containsText('ul[role=main]', 'Nightwatch.js is an easy to use Node.js based End-to-End (E2E) testing solution for browser based apps and websites')
      .end();
  }
};