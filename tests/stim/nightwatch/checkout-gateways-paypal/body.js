//TESTING CHECKOUT GATEWAY - PAYPAL - CHECKOUT.WETAIL.IO

//SANDBOX MODE

//WITH DHL SHIPPING TEST

//Country - GB, London, EC1A 1BB

var checkout_super_url = 'http://checkout.wetail.io/checkout/';

var productsToAdd = [
  { url: 'http://checkout.wetail.io/product/tangled-boot-grained-blk/?attribute_pa_size=36',  	attribute: 'span.swatch-36' },
  { url: 'http://checkout.wetail.io/product/rugged-net-boot-nappa-blk/?attribute_pa_size=37', 	attribute: 'span.swatch-37' },
  //{ url: 'http://checkout.wetail.io/product/rugged-boot-verniz-blk/?attribute_pa_size=39', 		attribute: 'span.swatch-39' }
];

var cart_total = 'div.wtc-mini-cart p.woocommerce-mini-cart__total span.woocommerce-Price-amount'; //selector for cart total amount

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
  
  	'4) Switch to PayPal gateway' : function (browser) {
    	var paypal_selector 		= '#wtc_checkout_payment_selector > ul > li > label[for=wtc_payment_method_paypal]';
    	var paypal_selector_check 	= '#wtc_payment_method_paypal[checked]';
        browser
    		.waitForElementVisible( paypal_selector, 5000 )
    		.click( paypal_selector )
    		.click( 'body' )
    		.waitForElementPresent( paypal_selector_check, 10000 )
    		.waitForElementVisible( '#billing_first_name', 10000 , true, null, 'PayPal is selected!' )
    },
    
  	
  	'5) Select country - UK' : function (browser) {
      	browser
        	.execute( function(){
        		document.querySelector( '#billing_country' ).value = 'GB';  
        		var evt = document.createEvent("HTMLEvents");
    			evt.initEvent("change", false, true);
    			document.querySelector( '#billing_country' ).dispatchEvent(evt);
      		} )
        	.pause( 2000 )
        	.waitForElementNotVisible( 'div#wtc_block', 20000 )
      		.pause( 3000 )
        	.getText( 'span#select2-billing_country-container', function( res ){
        		this.assert.ok( 'United Kingdom (UK)' === res.value, res.value )
      		})
      		.click( '#wtc_checkout_minicart_content > div > ul > li > a.remove' )
      		.pause( 2000 )
      		.waitForElementNotVisible( 'div#wtc_block', 20000 )
    },
  
  
  	'6) Switch shipping method to DHL Express' : function (browser) {
    	browser
        	.execute( function(){
                var shippings = [];
                var $j = jQuery.noConflict();
                $j( '#wtc_checkout_shipping_selector input.shipping_method' ).each(function(){
                  shippings.push( $j( this ).parent().find( 'span.shipping-label' ).html() );
                });
                return shippings;
            }, function( res ){
                this.assert.ok( res.value.length > 0 && res.value.indexOf( 'DHL Express' ) > -1, res.value );
            } )
        	.waitForElementVisible( 'label[for=wtc_shipping_method_0_flat_rate3]', 10000 )
      		.click( 'label[for=wtc_shipping_method_0_flat_rate3]' )
      		.click( '#wtc_shipping_method_0_flat_rate3' )
      		.click( 'body' )
      		.pause( 6000 )
      		.waitForElementVisible( '#wtc_shipping_method_0_flat_rate3[checked]', 20000, true, null, 'DHL Express selected!' )
    },
  
  	'7) Fill in the billing form' : function (browser) {
        browser
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
      		.pause( 7000 )
      		.url( function( res ){
          		this.assert.ok( res )
        	} )
  	},
   
  
  	'8) Process purchase on PayPal server' : function (browser) {
		browser
        	.waitForElementVisible( '#btnLogin', 20000 )
      		.getTitle( function( res ){
               this.assert.ok( res )
             })
        	.waitForElementVisible( '#email', 20000 )
      		.clearValue( '#email' ) .setValue( '#email', 'test@test3.tst' )
      		.clearValue( '#password' ) .setValue( '#password', 'testtest88' )
      		.click( '#btnLogin' )
      		.waitForElementVisible( '#confirmButtonTop', 30000 )
      		.pause( 2000 )
      		.getText( '#reviewUserInfo', function( res ){ console.info( res.value ) } )
      		.click( '#confirmButtonTop' )
      		.waitForElementVisible( '#merchantReturnBtn', 30000 )
      		.getText( '#paid-text > b', function( res ){ console.info( 'Paid amount: ' + res.value ) } )
      		.getText( '#contents > div > div > div > div.essentials.ng-scope > div:nth-child(3) > div > span.amount', function( res ){
          		console.info( 'Paid actual amount: ' + res.value );
        	})
      		.click( '#merchantReturnBtn' )
  	},
  
  	'9) Check thank you page' : function (browser) {
		browser
        	.waitForElementPresent( 'div.woocommerce p.woocommerce-thankyou-order-received', 20000 )
    		.assert.containsText( 'div.woocommerce p.woocommerce-thankyou-order-received', 'Thank you. Your order has been received.' )
        	.deleteCookies()
    		.end()
      		.assert.ok( 1, 'Done. All tests completed.' )
  	}
  
};