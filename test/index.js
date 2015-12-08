'use strict';

const analytics = require('..');
const nock = require('nock');
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.23 Safari/537.36';

describe('google analytics measurement protocol test suite', function() {
  describe('main features (requires internet connection)', function() {

    it('should not error with object options set', function(done) {
      this.timeout(1000);
      analytics({
        trackingId: 'UA-12345-5',
        clientId: '555',
        debug: true
      })
      .setHitType('pageview')
      .setPayloadVal('dp', '/home')
      .end()
      .then(res => {
        if( !res.hitParsingResult[0].valid ) return done(res);
        return done();
      })
      .catch(err => {
        done(err);
      });
    });

    it('should not error with function options set', function(done) {
      this.timeout(1000);
      analytics({
        debug: true
      })
      .setTrackingId('UA-12345-5')
      .setClientId('555')
      .setHitType('pageview')
      .setPayloadVal('dp', '/home')
      .end()
      .then(res => {
        if( !res.hitParsingResult[0].valid ) return done(res);
        return done();
      })
      .catch(err => {
        done(err);
      });
    });

    it('should error if tracking id is not set', function(done) {
      analytics({
        clientId: '555'
      })
      .end().then(res => {
        done(res);
      })
      .catch(err => {
        done();
      });
    });

    it('should error if client id is not set', function(done) {
      analytics({
        trackingId: 'UA-12345-5'
      })
      .end().then(res => {
        done(res);
      })
      .catch(err => {
        done();
      });
    });

    it('should error if hit type is not set', function(done) {
      analytics({
        trackingId: 'UA-12345-5',
        clientId: '555'
      })
      .end().then(res => {
        done(res);
      })
      .catch(err => {
        done();
      });
    });

    it('should not error if not using debug', function(done) {

      this.timeout(1000);

      analytics()
      .setTrackingId('UA-71177445-1')
      .setClientId('555')
      .setHitType('pageview')
      .setPayloadVal('dp', '/testrunner')
      .end()
      .then(res => {
        return done();
      })
      .catch(err => {
        done(err);
      });

    });

    it('should ignore null payload values', function(done) {

      this.timeout(1000);

      analytics({
        trackingId: 'UA-12345-5',
        clientId: '555',
        debug: true
      })
      .setHitType('pageview')
      .setPayloadVal('dp', '/testrunner/nullcheck')
      .setPayloadVal('dh', null)
      .end()
      .then(res => {
        if( !res.hitParsingResult[0].valid ) return done(res);
        return done();
      })
      .catch(err => {
        done(err);
      });

    });

    it('should not error with user agent', function(done) {

      this.timeout(1000);

      analytics({
        trackingId: 'UA-12345-5',
        clientId: '555',
        debug: true
      })
      .setUserAgent(userAgent)
      .setHitType('pageview')
      .setPayloadVal('dp', '/testrunner/nullcheck')
      .end()
      .then(res => {
        if( !res.hitParsingResult[0].valid ) return done(res);
        return done();
      })
      .catch(err => {
        done(err);
      });

    });

    it('should error if error response from api', function(done) {

      this.timeout(1000);

      let mock = nock('https://ssl.google-analytics.com')
      .post('/debug/collect')
      .reply(501);

      analytics({
        trackingId: 'UA-12345-5',
        clientId: '555',
        debug: true
      })
      .setHitType('pageview')
      .setPayloadVal('dp', '/testrunner/nullcheck')
      .end()
      .then(res => {
        return done(res);
      })
      .catch(err => {
        done();
      });

    });

  });
});
