module.exports = {
  'Demo Google test - check if we can read https' : function (browser) {
    browser
      .url('https://www.google.com')
      .waitForElementVisible('body', 1000)
      .source( function( res ){ 
          this.assert.ok( res.value !== '', 'HTTPS was read successfully!' )
       } )
      .end();
  }
};