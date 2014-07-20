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
    it('fails to create an invalid plugin', function (done) {
        superagent.post(BASE_URL + 'plugins')                  
                  .send({
                    invalid: "input"
                  })
                  .end(function(e, res) {
                      expect(e).to.eql(null);                      
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;

                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("ERROR");
                      
                      done();
                  });
    });
    
    it('creates a plugin', function (done) {
        superagent.post(BASE_URL + 'plugins')                  
                  .send({
                    name    : "test plugin",
                    filename: "test-plugin"
                  })
                  .end(function(e, res) {
                      expect(e).to.eql(null);                      
                      expect(res.status).to.eql(201);
                      
                      var body = res.body;

                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      expect(body.id).to.be.ok();
                      
                      done();
                  });
    });
    
    it('gets a specific plugin', function (done) {
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
});

describe('plugin messages api', function() {
    it('gets all messages for a plugin', function (done) {
        superagent.get(BASE_URL + 'plugins/8/messages')
                  .end(function(e, res) {
                      expect(e).to.eql(null);                      
                      expect(res.status).to.eql(200);
                      
                      var body = res.body; 
                      
                      expect(body.status).to.eql("OK");
                      expect(body.message).to.eql(null);
                      expect(body.messages).to.be.an('array');
                      expect(body.messages).to.not.be.empty();
                      
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
                      expect(body.status).to.eql("OK");
                      expect(body.message).to.eql(null);
                      expect(body.pluginMessage.name).to.be.ok();
                      expect(body.pluginMessage.message).to.be.ok();
                      expect(body.pluginMessage.created_at).to.be.ok();
                      expect(body.pluginMessage.plugin).to.be.an('object');
                      expect(body.pluginMessage.plugin.id).to.be.ok();
                      expect(body.pluginMessage.id).to.be.ok();
                      
                      done();
                  });
    });

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
                      
                      expect(res.status).to.eql(201);
                      expect(res.header.location).to.not.be.empty();
                      expect(res.body.id).to.be.ok();
                      
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
    
    it('updates a plugin message', function (done) {
        superagent.put(BASE_URL + 'plugins/8/messages/14')
                  .set('Content-Type', 'application/json')
                  .send({
                    message  : "sup",
                    name     : "delivered"
                  })
                  .end(function(e, res) {
                      expect(e).to.eql(null);
                      
                      expect(res.status).to.eql(200);
                      expect(res.header.location).to.not.be.empty();
                      expect(res.body.status).to.eql("OK");
                      
                      done();
                  });
    });
    
    it('deletes a plugin message', function (done) {
        superagent.del(BASE_URL + 'plugins/8/messages/168')
                  .end(function(e, res) {
                      expect(e).to.eql(null);
                      
                      expect(res.status).to.eql(200);
                      expect(res.body.status).to.eql("OK");
                      
                      done();
                  });
    });
    
    it('fails to delete a non-existent plugin message', function (done) {
        superagent.del(BASE_URL + 'plugins/8/messages/lol')
                  .end(function(e, res) {
                      expect(e).to.eql(null);
                      
                      expect(res.status).to.eql(200);
                      expect(res.body.status).to.eql("ERROR");
                      
                      done();
                  });
    });
});








