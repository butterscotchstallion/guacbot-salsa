/**
 * API tests
 *
 */
"use strict";

var superagent = require('superagent');
var expect     = require('expect.js');
var fs         = require('fs');
var config     = JSON.parse(fs.readFileSync("../config/api.json", 'utf8'));
var BASE_URL   = config.baseURL;

describe('plugins api', function() {
    it('gets a plugin', function (done) {
        superagent.get(BASE_URL + 'plugins/8')
                  .end(function(e, res) {
                      expect(e).to.eql(null);
                      
                      var body = res.body;

                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.id).to.eql(8);
                      
                      done();
                  });
    });
    
    it('gets all plugins', function (done) {
        superagent.get(BASE_URL + 'plugins')
                  .end(function(e, res) {
                      expect(e).to.eql(null);
                      
                      var body = res.body;

                      expect(body).to.be.an('array');
                      expect(body).to.not.be.empty();
                      
                      done();
                  });
    });
    
    it('gets all messages for a plugin', function (done) {
        superagent.get(BASE_URL + 'plugins/8/messages')
                  .end(function(e, res) {
                      expect(e).to.eql(null);
                      
                      var body = res.body;

                      expect(body).to.be.an('array');
                      expect(body).to.not.be.empty();
                      
                      done();
                  });
    });
    
    it('gets a single plugin message', function (done) {
        superagent.get(BASE_URL + 'plugins/8/messages/6')
                  .end(function(e, res) {
                      expect(e).to.eql(null);
                      
                      var body = res.body;

                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.name).to.be.a('string');
                      expect(body.message).to.be.a('string');
                      expect(body.created_at).to.be.a('string');
                      expect(body.plugin).to.be.an('object');
                      
                      done();
                  });
    });
});










