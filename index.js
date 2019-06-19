var msg = require('./modules/cidrizer.js');

// msg.init();


// Bad cidr blocks: overlapping, preceeding+exceeding account;
// results = msg.doLowestBlocking('10.82.208.0/20',
// [ '10.82.217.128/27', '10.82.217.0/24', '10.1.244.0/29', '10.253.244.0/29' ]);

// Valid ciderBlocks, with some adjacent
// results = msg.doLowestBlocking('10.82.208.0/20',
// [ '10.82.217.128/27', '10.82.219.0/24' ]);

// Valid ciderBlocks, with some adjacent
results = msg.doLowestBlocking('10.82.208.0/20',
    ['10.82.217.128/27', '10.82.218.0/27', '10.82.218.32/27']);

console.log(results);