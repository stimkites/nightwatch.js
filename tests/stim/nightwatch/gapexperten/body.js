//----TESTING GAPEXPERTEN DHL SHIPPING RULES----//


//Tests to run - comment/uncomment lines here to run corresponding tests
var run = [
  //'check',  
  //'extra_products',
  'products'
];
//products to test
var test = {
  cart_total: ".shipping > td:nth-child(2) > span:nth-child(1)", //selector for cart total amount
  cart_url 	: "http://woocommerce-159920-595681.cloudwaysapps.com/cart/?lang=en",
  add_url	: "http://woocommerce-159920-595681.cloudwaysapps.com/produkt-kategori/dhl-testing/?lang=en&add-to-cart=", //concatenate with POST_ID
  check	: [							//Cart validation tests
    { 
     'id ' : '2050', 
     'code': 'CZ', 
     'city': 'Prague', 
     'zip' : '10400',
     'exp' : 'exceeds maximum allowed' 	
    }, 	
    { 
     'id'  : '2051', 
     'code': 'CZ', 
     'city': 'Prague', 
     'zip' : '10400',
     'exp' : 'has no weight'
    },
    { 
     'id'  : '2062', 
     'code': 'CZ', 
     'city': 'Prague', 
     'zip' : '10400',
     'exp' : 'has no length'
    },
    { 
     'id'  : '2063', 
     'code': 'CZ', 
     'city': 'Prague', 
     'zip' : '10400',
     'exp' : 'has no width' 
    },
    { 
     'id'  : '2056', 
     'code': 'SE', 
     'city': 'Stockholm', 
     'zip' : '11500',
     'exp' : 'exceeds maximum allowed' 	
    },
    { 
     'id'  : '2065', 
     'code': 'SE', 
     'city': 'Stockholm', 
     'zip' : '11500',
     'exp' : 'exceeds maximum allowed'
    },
    { 										
     'id'  : '2056',
     'code': 'NO',
     'city': 'Oslo',
     'zip' : '0155',
     'exp' : 'is not in DHL allowed list'
    }
  ],
  extra_products : [					//Products over 2500 kg for extra caclulations in EU only
    { 										
      'id' 				: '2056', 		//Long, extra calc, rest EU
      'eu_code'			: 'PL',
      'eu_city'			: 'Warsawa',
      'eu_zip'			: '00-028',
      'eu_exp'			: '6,781.93'
    },
    { 							
      'id' 				: '2056',		//Long, extra calc, Nordic
      'eu_code'			: 'FI',
      'eu_city'			: 'Helsinki',
      'eu_zip'			: '00100',
      'eu_exp'			: '7,113.6'
    },
    { 							
      'id' 				: '2066',		//Regular, extra weight
      'eu_code'			: 'FI',
      'eu_city'			: 'Helsinki',
      'eu_zip'			: '00100',
      'eu_exp'			: '2,522.21'
    },
    { 							
      'id' 				: '2067',		//Dangerous, extra weight
      'eu_code'			: 'CZ',
      'eu_city'			: 'Prague',
      'eu_zip'			: '10400',
      'eu_exp'			: '6,228.07'
    },
    { 							
      'id' 				: '2068',		//Regular, full load
      'eu_code'			: 'CZ',
      'eu_city'			: 'Prague',
      'eu_zip'			: '10400',
      'eu_exp'			: '14,278.8'
    },
    { 							
      'id' 				: '2070',		//Long, full load
      'eu_code'			: 'CZ',
      'eu_city'			: 'Prague',
      'eu_zip'			: '10400',
      'eu_exp'			: '14,278.8'
    }
  ],
  products	: [							//Normal flow tests
   /* { 					
      'id' 				: '2046',		//POST_ID
      'se_zip_1' 		: '13001', 		//zip for SE
      'se_zip_1_exp' 	: '162', 		//expectation for SE !in Woo format. E.g. 1345.02 = 1,345.02
      'se_zip_2' 		: '56001',
      'se_zip_2_exp'	: '148.8',
      'eu_code'			: 'PL',
      'eu_city'			: 'Warsawa',
      'eu_zip'			: '00-028',
      'eu_exp'			: '554.76'		//expectation for EU
    }, 
    {
      'id'				: '2047',	
      'se_zip_1' 		: '23001',
      'se_zip_1_exp' 	: '201.6',
      'se_zip_2' 		: '78001',
      'se_zip_2_exp'	: '172.8',
      'eu_code'			: 'PL',
      'eu_city'			: 'Warsawa',
      'eu_zip'			: '00-028',
      'eu_exp'			: '699.9'
    },
    {
      'id'				: '2048',	
      'se_zip_1' 		: '23001',
      'se_zip_1_exp' 	: '523.2',
      'se_zip_2' 		: '96001',
      'se_zip_2_exp'	: '702',
      'eu_code'			: 'PL',
      'eu_city'			: 'Warsawa',
      'eu_zip'			: '00-028',
      'eu_exp'			: '1,566.23'
    },
    {
      'id'				: '2049',	
      'se_zip_1' 		: '11001',
      'se_zip_1_exp' 	: '1,338',
      'se_zip_2' 		: '41001',
      'se_zip_2_exp'	: '1,507.2',
      'eu_code'			: 'PL',
      'eu_city'			: 'Warsawa',
      'eu_zip'			: '00-028',
      'eu_exp'			: '2,860.68'
    },
    
    
    {
      'id'				: '2052',	
      'se_zip_1' 		: '20001',
      'se_zip_1_exp' 	: '448.8',
      'se_zip_2' 		: '90001',
      'se_zip_2_exp'	: '589.2',
      'eu_code'			: 'FI',
      'eu_city'			: 'Helsinki',
      'eu_zip'			: '00100',
      'eu_exp'			: '3,012.91'
    },*/
    {
      'id'				: '2053',
      'se_zip_1' 		: '36001',
      'se_zip_1_exp' 	: '295.2',
      'se_zip_2' 		: '71001',
      'se_zip_2_exp'	: '284.4',
      'eu_code'			: 'CZ',
      'eu_city'			: 'Prague',
      'eu_zip'			: '10400',
      'eu_exp'			: '2,655.12'
    },/*
    {
      'id'				: '2054',
      'se_zip_1' 		: '50001',
      'se_zip_1_exp' 	: '1,089.6',
      'se_zip_2' 		: '80001',
      'se_zip_2_exp'	: '1,231.2',
      'eu_code'			: 'FI',
      'eu_city'			: 'Helsinki',
      'eu_zip'			: '00100',
      'eu_exp'			: '2,935.2'
    },
    {
      'id'	 			: '2055',
      'se_zip_1' 		: '95001',
      'se_zip_1_exp' 	: '2,877.6',
      'se_zip_2' 		: '34001',
      'se_zip_2_exp'	: '1,378.8',
      'eu_code'			: 'CZ',
      'eu_city'			: 'Prague',
      'eu_zip'			: '10400',
      'eu_exp'			: '2,935.2'
    },
    {
      'id' 				: '2057',
      'se_zip_1' 		: '15001',
      'se_zip_1_exp' 	: '427.2',
      'se_zip_2' 		: '51001',
      'se_zip_2_exp'	: '424.8',
      'eu_code'			: 'CZ',
      'eu_city'			: 'Prague',
      'eu_zip'			: '10400',
      'eu_exp'			: '842.76'
    },
    {
      'id' 				: '2058', 
      'se_zip_1' 		: '26001',
      'se_zip_1_exp' 	: '1,107.6',
      'se_zip_2' 		: '78001',
      'se_zip_2_exp'	: '1,114.8',
      'eu_code'			: 'CZ',
      'eu_city'			: 'Prague',
      'eu_zip'			: '10400',
      'eu_exp'			: '2,266.88'
    },
    {
      'id'				: '2059',
      'se_zip_1' 		: '45001',
      'se_zip_1_exp' 	: '1,911.6',
      'se_zip_2' 		: '80001',
      'se_zip_2_exp'	: '1,771.2',
      'eu_code'			: 'CZ',
      'eu_city'			: 'Prague',
      'eu_zip'			: '10400',
      'eu_exp'			: '3,195.12'
    }*/
  ]
}; 


