var ip = require('ip');

// Create CIDR masks
var DECREASING_CIDR_MASKS = [];
for (var i = 1; i <= 32; i++) {
   DECREASING_CIDR_MASKS.push(`/${i}`);
}

var accountspace = '10.82.208.0/20';
var accountSpaceStruct = { 
	firstIP: ip.cidrSubnet(accountspace).networkAddress,
	firstIP_long: ip.toLong( ip.cidrSubnet(accountspace).networkAddress ),
	lastIP: ip.cidrSubnet(accountspace).broadcastAddress,
	lastIP_long: ip.toLong( ip.cidrSubnet(accountspace).broadcastAddress )
}

console.log(accountSpaceStruct);

// Bad cidrBlocks, precede and exceeding.  Overlapping
// var cidrBlocks = [ '10.82.217.128/27', '10.82.217.0/24', '10.1.244.0/29', '10.253.244.0/29' ];
// Valid cideBlocks, non-adjaecnt
// var cidrBlocks = [ '10.82.217.128/27', '10.82.219.0/24' ];
// Valid cideBlocks, with some adjacent
var cidrBlocks = [ '10.82.217.128/27', '10.82.218.0/27', '10.82.218.32/27' ];

// Sort the cidr blocks.
cidrBlocks.sort(function(a, b){
	return ip.toLong(ip.cidrSubnet(a).firstAddress) - ip.toLong(ip.cidrSubnet(b).firstAddress)
});

// Check that cidrBlocks are entirely within the account space
var invalidCIDRBlocks = false; // assume false
for (let cidrBlock of cidrBlocks) {
	cidrBlock_firstIP		= ip.cidrSubnet(cidrBlock).networkAddress;
	cidrBlock_firstIPlong 	= ip.toLong( cidrBlock_firstIP );
	cidrBlock_lastIP		= ip.cidrSubnet(cidrBlock).broadcastAddress;
	cidrBlock_lastIPlong 	= ip.toLong( cidrBlock_lastIP );

	if (cidrBlock_firstIPlong < accountSpaceStruct.firstIP_long) {
		console.log(`CIDR block (${cidrBlock} first ${cidrBlock_firstIP}) precedes the account space (${accountspace} first ${accountSpaceStruct.firstIP})`);
		invalidCIDRBlocks = true;
	}
	if (cidrBlock_lastIPlong > accountSpaceStruct.lastIP_long) {
		console.log(`CIDR block (${cidrBlock} last ${cidrBlock_lastIP}) exceeds the account space (${accountspace} last ${accountSpaceStruct.lastIP})`);
		invalidCIDRBlocks = true;
	}
}
// Check if any overlaping cidrBlocks.  Note the CIDR blocks have previously  been sorted.
for (var i = 1; i < cidrBlocks.length; i++) {
	secondBlock_firstIP 		= ip.cidrSubnet(cidrBlocks[i]).networkAddress;
	secondBlock_firstIP_long 	= ip.toLong( secondBlock_firstIP );
	firstBlock_lastIP			= ip.cidrSubnet(cidrBlocks[i-1]).broadcastAddress;
	firstBlock_lastIP_long		= ip.toLong( firstBlock_lastIP );
	if (secondBlock_firstIP_long <= firstBlock_lastIP_long) {
		console.log(`CIDR block (${cidrBlocks[i]} first ${secondBlock_firstIP}) overlaps with (${cidrBlocks[i-1]} last ${firstBlock_lastIP})`);
		invalidCIDRBlocks = true;
	}
}
if (invalidCIDRBlocks) { return; }

// Add the blocks in order here.
var orderOfIPTargets_long = [];
for (let cidrBlock of cidrBlocks) {
	cidrBlock_FrontIP 		= ip.cidrSubnet(cidrBlock).networkAddress
	cidrBlock_FrontIP_long 	= ip.toLong( cidrBlock_FrontIP );
	// Check if the previously added block is adjacent, 
	// Only add if there is no adjacency
	if (orderOfIPTargets_long.length > 0 && 
		orderOfIPTargets_long[orderOfIPTargets_long.length-1] != (cidrBlock_FrontIP_long-1)) {
		orderOfIPTargets_long.push(cidrBlock_FrontIP_long-1);
		// Note, defines the boundary as the previous IP (<)
	}
	
	cidrBlock_BackIP 		= ip.cidrSubnet(cidrBlock).broadcastAddress
	cidrBlock_BackIP_long 	= ip.toLong( cidrBlock_BackIP );
	orderOfIPTargets_long.push(cidrBlock_BackIP_long);
	// Note, here the last IP is the boundary (>=)
}
// Add the last account IP
orderOfIPTargets_long.push(accountSpaceStruct.lastIP_long);
console.log(orderOfIPTargets_long);
//return;

// The algorithm
var currentIP = accountSpaceStruct.firstIP;
var currentIP_long = ip.toLong( currentIP );
var nextTargetLastIP_long = orderOfIPTargets_long.shift();
var accountCovered = false;
while (accountCovered == false) {
	//console.log('while');
	
	for (let cider_mask of DECREASING_CIDR_MASKS) {
		block = currentIP + cider_mask;
		//block.includes('128') ? console.log(` ${block}  ${ip.cidrSubnet(block).networkAddress} ${ip.cidrSubnet(block).broadcastAddress} ${ip.fromLong(nextTargetLastIP_long)}`) : n=1;
		blockLastIP_long = ip.toLong( ip.cidrSubnet(block).broadcastAddress );
		blockFirstIP_long = ip.toLong( ip.cidrSubnet(block).networkAddress );
		
		//block.includes('128') ? console.log(`  ${blockFirstIP_long == currentIP_long}  ${blockLastIP_long <= nextTargetLastIP_long}`) : n=2
		
		if ( blockFirstIP_long == currentIP_long &&
			blockLastIP_long <= nextTargetLastIP_long ) { 
			
			// Moving on....
			currentIP_long = blockLastIP_long + 1;
			currentIP = ip.fromLong(currentIP_long);
			//nextTargetLastIP_long = orderOfIPTargets_long.shift();
			
			if (blockLastIP_long == nextTargetLastIP_long) {
				// Shift to the next target IP
				nextTargetLastIP_long = orderOfIPTargets_long.shift();
			}
			
			// This block is good to add.
			console.log(':: ' + block);
			//console.log(`${currentIP}  ${ip.fromLong(nextTargetLastIP_long)}`);
			break;
		}
		
	}
	
	// Check if the account is covered
	if (blockLastIP_long == accountSpaceStruct.lastIP_long) {
		// Complete.
		accountCovered = true;
	}
}


//Backlog:
//  x basic algorithm to cover the account.
//  x cidrBlock checks (2), plus error messages.
//  x sort the cirdblocks.
//  x algorithm to accomodate one cidr block.
//  x algorithm development to accomodate two cidrBlocks.
//		will need to innovate the adjacent cidr blcok spaces, see the TODO.
//  unit test framework
		// cidr block precedes
		// cidr block excedes
		// cide block precedes and excedes.