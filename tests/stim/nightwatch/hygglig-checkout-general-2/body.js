//TESTING HYGGLIG CHECKOUT ON http://woocommerce-159920-484739.cloudwaysapps.com

//Payment method: credit card, approved

var checkout_url = 'http://woocommerce-159920-484739.cloudwaysapps.com/hygglig';

var test_for_empty = 'http://woocommerce-159920-484739.cloudwaysapps.com/varukorg';

var productsToAdd = [
  { url: 'http://woocommerce-159920-484739.cloudwaysapps.com/shop?add-to-cart=42' }
];

var cart_total = '.order-total > td:nth-child(2) > strong:nth-child(1) > span:nth-child(1)'; //selector for cart total amount

module.exports = {
  
  	'1) Clean-up the cart' : function (browser){
      	browser
        	.resizeWindow(1280, 800)
           	.url( test_for_empty )
      		.waitForElementPresent( 'footer', 5000 )
      		.element( 'css selector', 'p.cart-empty', function( res ){
          		if( res.value && res.value.ELEMENT ){
                  //cart is empty -> add to cart
                  this.assert.ok( res.value && res.value.ELEMENT, 'Adding cart items...' );
                  var i = -1;
                  while( productsToAdd[ ++i ] ){
                     browser
                       	.url( productsToAdd[i].url )
                    	.waitForElementVisible( 'div.woocommerce-message', 5000 )
                    	.assert.containsText( 'div.woocommerce-message', 'has been added to your cart' )
                  }
                }else
                  this.assert.elementPresent( 'tr.cart_item', 'Cart is not empty!' )
        	})
    },
  
  	  
  	'2) Go to the checkout - it must not be empty' : function (browser) {
    	browser
        	.url( checkout_url )
          	.resizeWindow( 1280, 800 )
          	.waitForElementVisible( cart_total, 5000, true, null, 'Checkout is not empty!')
      	  	.getText( cart_total, function( res ){
          		console.info( 'Current total: ' + res.value )	
        	})
  	},
  
  	'3) Fill in Hygglig checkout form' : function (browser) {
    	browser
        	.waitForElementVisible( '#HyggligCheckoutIframe', 15000 )
      		.frame( 'HyggligCheckoutIframe' )
      			.assert.elementPresent( '#EmailSearchField' )
      			.clearValue( '#EmailSearchField' )
      			.setValue( '#EmailSearchField', 'kircher.tomas@gmail.com' )
      			.click( '#btnEmailContinue' )
      			.pause( 200 )
      			.assert.elementPresent( '#PostalCodeSearchField' )
      			.clearValue( '#PostalCodeSearchField' )
      			.setValue( '#PostalCodeSearchField', '11262' )
      			.click( '#btnpostCodeContinue' )
      			.pause( 200 )
      			//fill all required fields - impossible with current credentials
      			.waitForElementVisible( '#btnNotYou', 10000 )
    }, 	
  
  	'4) Choose payment method: credit card and proceed to purchase' : function( browser ){
      	browser
        	.waitForElementVisible( '#KortMethod > label', 10000 )
      		.click( '#KortMethod > label' )
        	.waitForElementVisible( '#confirmButton', 30000 )
          	.click( '#confirmButton' )
          .frame( null )
    },
  
  	'5) Fill in credit card info and process payment' : function( browser ){
      	browser
        	.waitForElementVisible( '#cc', 15000 )
      		.url( function( res ){
          		console.info( res )
        	})
      		.getText( '#summaryId > div.summary-list > div > div > div:nth-child(2) > div', function( res ){
          		console.info( res.value )
        	} )
      		.clearValue( '#cc' )
      		.setValue( '#cc', '5100100000000000' )
      		.clearValue( '#expM' )
      		.setValue( '#expM', '12' )
          	.clearValue( '#expY' )
      		.setValue( '#expY', '22' )
      		.clearValue( '#securityCode' )
      		.setValue( '#securityCode', '123' )
      		.waitForElementVisible( '#Complete', 1000 )
      		.click( '#Complete' )
    },
  
  	'6) Check thank you page' : function (browser) {
		browser
        	.waitForElementPresent( '#post-43 > header > h1', 20000 )
    		.assert.containsText( '#post-43 > header > h1', 'Order received' )
      		.waitForElementVisible( '#HyggligCheckoutIframe', 10000 )
      		.frame( 'HyggligCheckoutIframe' )
      			.assert.containsText( 'body > div.container > h1', 'Betalning genomförd!' )
      			.getText( '#HyggligBelopp > strong', function( res ){
          			console.info( res.value )
        		} )
          	.frame( null )
        	.deleteCookies()
    		.end()
      		.assert.ok( 1, 'Done. All tests completed.' )
  	}
  
};