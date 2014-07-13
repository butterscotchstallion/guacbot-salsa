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

describe('api', function() {
    it('gets a single plugin message', function (done) {
        superagent.get(BASE_URL + 'plugin-messages/6')
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
    
    it('gets all the plugin messages', function (done) {
        superagent.get(BASE_URL + 'plugin-messages')
                  .end(function(e, res) {
                      expect(e).to.eql(null);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('array');
                      
                      done();
                  });
    });
});