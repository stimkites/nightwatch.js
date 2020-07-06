//TESTING CHECKOUT GATEWAY - KLARNA V3 - on CHECKOUT.WETAIL.IO

//Country -> GB, London, EC1A 1BB

var checkout_url = 'http://checkout.wetail.io/checkout/';

var productsToAdd = [
  { url: 'http://checkout.wetail.io/product/tangled-boot-grained-blk/?attribute_pa_size=37',  	attribute: 'span.swatch-37' },
  { url: 'http://checkout.wetail.io/product/rugged-net-boot-nappa-blk/?attribute_pa_size=39', 	attribute: 'span.swatch-39' },
  { url: 'http://checkout.wetail.io/product/rugged-net-boot-nappa-blk/?attribute_pa_size=40', 	attribute: 'span.swatch-40' }
];

var cart_total = 'div.wtc-mini-cart p.woocommerce-mini-cart__total span.woocommerce-Price-amount'; //selector for cart total amount

var no_details = false;

//klarna link to change address -> defines we don't need to enter account details
var change_address_link = '#klarna-checkout-billing-address > a.link.cui__highlighted-link.fieldset--billing-address__link--change.is-shown > span'; 

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
    	var klarna_selector = '#wtc_checkout_payment_selector > ul > li > label[for=wtc_payment_method_kco]';
    	var klarna_selector_check = '#wtc_payment_method_kco[checked]';
        browser
    		.waitForElementVisible( klarna_selector, 5000 )
    		.click( klarna_selector )
    		.click( 'body' )
    		.waitForElementPresent( klarna_selector_check, 15000 )
    		.waitForElementVisible( '#klarna-checkout-container', 10000 )
    		.getText( cart_total, function( res ){
          		var cart_total_amount = res.value;
          		this.assert.ok( cart_total_amount, 'Total in the cart' )
          		browser
                  	.frame( 'klarna-checkout-iframe' )
          				.pause( 1000 )
                      	.getText( '#shopping-cart-next > span > div > p.shopping-cart-amount', function( res ){
                              this.assert.ok( cart_total_amount == res.value, 'Checkout total is equal to cart total' )
                      	});
        	})
    		.frame( 'klarna-checkout-iframe' )
      			.element( 'css selector', change_address_link, function( res ){
                      no_details = res.value && res.value.ELEMENT
        		})
    			.pause( 500 )
    			.waitForElementVisible( 'body div#testdrive-badge', 1000, true, function( res ){
          			console.info( res );
          			if( res.value )
                      this.assert.ok( true, 'Klarna V3 is ready to be filled up! SUCCESS!' )
          			else
                      this.assert.ok( false, 'Klarna could not be rendered...')
        		}, 'Klarna state' )
  },
    
  '5) Fill in Klarna basic email and postcode' : function (browser) {
    	if( no_details ) return browser.assert.ok( no_details, 'No need' );
		browser
        	.frame( 'klarna-checkout-iframe' )
    			.waitForElementVisible( 'input[name=email]', 2000 )
    			.clearValue( 'input[name=email]' ).setValue( 'input[name=email]', 'test@test.com' )
    			.clearValue( 'input[name=postal-code]' ).setValue( 'input[name=postal-code]', [ 'EC1A 1BB', browser.keys.ENTER ] )
                .click( '#challenge-field-country__select' )
                .getLocationInView( '#challenge-field-country__option__gbr' )
                .click( '#challenge-field-country__option__gbr' )
                .pause( 500 )
                .getText( '#challenge-field-country__selected', function( res ){
                    this.assert.ok( 'United Kingdom' === res.value, res.value )
                })
                .click( '#challenge-fieldset > div:nth-child(2) > div:nth-child(2) > button' )
                .pause( 5000 )
    			.element( 'css selector', change_address_link, function( res ){
                      no_details = res.value && res.value.ELEMENT;
          			  if( no_details )
          			  	this.assert.ok( no_details, 'No further details will be needed' );
        		})
    		.pause( 1000 )
        	.assert.ok( 1, 'Done' )
  },
  
  '6) Fill in Klarna main form' : function (browser) {
    	if( no_details ) return browser.assert.ok( no_details, 'No need' );
		browser
        	.frame( 'klarna-checkout-iframe' )
    			.waitForElementVisible( "input[name='billing_address.email']", 15000 )
    			.clearValue( "input[name='billing_address.email']" )			.setValue( "input[name='billing_address.email']", 'test@test.com' )
    			.clearValue( "input[name='billing_address.given_name']" )		.setValue( "input[name='billing_address.given_name']", 'TestName' )
    			.clearValue( "input[name='billing_address.family_name']" )		.setValue( "input[name='billing_address.family_name']", 'TestSurname' )
    			.clearValue( "input[name='billing_address.street_address']" )	.setValue( "input[name='billing_address.street_address']", 'TestAddress, 99' )
    			.clearValue( "input[name='billing_address.street_address2']" )	.setValue( "input[name='billing_address.street_address2']", 'TestAddress, 99' )
    			.clearValue( "input[name='billing_address.city']" )				.setValue( "input[name='billing_address.city']", 'LONDON' )		
    			.clearValue( "input[name='billing_address.region']" )			.setValue( "input[name='billing_address.region']", 'LO' )		
          		.clearValue( "input[name='billing_address.postal_code']" )		.setValue( "input[name='billing_address.postal_code']", 'EC1A 1BB' )
    			.clearValue( "input[name='billing_address.phone']" )			.setValue( "input[name='billing_address.phone']", '0765260000' )
    			.click( '#klarna-checkout-billing-address > button' ) //continue
    			.pause( 2000 )
    			.click( '#klarna-checkout-billing-address > button' ) //continue anyway
    			.pause( 2000 )
        		.waitForElementVisible( '#buy-button-next > span > div > span > button', 10000 )
    			.assert.ok( 1, 'Done' )
  },
  
  '7) Fill in payment card information' : function (browser) {
		browser
        	.frame( 'klarna-checkout-iframe' )
    			.waitForElementVisible( '#pgw-iframe', 15000 )
    			.frame( 'pgw-iframe' )
    				.waitForElementVisible( 'input[name=card_number]', 5000 )
    				.clearValue( 'input[name=card_number]' )	.setValue( 'input[name=card_number]', '4111 1111 1111 1111' )
    				.clearValue( 'input[name=expiry_date]' )	.setValue( 'input[name=expiry_date]', '12 / 19' )
    				.clearValue( 'input[name=security_code]' )	.setValue( 'input[name=security_code]', '123' )
    			.pause( 1000 )
          .frame( null )
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
    			.assert.containsText( '#section-header > div:nth-child(4) > div > h1', 'Your purchase is complete.' )
        		.assert.ok( 1, 'Done. All tests completed.' );
        browser
        	.deleteCookies()
    		.end()
  }
  
};