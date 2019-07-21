var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Used by the partials
var ip = require('ip');

var cidrizer = require('./modules/cidrizer.js');

const PORT_NUMBER = 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use( bodyParser.json({type:"*/*"}));

// index page
app.get('/', function (req, res) {
    res.render('pages/index');
});

app.post('/do_cidr', function (req, res) {
    var userInput = req.body.userInput;
    var parsedBlocks = cidrizer.parseForBlocks(userInput);
    if (parsedBlocks.errorMessage != undefined) {
        res.render('partials/cidr_error', {errorMessage: parsedBlocks.errorMessage});
        return;
    }

    //TODO, this will also need the != undefined check when presenting doLowestBlocking errors
    var results = cidrizer.doLowestBlocking(parsedBlocks.accountSpace, parsedBlocks.cidrBlocks);
    res.render('partials/cidr_results', {ip: ip, results: results});
});

app.listen(PORT_NUMBER);
console.log(`${PORT_NUMBER} is the magic port`);
