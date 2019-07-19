var assert = require('assert');
var cidrizer = require('../modules/cidrizer.js');

describe('CIDRIZER module', function () {
    var accountSpace = '10.82.208.0/20';
    describe('core procedure', function () {

        var overlapping_and_outside_cidr_blocks =
            ['10.82.217.128/27', '10.82.217.0/24', '10.1.244.0/29', '10.253.244.0/29'];

        it('(this test used for low level debugging)', function () {
            // var results = cidrizer.doLowestBlocking("10.82.208.0/20", ["10.82.208.0/24","10.82.216.0/24","10.82.217.0/24",,"10.82.220.0/24"]);
            var results = cidrizer.doLowestBlocking("10.82.208.0/20", ["10.82.210.0/24"]);
            // var results = cidrizer.doLowestBlocking("10.82.208.0/20", [ '10.82.218.224/27', '10.82.219.0/24' ]);
            //console.log(results);

            // No valid results to return
            // assert.equal(results.cidrBlockingResults.length, 0);

            // Only meant for debuggin
            // Chance package.json to "test": "mocha test/test_debugging.js"
            assert.equal(3, 3);
        });
    });
});
