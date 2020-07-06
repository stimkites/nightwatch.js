//TESTING CHECKOUT GATEWAY - KLARNA OLD VERSION - on DEV.RESCHIA.COM

var checkout_url = 'https://dev.reschia.com/checkout/';

var productsToAdd = [
	{ url: 'https://dev.reschia.com/product/rugged-loafer-nappa-black/?attribute_pa_size=37',  		attribute: 'span.swatch-37' },
  	{ url: 'https://dev.reschia.com/product/rugged-zip-croco-black/?attribute_pa_size=40', 			attribute: 'span.swatch-40' },
  	{ url: 'https://dev.reschia.com/product/rugged-shoe-grained-white/?attribute_pa_size=36', 		attribute: 'span.swatch-36' }
];

var cart_total = 'div.wtc-mini-cart p.woocommerce-mini-cart__total span.woocommerce-Price-amount'; //selector for cart total amount

var no_national_id = false; //flag for prefilled Klarna form -> originally must not be helpful, but surprises are everywhere

var change_address_link = '#klarna-checkout-billing-address > a.link.cui__highlighted-link.fieldset--billing-address__link--change.is-shown > span'; //klarna link to change address -> defines we don't need to enter national ID etc

module.exports = {
  
  	'1) Clean-up the cart' : function (browser){
      	browser
        	.resizeWindow(1280, 800)
           	.url( checkout_url )
      		.waitForElementPresent( 'body', 2000 )
           	.deleteCookies()
      		.url( checkout_url )
            .resizeWindow(1280, 800)
            .waitForElementVisible( 'p.empty-link', 5000, true, null, 'Cart is emptied!' )		
    },
  
  	'2) Add new items to the cart' : function (browser) {
      	var i = -1;
      	while (productsToAdd[++i])
          browser
            .url( productsToAdd[i].url )
            .waitForElementPresent( productsToAdd[i].attribute + '.selected', 5000 )
            .pause(500)
            .submitForm('form.cart')
            .waitForElementVisible('div.woocommerce-message', 5000)
            .assert.containsText('div.woocommerce-message', 'has been added to your cart', 'Item added to the cart!')
  },
  
  '3) Go to the checkout - it must not be empty' : function (browser) {
    browser
    	.resizeWindow( 1280, 800 )
    	.url( checkout_url )
    	.waitForElementVisible('#wtc_checkout_minicart_content > div > ul > li:nth-child(1)', 5000, 'Checkout is not empty!')
    	.execute( function(sel){ return jQuery(sel).text() }, [cart_total], function( result ){ 
            	  this.assert.ok( result.value, 'Checkout is not empty!'  )
    	} )
  },
  
  '4) Switch to Klarna Checkout' : function (browser) {
    	var klarna_selector = '#wtc_checkout_payment_selector > ul > li > label[for=wtc_payment_method_klarna_checkout]';
    	var klarna_selector_check = '#wtc_payment_method_klarna_checkout[checked]';
    	var country_selector_value = '#select2-billing_country-container';
    	var country_drop_down = '#billing_country_field > span > span.selection > span > span.select2-selection__arrow';
    	var sweden_selector = '#select2-billing_country-result-k59t-SE';
        browser
        	.execute( function(){
          		return wtc_klarna_checkout.current_country;
        	}, function( res ){
          		this.assert.ok( res.value, 'Switching to Sweden for Klarna...')
        	} )
    		.pause( 500 )
          	.execute( function(){
               	jQuery( '#billing_country' ).val( 'SE' ).trigger( 'change' )
            } )
    		.pause( 300 )
    		.click( '#wtc_checkout_minicart_content > div > ul > li > a.remove' )
    		.pause( 5000 )
    		.getText( 'span#select2-billing_country-container', function( res ){
          		this.assert.ok( 'Sweden' === res.value, res.value )
        	})
    		.pause( 2000 )
    		.waitForElementVisible( klarna_selector, 5000 )
    		.click( klarna_selector )
    		.execute(
          		function(){
                  	jQuery( '#wtc_payment_method_klarna_checkout' ).attr('checked', true).trigger( 'change' )
                }
        	)
    		.click( 'body' )
    		.pause( 10000 )
    		.waitForElementPresent( klarna_selector_check, 5000 )
    		.getText( cart_total, function( res ){
          		console.info( res.value )
        	})
    		.waitForElementVisible( '#wtc_checkout_checkout_area > div.klarna_checkout', 20000 )
    		.waitForElementVisible( '#klarna-checkout-container', 3000 )
    		.frame( 'klarna-checkout-iframe' )
    			.waitForElementVisible( 'body div#testdrive-badge', 1000, true, function( res ){
          			console.info( res );
          			if( res.value )
                      this.assert.ok( true, 'Klarna is ready to be filled up! SUCCESS!' )
          			else
                      this.assert.ok( false, 'Klarna could not be rendered...')
        		}, 'Klarna state' )
  },
  
  '5) Reset Klarna form' : function (browser) {
    	
		browser
        	.frame( 'klarna-checkout-iframe' )
    			.element( 'css selector', change_address_link, function( res ){
                      no_national_id = res.value && res.value.ELEMENT
        		})
    			.pause( 500 )
        	.assert.ok( 1, 'Done' )
  },
  
  '6) Fill in Klarna national ID form' : function (browser) {
    	if( no_national_id ) return browser.assert.ok( no_national_id, 'No need' );
		browser
        	.frame( 'klarna-checkout-iframe' )
    			.waitForElementVisible( 'input[name=email]', 2000 )
    			.clearValue( 'input[name=email]' )		.setValue( 'input[name=email]', 'test@test.com' )
    			.clearValue( 'input[name=postal-code]' ).setValue( 'input[name=postal-code]', [ '11500', browser.keys.ENTER ] )
    			.click( '#next-main > span > span > div > div > form > div:nth-child(2) > div:nth-child(2) > button' ) //click "Continue"
    			.pause( 2000 )
    			.element( 'css selector', change_address_link, function( res ){
          			if( res.value && res.value.ELEMENT )
                      no_national_id = true;
          			else
                      this
                		.clearValue( 'input[name=national-identification-number]' ).setValue( 'input[name=national-identification-number]', [ '410321-9202', browser.keys.ENTER ] )
          				.click( '#next-main > span > span > div > div > form > div:nth-child(2) > div:nth-child(2) > button' ) //click "Continue"
    					.pause( 2000 )
        		})
    		.pause( 1000 )
        	.assert.ok( 1, 'Done' )
  },
  
  '7) Fill in Klarna main form' : function (browser) {
    	if( no_national_id ) return browser.assert.ok( no_national_id, 'No need' );
		browser
        	.frame( 'klarna-checkout-iframe' )
    			.element( 'css selector', change_address_link, function( res ){
                      if( res.value && res.value.ELEMENT )
                        this.click( change_address_link )
        		})
    			.pause( 500 )
    			.waitForElementVisible( "input[name='billing_address.email']", 2000 )
    			.clearValue( "input[name='billing_address.email']" )			.setValue( "input[name='billing_address.email']", 'test@test.com' )
    			.clearValue( "input[name='billing_address.given_name']" )		.setValue( "input[name='billing_address.given_name']", 'TestName' )
    			.clearValue( "input[name='billing_address.family_name']" )		.setValue( "input[name='billing_address.family_name']", 'TestSurname' )
    			.clearValue( "input[name='billing_address.street_address']" )	.setValue( "input[name='billing_address.street_address']", 'TestAddress, 99' )
    			.clearValue( "input[name='billing_address.postal_code']" )		.setValue( "input[name='billing_address.postal_code']", '11500' )
    			.clearValue( "input[name='billing_address.phone']" )			.setValue( "input[name='billing_address.phone']", '0765260000' )
    			.click( '#klarna-checkout-billing-address > button' )
    			.pause( 2000 )
        		.waitForElementVisible( '#buy-button-next > span > div > span > button', 1000 )
    			.assert.ok( 1, 'Done' )
  },
  
  '8) Process purchase' : function (browser) {
		browser
        	.frame( 'klarna-checkout-iframe' )
    			.getLocationInView( '#buy-button-next > span > div > span > button' )
    			.click( '#buy-button-next > span > div > span > button' )
    			.pause( 1000 )
          	.assert.ok( 1, 'Done' )
  },
  
  '9) Check thank you page' : function (browser) {
		browser
        	.waitForElementPresent( 'div#klarna-checkout-container', 20000 )
    		.pause( 1000 )
    		.frame( 'klarna-checkout-iframe' )
    			.assert.containsText( '#section-header > div:nth-child(4) > div > h1', 'Your order has been placed.' )
        		.assert.ok( 1, 'Done. All tests completed.' );
        browser
        	.deleteCookies()
    		.end()
  }
  
};