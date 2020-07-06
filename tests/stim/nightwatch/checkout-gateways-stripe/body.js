//TESTING CHECKOUT GATEWAY - STRIPE - CHECKOUT.WETAIL.IO

//SANDBOX MODE

//WITH DHL SHIPPING TEST

//Single country conditions - GB, London, EC1A 1BB

var checkout_super_url = 'http://checkout.wetail.io/checkout/';

var productsToAdd = [
  { url: 'http://checkout.wetail.io/product/rugged-net-boot-nappa-blk/?attribute_pa_size=39', 	attribute: 'span.swatch-39' },
  { url: 'http://checkout.wetail.io/product/rugged-boot-verniz-blk/?attribute_pa_size=40', 		attribute: 'span.swatch-40' }
];

var cart_total = 'div.wtc-mini-cart p.woocommerce-mini-cart__total span.woocommerce-Price-amount'; //selector for cart total amount

var dhl_shipping_selector = '#shipping_method > li > label[for=wtc_shipping_method_0_flat_rate3] > span.shipping-label';

module.exports = {
  
  	'1) Clean-up the cart' : function (browser){
      	browser
        	.resizeWindow(1280, 800)
           	.url( checkout_super_url )
      		.waitForElementPresent( 'body', 2000 )
           	.deleteCookies()
      		.url( checkout_super_url )
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
          .url( checkout_super_url )
          .waitForElementVisible('#wtc_checkout_minicart_content > div > ul > li:nth-child(1)', 5000, 'Checkout is not empty!')
          .execute( function(sel){ return jQuery(sel).text() }, [cart_total], function( result ){ 
                    this.assert.ok( result.value, 'Checkout is not empty!'  )
          } )
  	},
  
  	'4) Switch shipping method to DHL Express' : function (browser) {
    	browser
        	.waitForElementVisible( dhl_shipping_selector, 10000 )
      		.click( dhl_shipping_selector )
      		.click( 'body' )
      		.waitForElementVisible( '#wtc_shipping_method_0_flat_rate3[checked]', 10000, true, null, 'DHL Express selected!' )
    },
  
  	'5) Switch to Stripe gateway and fill in the billing form' : function (browser) {
    	var stripe_selector 		= '#wtc_checkout_payment_selector > ul > li > label[for=wtc_payment_method_stripe]';
    	var stripe_selector_check 	= '#wtc_payment_method_stripe[checked]';
        browser
    		.waitForElementVisible( stripe_selector, 5000 )
    		.click( stripe_selector )
    		.click( 'body' )
    		.waitForElementPresent( stripe_selector_check, 10000 )
    		.waitForElementVisible( '#billing_first_name', 10000 )
    		.clearValue( '#billing_first_name' )	.setValue( '#billing_first_name', 'Testname' )
    		.clearValue( '#billing_last_name' )		.setValue( '#billing_last_name', 'Testsurname' )
    		.clearValue( '#billing_address_1' )		.setValue( '#billing_address_1', 'Testaddress, 99' )
    		.clearValue( '#billing_address_2' )		.setValue( '#billing_address_2', 'Testaddress, 99' )
    		.clearValue( '#billing_city' )			.setValue( '#billing_city', 'London' )
    		.clearValue( '#billing_state' )			.setValue( '#billing_state', 'LO' )
    		.clearValue( '#billing_postcode' )		.setValue( '#billing_postcode', 'EC1A 1BB' )
    		.clearValue( '#billing_phone' )			.setValue( '#billing_phone', '0123456879' )
    		.clearValue( '#billing_email' )			.setValue( '#billing_email', 'test@test3.tst' )
    		.clearValue( '#order_comments' )		.setValue( '#order_comments', 'Hi there! How are the things?' )
      		.click( '#terms' )
      		.pause( 1000 )
      		.click( '#place_order' )
  	},
   
  
  	'6) Process purchase using Stripe test card' : function (browser) {
		browser
          .waitForElementPresent( 'body > iframe.stripe_checkout_app', 10000 )
          .element('css selector', 'body > iframe.stripe_checkout_app', (frame) => {
               browser.frame({ELEMENT: frame.value.ELEMENT}, () => {
                  browser
                	.waitForElementVisible( '#card_number', 10000 )
                    .clearValue( '#card_number' ) 
                    .setValue( '#card_number', '4242' )
                    .setValue( '#card_number', '4242' )
                    .setValue( '#card_number', '4242' )
                    .setValue( '#card_number', '4242' )
                 	.pause( 100 )
                 	.getValue( '#card_number', function( res ){ this.assert.ok( res.value ) } )
                    .clearValue( '#cc-exp' ) 
                    .setValue( '#cc-exp', '12' )
                    .setValue( '#cc-exp', '19' )
                 	.pause( 100 )
                 	.getValue( '#cc-exp', function( res ){ this.assert.ok( res.value ) } )
                    .clearValue( '#cc-csc' ) .setValue( '#cc-csc', '123' )
                 	.pause( 100 )
                 	.getValue( '#cc-csc', function( res ){ this.assert.ok( res.value ) } )
                    .click( '#submitButton > span > span' )
                 	.pause( 300 )
                 	.assert.elementNotPresent( 'div.cardPaymentView .invalid' )
                    .click( '#submitButton' )
                 	.submitForm( 'body > div.overlayView.active > form' )
                    .waitForElementNotPresent( '#submitButton', 10000 )
                });
            })
          .frame(null); 
  	},
  
  	'7) Check thank you page' : function (browser) {
		browser
        	.waitForElementPresent( 'div.woocommerce p.woocommerce-thankyou-order-received', 20000 )
    		.assert.containsText( 'div.woocommerce p.woocommerce-thankyou-order-received', 'Thank you. Your order has been received.' )
        	.deleteCookies()
    		.end()
      		.assert.ok( 1, 'Done. All tests completed.' )
  	}
  
};