DAY ?= 01

run:
	tsc
	node ./src/transpiled/day$(DAY).js

nd:
	node src/scripts/startNewDay.js $(DAY)

install:
	npm install
