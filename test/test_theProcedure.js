var assert = require('assert');
var cidrizer = require('../modules/cidrizer.js');

describe('CIDRIZER module', function () {
    var accountSpace = '10.82.208.0/20';
    describe('core procedure - detecting bad CIDR blocks', function () {

        var overlapping_and_outside_cidr_blocks =
            ['10.82.217.128/27', '10.82.217.0/24', '10.1.244.0/29', '10.253.244.0/29'];

        it('should detect incorrect cidr blocks relative to the account', function () {
            var results = cidrizer.doLowestBlocking(accountSpace, overlapping_and_outside_cidr_blocks);

            // No valid results to return
            assert.equal(results.cidrBlockingResults.length, 0);

            // ... but error struct has content
            assert.equal(results.errorStruct.length, 3);
        });

        it('should detect incorrect overlapping cidr blocks', function () {
            var results = cidrizer.doLowestBlocking(accountSpace, overlapping_and_outside_cidr_blocks);

            assert.equal(
                results.errorStruct[2].toLocaleLowerCase().includes('overlaps with'), true);
        });

        it('should detect incorrect preceeding cidr blocks', function () {
            var results = cidrizer.doLowestBlocking(accountSpace, overlapping_and_outside_cidr_blocks);

            assert.equal(results.errorStruct[0].toLocaleLowerCase().includes('precedes the account space'), true);
        });

        it('should detect incorrect exceeding cidr blocks', function () {
            var results = cidrizer.doLowestBlocking(accountSpace, overlapping_and_outside_cidr_blocks);

            assert.equal(
                results.errorStruct[1].toLocaleLowerCase().includes('exceeds the account space'), true);
        });
    });


    describe('core procedure', function () {

        var adjacent_cidr_blocks = [ '10.82.218.224/27', '10.82.219.0/24' ];
        it('should properly process valid cidr blocks (including adjacent blocks)', function () {
            var results = cidrizer.doLowestBlocking(accountSpace, adjacent_cidr_blocks);
            // `results.cidrBlockingResults` will look as follows:
            // { errorStruct: [],
            //     cidrBlockingResults:
            //      [ '10.82.208.0/21',
            //        '10.82.216.0/23',
            //        '10.82.218.0/25',
            //        '10.82.218.128/26',
            //        '10.82.218.192/27',
            //        '10.82.218.224/27',
            //        '10.82.219.0/24',
            //        '10.82.220.0/22' ],
            //     accountCIDRBlock: '10.82.208.0/20' }

            // Valid results, per above
            assert.equal(results.cidrBlockingResults.length, 8);
            // Check the two entries
            assert.equal(results.cidrBlockingResults[5], adjacent_cidr_blocks[0]);
            assert.equal(results.cidrBlockingResults[6], adjacent_cidr_blocks[1]);
        });

        var account_front_cidr = ["10.82.208.0/24"];
        it('should properly process block which starts with account space', function () {
            var results2 = cidrizer.doLowestBlocking(accountSpace, account_front_cidr);
            // `results.cidrBlockingResults` will look as follows:
            // { errorStruct: [],
            //     cidrBlockingResults:
            //      [ '10.82.208.0/24',
            //        '10.82.209.0/24',
            //        '10.82.210.0/23',
            //        '10.82.212.0/22',
            //        '10.82.216.0/21' ],
            //     accountCIDRBlock: '10.82.208.0/20' }

            // Valid results, per above
            assert.equal(results2.cidrBlockingResults.length, 5);
            // Check the two entries
            assert.equal(results2.cidrBlockingResults[0], account_front_cidr[0]);
        });

        var middle_cidr = ["10.82.210.0/24"];
        it('should properly process block which starts with account space', function () {
            var results3 = cidrizer.doLowestBlocking(accountSpace, middle_cidr);
            // `results.cidrBlockingResults` will look as follows:
            // { errorStruct: [],
            //     cidrBlockingResults:
            //      [ '10.82.208.0/23',
            //        '10.82.210.0/24',
            //        '10.82.211.0/24',
            //        '10.82.212.0/22',
            //        '10.82.216.0/21' ],
            //     accountCIDRBlock: '10.82.208.0/20' }

            // Valid results, per above
            assert.equal(results3.cidrBlockingResults.length, 5);
            // Check the two entries
            assert.equal(results3.cidrBlockingResults[1], middle_cidr[0]);
        });

        it('should include the account level CIDR block', function () {
            var results4 = cidrizer.doLowestBlocking(accountSpace, adjacent_cidr_blocks);
            // Include the account level info
            assert.equal(results4.accountCIDRBlock, accountSpace);
        });

        it('should accomodate when the input is only the account space, no additional blocks', function () {
            var results6 = cidrizer.doLowestBlocking(accountSpace, []);
            // Include the account level info
            assert.equal(results6.accountCIDRBlock, accountSpace);
            assert.equal(results6.cidrBlockingResults[0], accountSpace);
        });
    });
});
