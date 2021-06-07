# CIDRizer

It's hard to manage CIDR space in a big team.

Here's a light web-app to help organize.

## Commands

`npm test`

- (see file `test/test_theProcedure.js` which has good test coverage of what the calculations actually do)

`npm start`

- please note that the above invokes `index.js`
- if deployed via `serverless.yml`, there exists a nearly equivelant `serverless_for_lambda.js` which instead exports via the `serverless-http` module

## Test scenarios

### Valid test

```
10.10.10.0/24   # Client 3
10.10.10.32/29  # bastion(s)
10.10.10.128/29 # content srvs
```

yields

```
CIDR,2^(32-n),Avail.,First,Last
10.10.10.0/27,32,30,10.10.10.0,10.10.10.31,
10.10.10.32/29,8,6,10.10.10.32,10.10.10.39,
10.10.10.40/29,8,6,10.10.10.40,10.10.10.47,
10.10.10.48/28,16,14,10.10.10.48,10.10.10.63,
10.10.10.64/26,64,62,10.10.10.64,10.10.10.127,
10.10.10.128/29,8,6,10.10.10.128,10.10.10.135,
10.10.10.136/29,8,6,10.10.10.136,10.10.10.143,
10.10.10.144/28,16,14,10.10.10.144,10.10.10.159,
10.10.10.160/27,32,30,10.10.10.160,10.10.10.191,
10.10.10.192/26,64,62,10.10.10.192,10.10.10.255,
```

### Thorough and Valid Test

```
10.82.208.0/20

10.82.218.128/27
10.82.217.0/24
10.82.222.0/29
10.82.221.0/29
```

yeilds ... a lot.  You'll just have to try it out.


### Negative Test

Lots of overlapping and range violations...

```
10.82.208.0/20

10.82.217.128/27
10.82.217.0/24
10.1.244.0/29
10.253.244.0/29
```

yields

```
10.1.244.0/29 (first ip 10.1.244.0) precedes the account space 10.82.208.0/20 (first ip 10.82.208.0)

10.253.244.0/29 (last ip 10.253.244.7) exceeds the account space 10.82.208.0/20 (last ip 10.82.223.255)

10.82.217.128/27 (first 10.82.217.128) overlaps with 10.82.217.0/24 (last 10.82.217.255)
```

## Invoke with a Curl

`curl -XPOST -H "Content-type: application/json" -d '{ "userInput": "10.0.0.0/18 \n 10.0.0.0/22" }' 'http://localhost:80/do_cidr/'`
