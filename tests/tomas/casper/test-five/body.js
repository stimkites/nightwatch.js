var casper = require('casper').create();
casper.start('http://checkout.wetail.io');

casper.then(function() {
    this.echo('First Page: ' + this.getTitle());
});

casper.thenOpen('http://checkout.wetail.io/checkout', function() {
    this.echo('Second Page: ' + this.getTitle());
});

casper.run();