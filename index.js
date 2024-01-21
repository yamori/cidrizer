var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Used by the partials
var ip = require('ip');

var cidrizer = require('./modules/cidrizer.js');

const PORT_NUMBER = process.env.CIDRIZER_PORT || 80;

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use( bodyParser.json({type:"*/*"}));

// index page
app.get('/', function (req, res) {
    res.render('pages/index');
});

app.post('/do_cidr', function (req, res) {
    var userInput = req.body.userInput;
    console.log(`UserInput: ${userInput}`);
    var parsedBlocks = cidrizer.parseForBlocks(userInput);
    if (parsedBlocks.errorMessage != undefined) {
        res.render('partials/cidr_warning', {errorMessage: parsedBlocks.errorMessage});
        return;
    }

    //TODO, this will also need the != undefined check when presenting doLowestBlocking errors
    var results = cidrizer.doLowestBlocking(parsedBlocks.accountSpace, parsedBlocks.cidrBlocks);
    if (results.errorStruct.length > 0) {
      res.render('partials/cidr_danger', {errorStruct: results.errorStruct});
      return;
    }
    res.render('partials/cidr_results', {ip: ip, results: results});
});

app.listen(PORT_NUMBER);
console.log(`${PORT_NUMBER} is the magic port`);
