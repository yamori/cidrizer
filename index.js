var express = require('express');
var bodyParser = require('body-parser');
var app = express();

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
    console.log("/do_cidr - userInput: " + userInput);
    console.log(JSON.stringify(userInput));
    var parsedBlocks = cidrizer.parseForBlocks(userInput);
    if (parsedBlocks.errorMessage != undefined) {
        res.render('partials/cidr_error', {errorMessage: parsedBlocks.errorMessage});
        return;
    }

    var results = cidrizer.doLowestBlocking(parsedBlocks.accountSpace, parsedBlocks.cidrBlocks);
    console.log(results);
    res.render('partials/cidr_results', {results: results});
});

app.listen(PORT_NUMBER);
console.log(`${PORT_NUMBER} is the magic port`);
