var express = require('express');
var app = express();

var cidrizer = require('./modules/cidrizer.js');

const PORT_NUMBER = 8080;

// cidrizer.init();


// Bad cidr blocks: overlapping, preceeding+exceeding account;
// results = cidrizer.doLowestBlocking('10.82.208.0/20',
// [ '10.82.217.128/27', '10.82.217.0/24', '10.1.244.0/29', '10.253.244.0/29' ]);

// Valid ciderBlocks, with some adjacent
// results = cidrizer.doLowestBlocking('10.82.208.0/20',
// [ '10.82.217.128/27', '10.82.219.0/24' ]);

// Valid ciderBlocks, with some adjacent
results = cidrizer.doLowestBlocking('10.82.208.0/20',
    ['10.82.217.128/27', '10.82.218.0/27', '10.82.218.32/27']);

console.log(results);



// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
    res.render('pages/index');
});

app.listen(PORT_NUMBER);
console.log(`${PORT_NUMBER} is the magic port`);