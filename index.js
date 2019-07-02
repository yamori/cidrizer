var express = require('express');
var app = express();

var cidrizer = require('./modules/cidrizer.js');

const PORT_NUMBER = 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

// index page 
app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/do_cidr', function (req, res) {
    res.json('{"success" : "Updated Successfully", "status" : 200}');
});

app.listen(PORT_NUMBER);
console.log(`${PORT_NUMBER} is the magic port`);