var tests = (function(){
  
    var tst = {}, //result test object
        
        make_test = {
          
          products : function( test_data ){ //normal flow tests
            
            var current = test_data;
            return function( browser ){

                  browser

                    //clear cart	
                    .resizeWindow(1280, 800)
                    .url( test.cart_url )
                    .waitForElementPresent( 'body', 2000 )
                    .deleteCookies()
                    .url( test.cart_url )
                    .waitForElementVisible( 'p.cart-empty', 5000, true, null, 'Cart is emptied!' )

                    //add to cart
                    .url( test.add_url + current.id )
                    .waitForElementPresent( 'div.woocommerce-message[role=alert]', 5000, true, null, 'Proceeded to cart url!' )
                    .assert.containsText( 'div.woocommerce-message[role=alert]', 'har lagts i din varukorg', 'Item #' + current.id + ' is added to the cart!' )

                    //Perform test 1 for SE
                    .url( test.cart_url )
                    .waitForElementVisible( '.shipping-calculator-button', 5000, true, null, 'Found shipping calculator form!' )
                    .click( '.shipping-calculator-button' )
                    .waitForElementVisible( 'button[name=calc_shipping]', 2000, true, null, 'Ready to input shipping details!'  )
                    .execute( function(){
                      document.querySelector( '#calc_shipping_country' ).value = 'SE';  
                      var evt1 = document.createEvent("HTMLEvents");
                      evt1.initEvent("change", false, true);
                      document.querySelector( '#calc_shipping_country' ).dispatchEvent(evt1);
                    } )
                    .pause( 1000 )		
                    .assert.value( '#calc_shipping_country', 'SE', 'Country is set to SE' )
                    .clearValue( '#calc_shipping_city' ).setValue( '#calc_shipping_city', 'Stockholm' )
                    .clearValue( '#calc_shipping_postcode' ).setValue( '#calc_shipping_postcode', current.se_zip_1 )
                    .click( 'button[name=calc_shipping]' )
                    .pause( 1000 )
                    .waitForElementVisible( test.cart_total, 5000, true, null, 'Shipping calculated!' )
                    .assert.containsText( test.cart_total, current.se_zip_1_exp, 'SE test 1 OK! Proceeding to SE test 2...' )

                    //Peform test 2 for SE
                    .click( '.shipping-calculator-button' )
                    .waitForElementVisible( 'button[name=calc_shipping]', 2000, true, null, 'Ready to input shipping details!'  )
                    .clearValue( '#calc_shipping_postcode' ).setValue( '#calc_shipping_postcode', current.se_zip_2 )
                    .click( 'button[name=calc_shipping]' )
                    .pause( 2000 )
                    .waitForElementVisible( test.cart_total, 5000, true, null,'Shipping calculated!' )
                    .assert.containsText( test.cart_total, current.se_zip_2_exp, 'SE test 2 OK! Proceeding to EU test...' )

                    //Peform test for EU	
                    .url( test.cart_url )
                    .waitForElementVisible( '.shipping-calculator-button', 5000, true, null, 'Found shipping calculator form!' )
                    .click( '.shipping-calculator-button' )
                    .waitForElementVisible( 'button[name=calc_shipping]', 2000, true, null, 'Ready to input shipping details!'  )
                    .clearValue( '#calc_shipping_country' )
                    .execute( function( code ){
                      document.querySelector( '#calc_shipping_country' ).value = code;  
                      var evt2 = document.createEvent("HTMLEvents");
                      evt2.initEvent( "change", false, true );
                      document.querySelector( '#calc_shipping_country' ).dispatchEvent( evt2 );
                    }, [ current.eu_code ] )
                    .assert.value( '#calc_shipping_country', current.eu_code, 'Country is set to ' + current.eu_code )
                    .clearValue( '#calc_shipping_city' ).setValue( '#calc_shipping_city', current.eu_city )
                    .clearValue( '#calc_shipping_postcode' ).setValue( '#calc_shipping_postcode', current.eu_zip )
                    .click( 'button[name=calc_shipping]' )
                    .pause( 1000 )
                    .waitForElementVisible( test.cart_total, 5000, true, null,'Shipping calculated!' )
                    .assert.containsText( test.cart_total, current.eu_exp, 'EU test OK!' )
                    .perform( function(){ console.info(' ***** Tests on product #' + current.id + ' are completed successfully! ***** ') } )
                    .pause( 3000 )
                    .end();
                    //Done for product

              }

          },

          extra_products : function( test_data ){ //extra weight in EU flow tests
            var current = test_data;
            return function( browser ){

                  browser

                    //clear cart	
                    .resizeWindow(1280, 800)
                    .url( test.cart_url )
                    .waitForElementPresent( 'body', 2000 )
                    .deleteCookies()
                    .url( test.cart_url )
                    .waitForElementVisible( 'p.cart-empty', 5000, true, null, 'Cart is emptied!' )

                    //add to cart
                    .url( test.add_url + current.id )
                    .waitForElementPresent( 'div.woocommerce-message[role=alert]', 5000, true, null, 'Proceeded to cart url!' )
                    .assert.containsText( 'div.woocommerce-message[role=alert]', 'har lagts i din varukorg', 'Item #' + current.id + ' is added to the cart!' )

                    //Peform test for EU	
                    .url( test.cart_url )
                    .waitForElementVisible( '.shipping-calculator-button', 5000, true, null, 'Found shipping calculator form!' )
                    .click( '.shipping-calculator-button' )
                    .waitForElementVisible( 'button[name=calc_shipping]', 2000, true, null, 'Ready to input shipping details!'  )
                    .clearValue( '#calc_shipping_country' )
                    .execute( function( code ){
                      document.querySelector( '#calc_shipping_country' ).value = code;  
                      var evt2 = document.createEvent("HTMLEvents");
                      evt2.initEvent( "change", false, true );
                      document.querySelector( '#calc_shipping_country' ).dispatchEvent( evt2 );
                    }, [ current.eu_code ] )
                    .assert.value( '#calc_shipping_country', current.eu_code, 'Country is set to ' + current.eu_code )
                    .clearValue( '#calc_shipping_city' ).setValue( '#calc_shipping_city', current.eu_city )
                    .clearValue( '#calc_shipping_postcode' ).setValue( '#calc_shipping_postcode', current.eu_zip )
                    .click( 'button[name=calc_shipping]' )
                    .pause( 1000 )
                    .waitForElementVisible( test.cart_total, 5000, true, null,'Shipping calculated!' )
                    .assert.containsText( test.cart_total, current.eu_exp, 'EU test OK!' )
                    .perform( function(){ console.info(' ***** Tests on product #' + current.id + ' are completed successfully! ***** ') } )
                    .pause( 3000 )
                    .end();
                    //Done for product

              }

          },

          check : function( test_data ){ //cart validation tests in general
            var current = test_data;
            return function( browser ){

                  browser

                    //clear cart	
                    .resizeWindow(1280, 800)
                    .url( test.cart_url )
                    .waitForElementPresent( 'body', 2000 )
                    .deleteCookies()
                    .url( test.cart_url )
                    .waitForElementVisible( 'p.cart-empty', 5000, true, null, 'Cart is emptied!' )

                    //add to cart
                    .url( test.add_url + current.id )
                    .waitForElementPresent( 'div.woocommerce-message[role=alert]', 5000, true, null, 'Proceeded to cart url!' )
                    .assert.containsText( 'div.woocommerce-message[role=alert]', 'har lagts i din varukorg', 'Item #' + current.id + ' is added to the cart!' )

                    //set the CZ as the EU country (non-SE, but EU)
                    .url( test.cart_url )
                    .waitForElementVisible( '.shipping-calculator-button', 5000, true, null, 'Found shipping calculator form!' )
                    .click( '.shipping-calculator-button' )
                    .waitForElementVisible( 'button[name=calc_shipping]', 2000, true, null, 'Ready to input shipping details!'  )
                    .clearValue( '#calc_shipping_country' )
                    .execute( function( code ){
                      document.querySelector( '#calc_shipping_country' ).value = code;  
                      var evt2 = document.createEvent("HTMLEvents");
                      evt2.initEvent( "change", false, true );
                      document.querySelector( '#calc_shipping_country' ).dispatchEvent( evt2 );
                    }, [ current.code ] )
                    .assert.value( '#calc_shipping_country', current.code, 'Country is set to ' + current.code + '!' )
                    .clearValue( '#calc_shipping_city' ).setValue( '#calc_shipping_city', current.city )
                    .clearValue( '#calc_shipping_postcode' ).setValue( '#calc_shipping_postcode', current.zip )
                    .click( 'button[name=calc_shipping]' )
                    .pause( 1000 )

                    //Peform test for expected woo message
                    .waitForElementPresent( 'ul.woocommerce-error[role=alert]', 5000, true, null, 'Found woo error message!' )
                    .assert.containsText( 'ul.woocommerce-error[role=alert]', current.exp, 'Test successful!' )
                    .perform( function(){ console.info(' ***** Tests on product #' + current.id + ' are completed successfully! ***** ') } )
                    .pause( 3000 )
                    .end();
                    //Done for product

              }

          }
          
		},
        
        make_all_tests = function(){
          
          for( var p = 0; p < run.length; p++ )
            for( var i = 0; i < test[run[p]].length; i++ ){
            	tst[ 'TEST TYPE: ' + run[p] + '. Testing product #' + test[run[p]][i].id ] = new make_test[run[p]]( test[run[p]][i] );
            }
          
        };
	return {
      init : function(){
        make_all_tests();
        return tst;
      }
    }
})();

module.exports = tests.init();