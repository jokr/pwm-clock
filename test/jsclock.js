'use strict';

var events = require('events');

var counter = 0;
var last = Date.now();
var now;
var step = 10;

var check = function () {
	now = Date.now();
	if (now >= last + step) {
		tick();
	}
	setImmediate(check);
};

var tick = function () {
	counter += 1;
	last = now;
};

setImmediate(check);

function getTime () {
	return counter;
};

module.exports = getTime;
