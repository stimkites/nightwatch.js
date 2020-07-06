//TESTING CHECKOUT ON UPDATE SHIPPING WHEN SELECTING DIFFERENT COUNTRY

/*
	Test cases:
    1. https://dev.reschia.com/checkout/ -> paypal only
    	1.1. Russia: Only Free shipping must be
        1.2. Swaziland: DHL Express & UPS
        1.3. Sweden: Free, DHL Express, Postnord, Click & Collect
    2. http://checkout.wetail.io/checkout/ -> Klarna V3
    	1.1. Germany: Free shipping, DHL Express, UPS
        1.2. Sweden: Free shipping, DHL Express, Postnord
        
*/

const checkout = {
  test1: {
    	url: 'https://dev.reschia.com/checkout/',
    	items: [
          		'https://dev.reschia.com/product/rugged-loafer-nappa-black/?attribute_pa_size=37',
  				'https://dev.reschia.com/product/rugged-zip-croco-black/?attribute_pa_size=40'
        ]
  	},
  test2: {
    	url: 'http://checkout.wetail.io/checkout/',
    	items: [
          		'http://checkout.wetail.io/product/rugged-net-boot-nappa-blk/?attribute_pa_size=39',
  				'http://checkout.wetail.io/product/tangled-boot-grained-blk/?attribute_pa_size=40'
        ]
  	}  	
}

/**
 * Find all needles in the array
 */
function inArray( haystack, needles ){
  	var j = needles.length;
  	while( needles[--j] ){ 
 		var i = haystack.length - 1;
  		while( haystack[i] && !( haystack[i].indexOf( needles[ j ] ) > -1 ) ) i--;
      	if( i < 0 ) return false;
    }
  	return true;
}

