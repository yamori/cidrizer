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
- figure out the error scenarios
- error detect when effective CIDR doesn't match a CIDR block
- returning+rendering errors
- better style for the rendered section, clean up the first page.
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
10.82.208.0/20
10.82.217.0/24
```

```
10.1.0.0/20
10.1.1.0/24
10.1.7.0/28
```