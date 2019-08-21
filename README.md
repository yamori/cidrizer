# CIDRizer

It's hard to mange CIDR space in a big team.
A quick web-app to help accelerate.

## Commands

`npm test`

`npm start`

## Backlog

- x first nodejs page
- x first form
- x submission of form content
- x parsing,
- x remove trailing line, empty line
- x then executing the module
- x design how info should be presented
- x partials for ajax response, static content
- x fixing the results object (from the proc) for account level only
- x rendering the account level only
- x rendering account plus blocks via the partial
- x placeholder for the text input
- x 'insert examples' button, with multiple spacing.
- x figure out the error scenarios
    x re-fix the package.json hack
    x remove the console.logs
- x split into two text input fields, placeholder make it more sensical
- x error detect when effective CIDR doesn't match a CIDR block, unit test
    x creates a custom error message
- x returning+rendering errors
- better style for the rendered section, clean up the page for when it first appears.
    x remove the 'clear' button
    x help section, and examples, better to hide it so it won't delete someone's work
    x 2^32-n and Available hosts (with hover)
- x convert to lambda
- x correct the UX and verbiage
- x spinner
- x deploy
- x Put CloudFront in front, to rediret http to https for the GET.
  https://stackoverflow.com/questions/47311081/redirect-http-requests-to-https-on-aws-api-gateway-using-custom-domains
- When url doesn't have the trailing '/', we get 'something went wrong'
- better explanation of what the site does, in the results or above.
- put the sorted blocks back into the 2nd field
- one entry, for both the serverless and local dev
- adsense campaign, then google analytics?
- warning if the sub-mask is below AWS. minimum, this is a 'caution' bootstrap color
- error case, empty fields but submitted
- highlight the provided blocks, distinguish from the filler blocks
- Better Readme
- bring in jquery + bootstrap as assets.

### How each line should appear:

(overall block above)

`cidr block, # of IPs, first, last`
(highilght the ones specified)

## Demo input text

```
10.82.208.0/20
10.82.217.128/27
10.82.219.0/24
```

## Error scenarios

```
(none currently)
```

## Test scenarios

Lots of overlapping and range violations...

```
10.82.208.0/20

10.82.217.128/27
10.82.217.0/24
10.1.244.0/29
10.253.244.0/29
```

Good test...

```
10.82.208.0/20

10.82.218.128/27
10.82.217.0/24
10.82.222.0/29
10.82.221.0/29
```
