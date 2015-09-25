var sprintf = require('sprintf-js').sprintf;
var cclock = require('./build/Release/clock');
var jsclock = require('./jsclock');

var verbose = false;

console.log('Start tests...');
runTest(cclock.getTime, 1000);
runTest(jsclock, 1000);

function runTest(func, runs) {
  var results = {};
  var tests = 0;
  var past = Date.now();
  var last = func();

  var interval = setInterval(function() {
    var now = Date.now();
    var current = func();
    var elapsed = now - past;
    var measured = current - last;

    results[tests++] = {
      elapsed: elapsed,
      measured: measured,
      difference: elapsed - measured
    };

    if (tests === runs) {
      clearInterval(interval);
      printResults(results);
    } else {
      past = now;
      last = current;
    }
  }, 10);
}

function printResults(results) {
  var sumDifference = 0;
  Object.keys(results).forEach(function(key) {
    sumDifference += results[key].difference;
    if (verbose) {
      console.log(sprintf(
        "Test %3u Elapsed: %3u ms, Measured: %3u ms, Difference: %3d ms",
        key,
        results[key].elapsed,
        results[key].measured,
        results[key].difference
      ));
    }
  });
  console.log(sprintf(
    "%3u total, average difference of %3f",
    Object.keys(results).length,
    sumDifference / Object.keys(results).length
  ));
}
