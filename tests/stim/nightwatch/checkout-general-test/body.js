//TESTING CHECKOUT IN GENERAL

var productsToAdd = [
  { url: 'http://checkout.wetail.io/product/chunky-boot-croco-blk/?attribute_pa_size=41', 	  attribute: 'span.swatch-41' },
  { url: 'http://checkout.wetail.io/product/tangled-boot-grained-blk/?attribute_pa_size=40',  attribute: 'span.swatch-40' },
  { url: 'http://checkout.wetail.io/product/rugged-net-boot-nappa-blk/?attribute_pa_size=39', attribute: 'span.swatch-39' }
];

var cart_empty = 0; //empty cart flag

module.exports = {
  
  	'1) Check if cart is empty' : function (browser){
      browser
      	.url('http://checkout.wetail.io/checkout/')
      	.element('css selector', 'p.empty-link', function( result ){
          	if( result.value && result.value.ELEMENT ){
              	browser.assert.visible('p.empty-link','Cart is empty!')
              	cart_empty = 1;
            }else
              	browser.assert.elementNotPresent('p.empty-link','Cart has items!')
        });
      	
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
              	.assert.containsText('div.woocommerce-message', 'has been added to your cart')
       }
  },
  
  '3) Go to the checkout - it must not be empty' : function (browser) {
    browser
    	.url('http://checkout.wetail.io/checkout/')
    	.waitForElementNotVisible('li.mini_cart_item a.remove', 5000, 'Checkout is not empty!')
    	.end()
  }
  
};