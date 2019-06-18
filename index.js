var ip = require('ip');


// Create CIDR masks
var DECREASING_CIDR_MASKS = [];
for (var i = 1; i <= 32; i++) {
   DECREASING_CIDR_MASKS.push(`/${i}`);
}
console.log(DECREASING_CIDR_MASKS);

// console.log(ip.toLong('127.0.0.1'));
// console.log(ip.toLong('127.0.0.2'));
// console.log(ip.toLong('255.255.255.255'));

// console.log(ip.cidrSubnet('192.168.1.0/30'));


console.log(ip.cidrSubnet('10.82.217.0/23'));


// An array of cidr blocks.
var accountspace = '10.82.208.0/20';
var cidrBlocks = [ '10.82.217.128/27', '10.82.214.192/26', '10.82.217.160/27', '10.82.209.0/26', '10.82.214.128/26' ];
cidrBlocks.push('255.255.255.255/1'); // Always add the max CIDR to help with the algorithm
for (var i = 0; i < cidrBlocks.length; i++) {
    console.log(cidrBlocks[i]);
}
// Sort the cidr blocks.
cidrBlocks.sort(function(a, b){
	return ip.toLong(ip.cidrSubnet(a).firstAddress) - ip.toLong(ip.cidrSubnet(b).firstAddress)
});
console.log(cidrBlocks);
// overarching account space (account or VPC), and iterate over the space for complete coverage.
//pseudo code.

var currentIP = ip.cidrSubnet(accountspace).networkAddress; // First address.
var lastIP		= ip.cidrSubnet(accountspace).broadcastAddress; // First address.
console.log('first: ' + currentIP);
console.log('last: ' + lastIP);
var currentBlock = cidrBlocks.shift(); // Pop the stack.
var currentIPTarget = ip.cidrSubnet(currentBlock).networkAddress;
console.log('currentBlock: ' + currentBlock);
console.log('currentTgt: ' + currentIPTarget);

while (currentIP <= lastIP) {
	if ( ip.toLong(currentIP) == ip.toLong(currentIPTarget) ) {
		console.log('#---' + currentBlock);
		currentBlock = cidrBlocks.shift(); // Pop the stack.
		currentIPTarget = ip.cidrSubnet(currentBlock).networkAddress;
		console.log('...continued');
		continue;
	}
	
	for (let cider_mask of DECREASING_CIDR_MASKS) {
		//console.log('mask: ' + cider_mask);
		block = currentIP + cider_mask;
		block_lastIP = ip.cidrSubnet(block).broadcastAddress;
		console.log(' block_lastIP: ' + block_lastIP + ' ' + ip.toLong(block_lastIP));
		console.log(' lastIP: ' + lastIP + ' ' + ip.toLong(lastIP));
		if ( ip.toLong(currentIPTarget)> ip.toLong(lastIP) && ip.toLong(block_lastIP) < ip.toLong(lastIP) ) { // Meets the end of the accountspace
			console.log('~---' + block);
			currentIP = ip.fromLong(ip.toLong(block_lastIP)+1);
			break;
		} else if ( ip.toLong(block_lastIP) < ip.toLong(currentIPTarget) ) { 
			console.log(' currentIPTarget: ' + currentIPTarget);
			console.log('----' + block);
			currentIP = ip.fromLong(ip.toLong(block_lastIP)+1);
			console.log(' currentIP: ' + currentIP);
			break;
		}
	}
}
//currentIP = accountspace.firstIP
//nextMilestoneIP = cidrBlocks[0].firstIP-1
//while currentIP <= accountspace.lastIP
//	try to cover with masks descending, until it's below nextMilestoneIP
// continue the scheme until reaching the end of the accountspace.lastIP

// visual output