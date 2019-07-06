var assert = require('assert');
var cidrizer = require('../modules/cidrizer.js');

describe('CIDRIZER module', function () {
    describe('parsing abilities to recognize CIDR blocks', function () {

        it('should correctly parse multiple lines', function () {
            var firstIP = "10.1.1.1/32";
            var inputText = `${firstIP}\n10.1.1.2/32\n10.1.1.3/32`;
            var results = cidrizer.parseForBlocks(inputText);

            // Parses 3 lines
            assert.equal(results.accountSpace.toUpperCase() === firstIP.toUpperCase(), true);
            assert.equal(results.cidrBlocks.length, 2);
        });

        it('should correctly trim white space', function () {
            var firstIP = "10.1.1.1/32";
            var inputText = `  ${firstIP}   \n10.1.1.2/32\n10.1.1.3/32`;
            var results = cidrizer.parseForBlocks(inputText);

            // Parses 3 lines
            assert.equal(results.accountSpace.toUpperCase() === firstIP.toUpperCase(), true);
            assert.equal(results.cidrBlocks.length, 2);
        });

        it('should throw an error if regex doesnt match', function () {
            var badAccountSpace = "10.1.1/32";
            var okAccountSpace = "10.1.1.0/28";
            var badCIDRSpace = "10.1.1.2/";
            var okCIDRSpace = "10.1.1.3/32";

            var inputText = `${badAccountSpace}\n${okCIDRSpace}`;
            var results = cidrizer.parseForBlocks(inputText);
            // Detect the bad account space
            assert.equal(results.errorMessage.toUpperCase() === `Doesn't appear to be valid CIDR: ${badAccountSpace}`.toUpperCase(), true);

            // Second test, detect bad subsequent CDIR block
            var inputText2 = `${okAccountSpace}\n${badCIDRSpace}`;
            var results2 = cidrizer.parseForBlocks(inputText2);
            // Detect the bad CIDR space
            assert.equal(results2.errorMessage.toUpperCase() === `Doesn't appear to be valid CIDR: ${badCIDRSpace}`.toUpperCase(), true);
        });
    });
});
