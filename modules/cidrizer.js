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

    function parseForBlocks(text) {
        // This function will parse the text from an html form
        var linesSplit = text.split("\n");

        var accountSpace = "";
        var cidrBlocks = [];
        var cidrBlock;
        for (index = 0; index < linesSplit.length; ++index) {
            cidrBlock = linesSplit[index].trim();

            // Don't try to arse an empty line.
            if (cidrBlock.length == 0) { continue; }

            // Check regex
            if (!/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/(3[0-2]|[1-2][0-9]|[0-9]))$/.test(cidrBlock)) {
                return {errorMessage: `Doesn't appear to be valid CIDR: ${cidrBlock}`}
            }

            if (accountSpace.length == 0) {
                // 'accountSpace' must get filled first
                accountSpace = cidrBlock;
            } else {
                cidrBlocks.push(cidrBlock);
            }
        }

        return {accountSpace: accountSpace, cidrBlocks: cidrBlocks}
    }

    function doLowestBlocking(accountSpace, cidrBlocks) {

        // Objects to return
        var errorStruct = [];
        var cidrBlockingResults = [];


        // Calculate bounds on the account
        var accountSpaceStruct = {
            firstIP: ip.cidrSubnet(accountSpace).networkAddress,
            firstIP_long: ip.toLong(ip.cidrSubnet(accountSpace).networkAddress),
            lastIP: ip.cidrSubnet(accountSpace).broadcastAddress,
            lastIP_long: ip.toLong(ip.cidrSubnet(accountSpace).broadcastAddress)
        }


        // Sort the cidr blocks.
        cidrBlocks.sort(function (a, b) {
            return ip.toLong(ip.cidrSubnet(a).firstAddress) - ip.toLong(ip.cidrSubnet(b).firstAddress)
        });


        // Check that cidrBlocks are entirely within the account space
        var invalidCIDRBlocks = false; // assume false
        for (let cidrBlock of cidrBlocks) {
            cidrBlock_firstIP = ip.cidrSubnet(cidrBlock).networkAddress;
            cidrBlock_firstIPlong = ip.toLong(cidrBlock_firstIP);
            cidrBlock_lastIP = ip.cidrSubnet(cidrBlock).broadcastAddress;
            cidrBlock_lastIPlong = ip.toLong(cidrBlock_lastIP);

            if (cidrBlock_firstIPlong < accountSpaceStruct.firstIP_long) {
                errorStruct.push(`CIDR block (${cidrBlock} first ${cidrBlock_firstIP}) precedes the account space (${accountSpace} first ${accountSpaceStruct.firstIP})`);
                invalidCIDRBlocks = true;
            }
            if (cidrBlock_lastIPlong > accountSpaceStruct.lastIP_long) {
                errorStruct.push(`CIDR block (${cidrBlock} last ${cidrBlock_lastIP}) exceeds the account space (${accountSpace} last ${accountSpaceStruct.lastIP})`);
                invalidCIDRBlocks = true;
            }
        }
        // Check if any overlaping cidrBlocks.  Note the CIDR blocks have previously  been sorted.
        for (var i = 1; i < cidrBlocks.length; i++) {
            secondBlock_firstIP = ip.cidrSubnet(cidrBlocks[i]).networkAddress;
            secondBlock_firstIP_long = ip.toLong(secondBlock_firstIP);
            firstBlock_lastIP = ip.cidrSubnet(cidrBlocks[i - 1]).broadcastAddress;
            firstBlock_lastIP_long = ip.toLong(firstBlock_lastIP);
            if (secondBlock_firstIP_long <= firstBlock_lastIP_long) {
                errorStruct.push(`CIDR block (${cidrBlocks[i]} first ${secondBlock_firstIP}) overlaps with (${cidrBlocks[i - 1]} last ${firstBlock_lastIP})`);
                invalidCIDRBlocks = true;
            }
        }
        if (invalidCIDRBlocks) {
            return { errorStruct: errorStruct, cidrBlockingResults: cidrBlockingResults }
        }


        // Add the blocks (in order), these will become progressive targets for The Procedure.
        var orderOfIPTargets_long = [];
        for (let cidrBlock of cidrBlocks) {
            cidrBlock_FrontIP = ip.cidrSubnet(cidrBlock).networkAddress
            cidrBlock_FrontIP_long = ip.toLong(cidrBlock_FrontIP);
            // Check if the previously added block is adjacent,
            // Only add if there is no adjacency
            if (orderOfIPTargets_long.length > 0 &&
                orderOfIPTargets_long[orderOfIPTargets_long.length - 1] != (cidrBlock_FrontIP_long - 1)) {
                orderOfIPTargets_long.push(cidrBlock_FrontIP_long - 1);
                // Note, defines the boundary as the previous IP (<)
            }

            cidrBlock_BackIP = ip.cidrSubnet(cidrBlock).broadcastAddress
            cidrBlock_BackIP_long = ip.toLong(cidrBlock_BackIP);
            orderOfIPTargets_long.push(cidrBlock_BackIP_long);
            // Note, here the last IP is the boundary (>=)
        }
        // Add the last account IP
        orderOfIPTargets_long.push(accountSpaceStruct.lastIP_long);


        // The Procedure
        var currentIP = accountSpaceStruct.firstIP;
        var currentIP_long = ip.toLong(currentIP);
        var nextTargetLastIP_long = orderOfIPTargets_long.shift();
        var accountCovered = false;
        while (accountCovered == false) {
            for (let cider_mask of DECREASING_CIDR_MASKS) {
                // Construct the next block, with next lower cidr mask.
                block = currentIP + cider_mask;
                blockLastIP_long = ip.toLong(ip.cidrSubnet(block).broadcastAddress);
                blockFirstIP_long = ip.toLong(ip.cidrSubnet(block).networkAddress);

                if (blockFirstIP_long == currentIP_long &&
                    blockLastIP_long <= nextTargetLastIP_long) {

                    // Block is valid
                    currentIP_long = blockLastIP_long + 1;
                    currentIP = ip.fromLong(currentIP_long);
                    if (blockLastIP_long == nextTargetLastIP_long) {
                        // Shift to the next target IP
                        nextTargetLastIP_long = orderOfIPTargets_long.shift();
                    }
                    // otherwise will need to find at least another block to get to next target

                    // This block is good to add to final results
                    cidrBlockingResults.push(block);
                    break;
                }
            }

            // Check if the account is covered
            if (blockLastIP_long == accountSpaceStruct.lastIP_long) {
                // Complete.
                accountCovered = true;
            }
        }


        // The Procedure was successful.
        return { errorStruct: errorStruct, 
            cidrBlockingResults: cidrBlockingResults,
            accountCIDRBlock: accountSpace }
    }

    return {
        doLowestBlocking: doLowestBlocking,
        parseForBlocks : parseForBlocks
    }
}();

module.exports = exports = cidrIzer;
