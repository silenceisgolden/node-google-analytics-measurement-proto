'use strict';

const AnalyticsProtocol = require('./lib/analyticsprotocol.js');

function init(opts) {
  opts = opts || {};
  return new AnalyticsProtocol(opts);
}

module.exports = init;
