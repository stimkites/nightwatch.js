module.exports = {
  'Demo Yandex Body test' : function (browser) {
    browser
      .url('https://ya.ru')
      .waitForElementVisible('body', 1000)
      .source( function( res ){ console.info( res.value ) } )
      .end();
  }
};