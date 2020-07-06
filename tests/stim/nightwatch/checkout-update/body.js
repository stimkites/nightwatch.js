//TESTING CHECKOUT UPDATE
// - on change/update test
// - on shipping switch
// - on coupon apply

var productsToAdd = [
  { url: 'http://checkout.wetail.io/product/chunky-boot-croco-blk/?attribute_pa_size=38',  	 	attribute: 'span.swatch-38' },
  { url: 'http://checkout.wetail.io/product/chunky-boot-croco-blk/?attribute_pa_size=41',  	 	attribute: 'span.swatch-41' },
  //{ url: 'http://checkout.wetail.io/product/tangled-boot-grained-blk/?attribute_pa_size=37',  	attribute: 'span.swatch-37' },
  //{ url: 'http://checkout.wetail.io/product/rugged-net-boot-nappa-blk/?attribute_pa_size=39', 	attribute: 'span.swatch-39' },
  //{ url: 'http://checkout.wetail.io/product/rugged-net-boot-nappa-blk/?attribute_pa_size=40', 	attribute: 'span.swatch-40' }
];

var cart_total = 'div.wtc-mini-cart p.woocommerce-mini-cart__total span.woocommerce-Price-amount'; //selector for cart total amount

var checkout_url = 'http://checkout.wetail.io/checkout/';

module.exports = {
  
  	'1) Check if cart has items in cart' : function (browser){
      browser
      	.resizeWindow(1280, 800)
      	.url( checkout_url )
      	.element( 'css selector', '.wtc-mini-cart li.mini_cart_item:nth-child(1)', function( res ){
        	if( res.value && res.value.ELEMENT )
              	this
                  	.deleteCookies()
        			.end()
        			.pause( 1000 )
        			.resizeWindow(1280, 800)
                    .url( checkout_url )
                    .waitForElementVisible( 'p.empty-link', 5000, 'Cart has been emptied!' )
        	else
              this
                .assert.elementPresent( 'p.empty-link', 'Cart is empty!' )
      	})
    },
  
  	'2) Add new items to the cart' : function (browser) {
     	var i = -1;
      	while (productsToAdd[++i]){
    		browser
              	.url(productsToAdd[i].url)
              	.waitForElementPresent( productsToAdd[i].attribute + '.selected', 5000 )
          		.pause(500)
              	.submitForm('form.cart')
          	  	.waitForElementVisible('div.woocommerce-message', 5000)
              	.assert.containsText('div.woocommerce-message', 'has been added to your cart', 'Item added to the cart!')
       }
  },
  
  '3) Go to the checkout - it must not be empty' : function (browser) {
    browser
    	.url('http://checkout.wetail.io/checkout/')
    	.waitForElementVisible('li.mini_cart_item:nth-child(1) > a:nth-child(1)', 5000, 'Checkout is not empty!')
    	.execute( function(sel){ return jQuery(sel).text() }, [cart_total], function( result ){ 
            	  this.assert.ok( result.value, 'Checkout is not empty!'  )
    	} )
  },
  
  '4) Check for cart item quantity update' : function (browser) {
    	var current_total = 0;
    	var quantity = 'li.mini_cart_item:nth-child(1) > div:nth-child(4) > input:nth-child(1)';
    	var current_q = 0;
        browser
            .waitForElementVisible( cart_total, 1000 )
    		.getText( cart_total, function( res ){
            	current_total = res.value;
            	this.assert.ok( current_total )
        	} )
    		.waitForElementVisible( quantity, 1000 )
    		.getValue( quantity, function( res ) { 
            	current_q = Number( res.value );
            	this.assert.ok( current_q, ' - current quantity' );
            	this.clearValue( quantity )
    			this.setValue( quantity, [ current_q + 2, browser.keys.ENTER ] )
          	} )
    		.click( '.cart-discount > div:nth-child(1) > a:nth-child(1)' )
    		.pause( 3000 )
    		.waitForElementVisible( quantity, 1000 ) 
    		.getValue( quantity, function( res ) { 
            	this.assert.ok( res.value, ' - new actual quantity: ' )
          	} )
    		.click( 'li.mini_cart_item:nth-child(1) > a:nth-child(1)' )
    		.pause( 3000 )
    		.waitForElementVisible( cart_total, 1000 )
    		.getText( cart_total, function( res ){
            	this.assert.ok( res.value !== current_total, 'New total: ' + res.value )
          	} )
  },
  
  '5) Check for shipping switch total update' : function (browser) {
    	var current_total = 0;
    	var current_q = 0;
    	var select_new_shipping = 'li.shipping-method:not(.selected) input[type=radio]';
        browser
            .waitForElementVisible( cart_total, 1000 )
    		.getText( cart_total, function( res ){
            	current_total = res.value;
            	this.assert.ok( current_total )
        	} )
    		.waitForElementVisible( select_new_shipping, 1000 )
    		.click( select_new_shipping )
    		.pause( 3000 )
    		.waitForElementVisible( cart_total, 1000 )
    		.getText( cart_total, function( res ){
            	this.assert.ok( res.value !== current_total, 'New total: ' + res.value )
          	} )
  },
  
  '6) Check for update totals on coupon apply' : function (browser) {
    	var current_total = 0;
    	var current_q = 0;
    	var coupon_code = 'rvip20';
    	var coupon_link = '.cart-discount > div:nth-child(1) > a:nth-child(1)';
    	var coupon_field = 'form.checkout_coupon:nth-child(2) > p:nth-child(1) > input:nth-child(1)';
    	var coupon_butt = 'div.cart-foldable form.checkout_coupon input[type=submit]';
    	var coupon_remove = '.coupon-data > a.woocommerce-remove-coupon';
        browser
        	//.url('http://checkout.wetail.io/checkout/')
            .waitForElementVisible( cart_total, 1000 )
    		.getText( cart_total, function( res ){
            	current_total = res.value;
            	this.assert.ok( current_total )
        	} )
    		.element('css selector', coupon_remove, function( res ){
                if( res.value && res.value.ELEMENT ){
                    this
                      	.assert.visible( coupon_remove,'Coupon is applied already!' )
                    	.click( coupon_remove )
                  		.pause( 1000 )
                  		.assert.elementNotPresent( coupon_remove )
                }else
                  this.assert.elementNotPresent( coupon_remove, 'No applied coupons' );
            })
    		.waitForElementVisible( coupon_link, 1000 )
    		.click( coupon_link )
    		.waitForElementVisible( coupon_field, 1000 )
    		.clearValue( coupon_field )
    		.setValue( coupon_field, coupon_code )
    		.getValue( coupon_field, function( res ){ this.assert.ok( res.value ) })
    		.assert.elementPresent( coupon_butt )
    		.click( coupon_butt )
    		.pause( 3000 )
    		.waitForElementNotVisible( coupon_butt, 5000 )
    		.element('css selector', '.woocommerce-error', function( res ){
                if( res.value && res.value.ELEMENT )
                  this.getText( '.woocommerce-error', function( res ){
                    this.assert.ok( 0, res.value );
                  })
                else
                  this.assert.elementNotPresent( '.woocommerce-error', 'No errors on applying coupon' );
        	})
    		.getText( cart_total, function( res ){
            	this.assert.ok( res.value !== current_total, 'New total: ' + res.value )
          	} )
    		.deleteCookies()
    		.end()
  }
  
};