module.exports = {
	
  
  	'TEST 1. RESCHIA' : function (browser){
      browser
		.perform( function(){ console.info( '1. Clearing cookies...' ) } )
        .resizeWindow( 1280, 800 )
        .url( checkout.test1.url )
        .waitForElementPresent( '#wtc_block', 10000 )
        .deleteCookies()
        .pause( 1000 )
        .url( checkout.test1.url )
        .waitForElementPresent( '#wtc_block', 10000 )
        .url( function( res ){ this.assert.ok( res.value, 'Testing checkout URL' ) } )
        .element( 'css selector', 'p.empty-link', function( res ){
        	if( res.value && res.value.ELEMENT ){
          		this.assert.ok( 1, 'Cookies were cleared' )    
            }else{
              browser
              	.url( checkout.test1.url )
              	.waitForElementPresent( '#wtc_block', 10000 )
                .deleteCookies()
              	.url( checkout.test1.url )
              	.waitForElementPresent( 'p.empty-link', 10000 )
                .end()
            }
      	} )
      	.pause( 100 )
      	
        .perform( function(){ console.info( '2. Adding items to the cart...' ) } )
      	.perform( function(){
        	var i = -1;
        	while( checkout.test1.items[++i] ){
              browser
              	.url( checkout.test1.items[i] )
              	.waitForElementVisible( 'button.single_add_to_cart_button', 5000 )
              	.click( 'button.single_add_to_cart_button' )
              	.waitForElementVisible( 'div.woocommerce-message', 10000 )
              	.assert.containsText( 'div.woocommerce-message', 'has been added to your cart' )
            }
      	} )
      	
        .perform( function(){ console.info( '3. Go to checkout, confirm it\'s not empty...' ) } )
      	.url( checkout.test1.url )
      	.waitForElementVisible( 'body', 10000 )
      	.assert.elementNotPresent( 'p.empty-link' )
      	.getText( '#wtc_checkout_minicart_content > div > p > strong > span', function( res ){ this.assert.ok( res.value ) } )
      	
        .perform( function(){ console.info( '4. Switching to Paypal...' ) } )
      	.element( 'css selector', '#wtc_payment_method_paypal[checked]', function( res ){
        	if( res.value && res.value.ELEMENT )
              this.assert.ok( 1, 'Paypal selected' )
        	else{
              this
                .click( 'label[for=wtc_payment_method_paypal]' )
              	.assert.elementPresent( '#wtc_payment_method_paypal[checked]', 'Paypal selected' )
            }
      	})
      	.waitForElementVisible( '#select2-billing_country-container', 10000 )
      
      	.perform( function(){ console.info( '5. Selecting Russia...' ) } )
        .execute( function(){
        	document.querySelector( '#billing_country' ).value = 'RU';  
        	var evt = document.createEvent("HTMLEvents");
    		evt.initEvent("change", false, true);
    		document.querySelector( '#billing_country' ).dispatchEvent(evt);
      	} )
      	.pause( 2000 )
        .waitForElementNotVisible( 'div#wtc_block', 20000 )
      	.pause( 3000 )
        .getText( 'span#select2-billing_country-container', function( res ){
        	this.assert.ok( 'Russia' === res.value, res.value )
      	})
      
        .perform( function(){ console.info( '6. Checking shipping methods visible' ) } )
      	.execute( function(){
        	var shippings = [];
        	var $j = jQuery.noConflict();
        	$j('#wtc_checkout_shipping_selector input.shipping_method' ).each(function(){
              shippings.push( $j( this ).parent().find( 'span.shipping-label' ).html() );
            });
        	return shippings;
      	}, function( res ){
        	this.assert.ok( res.value.length === 1 && res.value[0] === 'Free Standard Shipping', res.value );
      	} )
      
      	.perform( function(){ console.info( '7. Selecting Swaziland...' ) } )
        .execute( function(){
        	document.querySelector( '#billing_country' ).value = 'SZ';  
        	var evt = document.createEvent("HTMLEvents");
    		evt.initEvent("change", false, true);
    		document.querySelector( '#billing_country' ).dispatchEvent(evt);
      	} )
        .pause( 2000 )
        .waitForElementNotVisible( 'div#wtc_block', 20000 )
      	.pause( 3000 )
        .getText( 'span#select2-billing_country-container', function( res ){
        	this.assert.ok( 'Swaziland' === res.value, res.value )
      	})
      
        .perform( function(){ console.info( '8. Checking shipping methods visible' ) } )
      	.execute( function(){
        	var shippings = [];
        	var $j = jQuery.noConflict();
        	$j('#wtc_checkout_shipping_selector input.shipping_method' ).each(function(){
              shippings.push( $j( this ).parent().find( 'span.shipping-label' ).html() );
            });
        	return shippings;
      	}, function( res ){
        	this.assert.ok( res.value.length === 2 && inArray( res.value, [ 'DHL Express', 'UPS' ] ), res.value );
      	} )
      
      	.perform( function(){ console.info( '9. Selecting Sweden...' ) } )
        .execute( function(){
        	document.querySelector( '#billing_country' ).value = 'SE';  
        	var evt = document.createEvent("HTMLEvents");
    		evt.initEvent("change", false, true);
    		document.querySelector( '#billing_country' ).dispatchEvent(evt);
      	} )
        .pause( 2000 )
        .waitForElementNotVisible( 'div#wtc_block', 20000 )
      	.pause( 3000 )
        .getText( 'span#select2-billing_country-container', function( res ){
        	this.assert.ok( 'Sweden' === res.value, res.value )
      	})
      
        .perform( function(){ console.info( '10. Checking shipping methods visible' ) } )
      	.execute( function(){
        	var shippings = [];
        	var $j = jQuery.noConflict();
        	$j('#wtc_checkout_shipping_selector input.shipping_method' ).each(function(){
              shippings.push( $j( this ).parent().find( 'span.shipping-label' ).html() );
            });
        	return shippings;
      	}, function( res ){
        	this.assert.ok( res.value.length === 4 && inArray( res.value, [ 'Free shipping', 'DHL Express', 'Click', 'Postnord' ] ), res.value );
      	} )
      	.perform( function(){ console.info( 'TEST 1. All steps completed!' ) } )
      	.end()
    },

  'TEST 2. KLARNA V3 ON CHECKOUT.WETAIL.IO' : function (browser){
      browser
		.perform( function(){ console.info( '1. Clearing cookies...' ) } )
        .resizeWindow( 1280, 800 )
        .url( checkout.test2.url )
        .waitForElementPresent( '#wtc_block', 10000 )
        .deleteCookies()
        .pause( 1000 )
        .url( checkout.test2.url )
        .waitForElementPresent( '#wtc_block', 10000 )
        .url( function( res ){ this.assert.ok( res.value, 'Testing checkout URL' ) } )
        .assert.elementPresent( 'p.empty-link', 'Cookies were cleared' )
      	.pause( 100 )
      	
        .perform( function(){ console.info( '2. Adding items to the cart...' ) } )
      	.perform( function(){
        	var i = -1;
        	while( checkout.test2.items[++i] ){
              browser
              	.url( checkout.test2.items[i] )
              	.waitForElementVisible( 'button.single_add_to_cart_button', 5000 )
              	.click( 'button.single_add_to_cart_button' )
              	.waitForElementVisible( 'div.woocommerce-message', 10000 )
              	.assert.containsText( 'div.woocommerce-message', 'has been added to your cart' )
            }
      	} )
      	
        .perform( function(){ console.info( '3. Go to checkout, confirm it\'s not empty...' ) } )
      	.url( checkout.test2.url )
      	.waitForElementVisible( 'body', 10000 )
      	.assert.elementNotPresent( 'p.empty-link' )
      	.getText( '#wtc_checkout_minicart_content > div > p > strong > span', function( res ){ this.assert.ok( res.value ) } )
      	
        .perform( function(){ console.info( '4. Switching to Klarna V3...' ) } )
      	.element( 'css selector', '#wtc_payment_method_kco', function( res ){
        	if( res.value && res.value.ELEMENT )
              this.assert.ok( 1, 'KCO selected' )
        	else{
              this
                .click( 'label[for=wtc_payment_method_kco]' )
              	.pause( 1000 )
              	.assert.elementPresent( '#wtc_payment_method_kco[checked]', 'KCO selected' )
            }
      	})
      	.waitForElementVisible( '#klarna-checkout-iframe', 10000 )
      
      	.perform( function(){ console.info( '5. Fill in Klarna form and switch to Germany...' ) } )
    	.frame( 'klarna-checkout-iframe' )
    		.waitForElementVisible( '#challenge-fieldset > div:nth-child(2) > div:nth-child(2) > button', 14000 )
    		.clearValue( 'input[name=email]' )
    		.setValue( 'input[name=email]', 'test@test.com' )
    		.clearValue( 'input[name=postal-code]' )
    		.setValue( 'input[name=postal-code]', '11551' )
    		.click( '#challenge-field-country__select' )
    		.getLocationInView( '#challenge-field-country__option__deu' )
    		.click( '#challenge-field-country__option__deu' )
    		.pause( 500 )
    		.getText( '#challenge-field-country__selected', function( res ){
                this.assert.ok( 'Germany' === res.value, res.value )
            })
    		.click( '#challenge-fieldset > div:nth-child(2) > div:nth-child(2) > button' )
    		.pause( 1000 )
        .frame( null )
        .waitForElementNotVisible( 'div#wtc_block', 20000 )
    	.pause( 2000 )
      
        .perform( function(){ console.info( '6. Checking shipping methods visible' ) } )
      	.execute( function(){
        	var shippings = [];
        	var $j = jQuery.noConflict();
        	$j('#wtc_checkout_shipping_selector input.shipping_method' ).each(function(){
              shippings.push( $j( this ).parent().find( 'span.shipping-label' ).html() );
            });
        	return shippings;
      	}, function( res ){
        	this.assert.ok( res.value.length === 3 && inArray( res.value, [ 'Free shipping', 'DHL Express', 'UPS' ] ), res.value );
      	} )
      
      	.perform( function(){ console.info( '7. Selecting Sweden in Klarna...' ) } )
        .frame( 'klarna-checkout-iframe' )
    		.click( "select[name='billing_address.country']" )
    		.getLocationInView( "select[name='billing_address.country'] > option[value=swe]" )
    		.click( "select[name='billing_address.country'] > option[value=swe]" )
    		.pause( 500 )
    		.getText( "#klarna-checkout-billing-address > div.fieldset--billing-address__field--country.is-enabled > div.fieldset--billing-address__editor-wrapper--country > span", function( res ){
                this.assert.ok( 'Sweden' === res.value, res.value )
            })
    		.pause( 1000 )
        .frame( null )
        .waitForElementNotVisible( 'div#wtc_block', 20000 )
      
        .perform( function(){ console.info( '8. Checking shipping methods visible' ) } )
      	.execute( function(){
        	var shippings = [];
        	var $j = jQuery.noConflict();
        	$j('#wtc_checkout_shipping_selector input.shipping_method' ).each(function(){
              shippings.push( $j( this ).parent().find( 'span.shipping-label' ).html() );
            });
        	return shippings;
      	}, function( res ){
        	this.assert.ok( inArray( res.value, [ 'Free shipping', 'DHL Express', 'Postnord' ] ), res.value );
      	} )
      	.perform( function(){ console.info( 'TEST 2. All steps completed!' ) } )
      	.end()
    }

};