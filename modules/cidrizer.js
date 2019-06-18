var ip = require('ip');

// Purpose of this module is to do all the heavy lifting for 
// creating a lowest form of cidr representation given the 
// account and cidr block inputs.

// Create CIDR masks in descending order
var DECREASING_CIDR_MASKS = [];
for (var i = 1; i <= 32; i++) {
    DECREASING_CIDR_MASKS.push(`/${i}`);
}

var cidrIzer = function () {

    var current = 'ola';
    function init() {
        console.log(current);
        console.log(ip.toLong('10.82.208.0/20'));
        console.log(DECREASING_CIDR_MASKS);
    }
    function change() {
        console.log('change');
    }
    function verify() {
        console.log('verify');
    }
    return {
        init: init,
        change: change
    }
}();
module.exports = exports = cidrIzer;