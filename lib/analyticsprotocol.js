'use strict';

const assert = require('assert');
const debug = require('debug')('google-analytics-measurement-protocol');
const request = require('request');

const debugUrl = 'https://ssl.google-analytics.com/debug/collect';
const endpointUrl = 'https://ssl.google-analytics.com/collect';
const version = '1';

var trackingId = null;

function tooLarge(str, limit) {
  return Buffer.byteLength(str, 'utf8') > limit;
}

function constructPayload(payload, opts) {
  let str = `v=${version}&tid=${opts.trackingId}&cid=${opts.clientId}&t=${opts.hitType}`;
  for(let key in payload) {
    if(payload[key]) str += `&${key}=${encodeURIComponent(payload[key])}`;
  }
  /* istanbul ignore next */
  if( tooLarge(str, 8000) ) throw new Error('Payload is too large.');
  return str;
}

function AnalyticsProtocol(opts) {
  debug(opts);
  this.trackingId = opts.trackingId;
  trackingId = this.trackingId;
  this.hitType = opts.hitType || null;
  this.clientId = opts.clientId || null;
  this.userAgent = opts.userAgent || null;
  this.debug = opts.debug || null;
  this.endpoint = this.debug ? debugUrl : endpointUrl;
  this.payload = {};
}

AnalyticsProtocol.prototype.setHitType = function(type) {
  this.hitType = type;
  return this;
}

AnalyticsProtocol.prototype.setClientId = function(id) {
  this.clientId = id;
  return this;
}

AnalyticsProtocol.prototype.setTrackingId = function(id) {
  this.trackingId = id;
  return this;
}

AnalyticsProtocol.prototype.setUserAgent = function(userAgent) {
  this.userAgent = userAgent;
  return this;
}

AnalyticsProtocol.prototype.setPayloadVal = function(key, val) {
  this.payload[key] = val;
  return this;
}

AnalyticsProtocol.prototype.end = function() {

  return new Promise((res, rej) => {

    try {
      assert(this.trackingId, 'Please set trackingId.');
      assert(this.clientId, 'Please set clientId.');
      assert(this.hitType, 'Please set hitType.');
    } catch(err) {
      debug(err);
      return rej(err);
    }

    let options = {
      url: this.endpoint,
      method: 'POST',
      headers: {
        'cache-control': 'no-cache',
        'accept': 'application/json',
        'content-type': 'text/plain'
      },
      body: constructPayload(this.payload, this)
    };

    if( this.userAgent ) {
      options.headers['user-agent'] = this.userAgent;
    }

    debug(`New Analytics Measurement for ${options.url}`);
    debug(options);

    request(options, (err, response, body) => {

      if(err || (response.statusCode > 300)) {
        debug(err || response.statusCode);
        return rej(err || response.statusCode);
      }

      if(!this.debug) return res();

      body = JSON.parse(body);
      debug(body);
      return res(body);

    });

  });
}

module.exports = AnalyticsProtocol;
