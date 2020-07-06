//Test if phantomjs supports ajax page refresh in general

var test = '';

module.exports = {
  
  '1. dev.printer.se' : function (browser) {
    browser
      	.url('https://dev.printer.se/produkt/kontorsmaterial/anteckningsbocker/anteckningsblock-korkmonster/')
      	.waitForElementVisible( 'footer', 15000 )
    	.click( 'ul.flow-pager li:nth-child(3)' )
    	.waitForElementVisible( 'p.price > span:nth-child(1)', 500 )
		.getText( 'p.price > span:nth-child(1)', function( res ) {
      		test = res.value;
      		this.assert.ok( test );
    	} )
    	.click( 'ul.flow-pager li:nth-child(1)' )
    	.waitForElementVisible( 'input[name=sync-quantity]', 500 )
      	.clearValue( "input[name=sync-quantity]" )
      	.setValue( "input[name=sync-quantity]", [ "32", browser.keys.ENTER ] )
    	.pause( 1000 )
    	.click( 'body' )
    	.getValue( 'input[name=sync-quantity]', function( res ) {
      		this.assert.ok( res.value > 30, res.value )
    	 } )
    	.pause( 1000 )
    	.click( 'ul.flow-pager li:nth-child(3)' )
    	.waitForElementVisible( 'p.price > span:nth-child(1)', 500 )
		.getText( 'p.price > span:nth-child(1)', function( res ) {
      		this.assert.ok( test < res.value, 'New price: ' + res.value );
    	} )
    	.end()
  }

  
};