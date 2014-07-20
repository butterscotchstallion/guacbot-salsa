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

// HEY \u0002{{{nick}}}\u0002, {{{message}}} (\u0002{{{originNick}}}\u0002 {{timeAgo}})
describe('plugins api', function() {
    it('doesnt allow invalid plugin messages', function (done) {
        superagent.post(BASE_URL + 'plugins/8/messages')
                  .set('Content-Type', 'application/json')
                  .send({
                    invalid: "input"
                  })
                  .end(function(e, res) {
                      expect(e).to.eql(null);
                      
                      expect(res.status).to.eql(200);
                      expect(res.body.status).to.eql("ERROR");
                      
                      done();
                  });
    });
    
    it('creates a plugin message', function (done) {
        superagent.post(BASE_URL + 'plugins/8/messages')
                  .set('Content-Type', 'application/json')
                  .send({
                    message: "Hello world!",
                    name   : "saved"
                  })
                  .end(function(e, res) {
                      expect(e).to.eql(null);
                      
                      console.log(res.header);
                      
                      expect(res.status).to.eql(201);
                      
                      //expect(res.body.id).to.be.a(Number);
                      
                      done();
                  });
    });
    
    it('fails if you try to save a blank a plugin message', function (done) {
        superagent.put(BASE_URL + 'plugins/8/messages/14')
                  .set('Content-Type', 'application/json')
                  .send({
                    message: "",
                    name   : "delivered"                 
                  })
                  .end(function(e, res) {
                      expect(e).to.eql(null);
                      
                      expect(res.status).to.eql(200);
                      expect(res.body.status).to.eql("ERROR");
                      
                      done();
                  });
    });
    
    it('saves a plugin message', function (done) {
        superagent.put(BASE_URL + 'plugins/8/messages/14')
                  .set('Content-Type', 'application/json')
                  .send({
                    message  : "sup",
                    name     : "delivered"
                  })
                  .end(function(e, res) {
                      expect(e).to.eql(null);
                      
                      expect(res.status).to.eql(201);
                      
                      done();
                  });
    });
    
    it('gets a plugin', function (done) {
        superagent.get(BASE_URL + 'plugins/8')
                  .end(function(e, res) {
                      expect(res.status).to.eql(200);
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
                      expect(res.status).to.eql(200);
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
                      expect(res.status).to.eql(200);
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
                      expect(res.status).to.eql(200);
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










