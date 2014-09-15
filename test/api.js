/**
 * API tests
 *
 */
"use strict";

var superagent = require('superagent');
var expect      = require('expect.js');
var fs          = require('fs');
var config      = JSON.parse(fs.readFileSync("../config/api.json", 'utf8'));
var BASE_URL    = config.baseURL;
var qs          = require('querystring');
var _           = require('underscore');

describe('account avatars', function() {
    var account;
    var avatar;
    
    it('get session', function (done) {
        superagent.post(BASE_URL + "session")
                  .send({
                    name    : config.accountName,
                    password: config.accountPassword
                  })
                  .end(function(e, res) {
                    expect(e).to.eql(null);

                    expect(res.status).to.eql(201);
                    
                    var body = res.body;
                    
                    expect(body).to.be.an('object');
                    expect(body).to.not.be.empty();
                    expect(body.status).to.eql("OK");
                    
                    expect(body.account).to.be.an('object');
                    expect(body.account.password).to.eql(null);
                    
                    expect(body.session.expires_at).to.be.ok();
                    expect(body.session.token).to.be.ok();
                    expect(body.session.origin_ip_address).to.be.ok();
                    
                    account         = body.account;
                    account.token   = body.session.token;
                    account.expires = body.session.expires_at;
                    
                    done();
                  });    
    });
    
    it('create', function (done) {
        var filename = "kawaii-armor.jpg";
        var path     = "./fixture/" + filename;
        
        superagent.post(BASE_URL + "accounts/avatar")                  
                  .set('x-access-token', account.token)
                  .attach('avatar', path, filename)
                  .field('avatar', filename)
                  .end(function(e, res) {
                    expect(e).to.eql(null);

                    console.log(res.body);
                    
                    expect(res.status).to.eql(201);
                    
                    var body = res.body;
                    
                    expect(body).to.be.an('object');
                    expect(body).to.not.be.empty();
                    expect(body.status).to.eql("OK");
                    
                    expect(body.avatar).to.be.an('object');
                    
                    avatar = body.avatar;
                    
                    done();
                  });    
    });
    
    it('ensures the image was uploaded', function (done) {
        superagent.get(avatar.url)
                  .end(function(e, res) {
                    expect(e).to.eql(null);
                    
                    expect(res.status).to.eql(200);
                    
                    done();
                  });
    });
    
    it('ensures the thumbnail was uploaded', function (done) {
        superagent.get(avatar.thumbnailUrl)
                  .end(function(e, res) {
                    expect(e).to.eql(null);
                    
                    expect(res.status).to.eql(200);
                    
                    done();
                  });
    });
});

describe('sessionz', function() {
    var account;

    it('create', function (done) {
        superagent.post(BASE_URL + "session")
                  .send({
                    name    : config.accountName,
                    password: config.accountPassword
                  })
                  .set('user-agent', 'young sharktank')
                  .end(function(e, res) {
                    expect(e).to.eql(null);

                    console.log(res.body);
                    
                    expect(res.status).to.eql(201);
                    
                    var body = res.body;
                    
                    expect(body).to.be.an('object');
                    expect(body).to.not.be.empty();
                    expect(body.status).to.eql("OK");
                    
                    expect(body.account).to.be.an('object');
                    expect(body.account.password).to.eql(null);
                    
                    expect(body.session.expires_at).to.be.ok();
                    expect(body.session.token).to.be.ok();
                    expect(body.session.origin_ip_address).to.be.ok();
                    expect(body.session).to.have.property('user_agent');
                    
                    account         = body.account;
                    account.token   = body.session.token;
                    account.expires = body.session.expires_at;
                    
                    done();
                  });    
    });
    
    it('serves a 404 for non-existent sessions', function (done) {
        superagent.del(BASE_URL + 'session')
                  .set('x-access-token', "lol")
                  .end(function(e, res) {
                      expect(e).to.eql(null);  
                      expect(res.status).to.eql(404);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("ERROR");
                      
                      done();
                  });
    });
    
    it('reads a valid session', function (done) {
        var earl = BASE_URL + "session";
        
        superagent.get(earl)
                  .set('x-access-token', account.token)
                  .end(function(e, res) {
                    expect(e).to.eql(null);

                    expect(res.status).to.eql(200);
                    
                    var body = res.body;
                    
                    expect(body).to.be.an('object');
                    expect(body).to.not.be.empty();
                    expect(body.status).to.eql("OK");
                    expect(body.session).to.be.an('object');
                    expect(body.session.token).to.be.ok();
                    expect(body.session.expires_at).to.be.ok();
                    expect(body.session.created_at).to.be.ok();
                    expect(body.session.updated_at).to.be.ok();
                    expect(body.session.origin_ip_address).to.be.ok();
                    
                    expect(body.session.account).to.be.ok();
                    expect(body.session.account.id).to.be.ok();
                    expect(body.session.account).to.have.property('active');
                    expect(body.session.account.name).to.be.ok();
                    expect(body.session.account.created_at).to.be.ok();
                    expect(body.session.account.updated_at).to.be.ok();
                    expect(body.session.account).to.not.have.property('password');
                    
                    done();
                  });
    });
    
    it('updates a session', function (done) {
        superagent.put(BASE_URL + 'session')
                  .set('x-access-token', account.token)
                  .send({
                    active: 0
                  })
                  .end(function(e, res) {
                      expect(e).to.eql(null);           
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      
                      done();
                  });
    });
    
    it('serves a 404 when a session is marked inactive', function (done) {
        superagent.get(BASE_URL + 'session')
                  .set('x-access-token', account.token)
                  .end(function(e, res) {
                      expect(e).to.eql(null);  
                      expect(res.status).to.eql(404);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("ERROR");
                      
                      done();
                  });
    });
    
    it('deletes', function (done) {
        superagent.del(BASE_URL + 'session/')
                  .set('x-access-token', account.token)
                  .end(function(e, res) {
                      expect(e).to.eql(null);  
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      
                      done();
                  });
    });
    
    it('ensures the session is really deleted', function (done) {
        superagent.del(BASE_URL + 'session')
                  .set('x-access-token', account.token)
                  .end(function(e, res) {
                      expect(e).to.eql(null);  
                      expect(res.status).to.eql(404);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("ERROR");
                      
                      done();
                  });
    });
});

describe('access token storage', function() {
    var account;
    
    it('logs in and gets an access token', function (done) {
        superagent.post(BASE_URL + "session")
                  .send({
                    name    : config.accountName,
                    password: config.accountPassword
                  })
                  .end(function(e, res) {
                    expect(e).to.eql(null);

                    expect(res.status).to.eql(201);
                    
                    var body = res.body;
                    
                    expect(body).to.be.an('object');
                    expect(body).to.not.be.empty();
                    expect(body.status).to.eql("OK");
                    
                    expect(body.account).to.be.an('object');
                    expect(body.account.password).to.eql(null);
                    
                    expect(body.session.expires_at).to.be.ok();
                    expect(body.session.token).to.be.ok();
                    expect(body.session.origin_ip_address).to.be.ok();
                    
                    account         = body.account;
                    account.token   = body.session.token;
                    
                    done();
                  });    
    });
    
    it('fetches an account', function (done) {
        var earl = BASE_URL + "accounts/" + account.id;
        
        superagent.get(earl)
                  .set('x-access-token', account.token)
                  .end(function(e, res) {
                    expect(e).to.eql(null);

                    expect(res.status).to.eql(200);
                    
                    var body = res.body;
                    
                    expect(body).to.be.an('object');
                    expect(body).to.not.be.empty();
                    expect(body.status).to.eql("OK");
                    expect(body.account).to.be.an('object');
                    expect(body.account.password).to.eql(null);
                    expect(body.account.tokens).to.be.an('object');
                    
                    done();
                  });
    });
});

describe('access control', function() {
    var account = {};

    it('fails to access a restricted resource without an access token', function (done) {
        superagent.post(BASE_URL + "accounts")
                  .end(function(e, res) {
                    expect(e).to.eql(null);
                    
                    //console.log(res.body);
                    
                    expect(res.status).to.eql(400);
                    
                    var body = res.body;
                    
                    expect(body).to.be.an('object');
                    expect(body).to.not.be.empty();
                    expect(body.status).to.eql("ERROR");
                    
                    done();
                  });    
    });
    
    it('fails to access a restricted resource with an invalid access token', function (done) {
        superagent.post(BASE_URL + "accounts")
                  .set('x-access-token', 'lol')
                  .end(function(e, res) {
                    expect(e).to.eql(null);
                    
                    //console.log(res.body);
                    
                    expect(res.status).to.eql(400);
                    
                    var body = res.body;
                    
                    expect(body).to.be.an('object');
                    expect(body).to.not.be.empty();
                    expect(body.status).to.eql("ERROR");
                    
                    done();
                  });    
    });
    
    it('logs in and gets an access token', function (done) {
        superagent.post(BASE_URL + "session")
                  .send({
                    name    : config.accountName,
                    password: config.accountPassword
                  })
                  .end(function(e, res) {
                    expect(e).to.eql(null);

                    expect(res.status).to.eql(201);
                    
                    var body = res.body;
                    
                    expect(body).to.be.an('object');
                    expect(body).to.not.be.empty();
                    expect(body.status).to.eql("OK");
                    
                    expect(body.account).to.be.an('object');
                    expect(body.account.password).to.eql(null);
                    
                    expect(body.session.expires_at).to.be.ok();
                    expect(body.session.token).to.be.ok();
                    expect(body.session.origin_ip_address).to.be.ok();
                    
                    account         = body.account;
                    account.token   = body.session.token;
                    
                    done();
                  });    
    });
    
    it('accesses a restricted resource with an access token', function (done) {
        superagent.get(BASE_URL + "accounts/" + account.id)
                  .set('x-access-token', account.token)
                  .end(function(e, res) {
                    expect(e).to.eql(null);
                    
                    //console.log(res.body);
                    
                    expect(res.status).to.eql(200);
                    
                    var body = res.body;
                    
                    expect(body).to.be.an('object');
                    expect(body).to.not.be.empty();
                    expect(body.status).to.eql("OK");
                    expect(body.account).to.be.an('object');
                    expect(body.account.password).to.eql(null);
                    
                    done();
                  });    
    });
});

describe('accountz', function() {
    var account = {};

    it('logs in and gets an access token', function (done) {
        superagent.post(BASE_URL + "session")
                  .send({
                    name    : config.accountName,
                    password: config.accountPassword
                  })
                  .end(function(e, res) {
                    expect(e).to.eql(null);

                    expect(res.status).to.eql(201);
                    
                    var body = res.body;
                    
                    expect(body).to.be.an('object');
                    expect(body).to.not.be.empty();
                    expect(body.status).to.eql("OK");
                    
                    expect(body.account).to.be.an('object');
                    expect(body.account.password).to.eql(null);
                    
                    expect(body.session.expires_at).to.be.ok();
                    expect(body.session.token).to.be.ok();
                    expect(body.session.origin_ip_address).to.be.ok();
                    
                    account.token   = body.session.token;
                    
                    done();
                  });    
    });
    
    it('fails to creates an account with bogus info', function (done) {
        var earl = BASE_URL + "accounts";
        
        superagent.post(earl)
                  .set('x-access-token', account.token)
                  .send({
                    "hello": "world"
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
    
    it('creates an account', function (done) {
        var earl = BASE_URL + "accounts";
        
        superagent.post(earl)
                  .set('x-access-token', account.token)
                  .send({
                    name   : ~~(Math.random() * 31337),
                    email  : config.testingEmail,
                    testing: true
                  })
                  .end(function(e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(201);
                    
                    var body = res.body;
                    
                    expect(body).to.be.an('object');
                    expect(body).to.not.be.empty();
                    expect(body.status).to.eql("OK");
                    expect(body.account).to.be.an('object');
                    expect(body.account.guid).to.be.ok();
                    expect(body.account.activation_code).to.be.ok();
                    
                    account = _.extend(account, body.account);
                    
                    console.log(account);
                    
                    done();
                  });
    });
    
    it('activates an account', function (done) {
        var earl = BASE_URL + "accounts/activate";
        
        superagent.put(earl)
                  //.set('x-access-token', account.token)
                  .send({
                    activationCode: account.activation_code
                  })
                  .end(function(e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(200);
                    
                    var body = res.body;
                    
                    expect(body).to.be.an('object');
                    expect(body).to.not.be.empty();
                    expect(body.status).to.eql("OK");
                    
                    done();
                  });
    });
    it('fails to fetch a non-existent account', function (done) {
        var earl = BASE_URL + "accounts/lol";
        
        superagent.get(earl)
                  .set('x-access-token', account.token)
                  .end(function(e, res) {
                    expect(e).to.eql(null);

                    expect(res.status).to.eql(404);
                    
                    var body = res.body;
                    
                    expect(body).to.be.an('object');
                    expect(body).to.not.be.empty();
                    expect(body.status).to.eql("ERROR");
                    
                    done();
                  });
    });
    
    it('fetches an account', function (done) {
        var earl = BASE_URL + "accounts/" + account.guid;
        
        superagent.get(earl)
                  .set('x-access-token', account.token)
                  .end(function(e, res) {
                    expect(e).to.eql(null);
                    
                    expect(res.status).to.eql(200);
                    
                    var body = res.body;
                    
                    expect(body).to.be.an('object');
                    expect(body).to.not.be.empty();
                    expect(body.status).to.eql("OK");
                    expect(body.account).to.be.an('object');
                    expect(body.account.password).to.eql(null);
                    
                    done();
                  });
    });
    
    it('fetches a list of accounts', function (done) {
        var earl = BASE_URL + "accounts";
        
        superagent.get(earl)
                  .set('x-access-token', account.token)
                  .end(function(e, res) {
                    expect(e).to.eql(null);
                    
                    expect(res.status).to.eql(200);
                    
                    var body = res.body;
                    
                    expect(body).to.be.an('object');
                    expect(body).to.not.be.empty();
                    expect(body.status).to.eql("OK");
                    expect(body.accounts).to.be.an('object');
                    
                    done();
                  });
    });
    
    it('fetches a list of accounts searching by account name', function (done) {
        var earl = BASE_URL + "accounts?name=" + account.name;
        
        superagent.get(earl)
                  .set('x-access-token', account.token)
                  .end(function(e, res) {
                    expect(e).to.eql(null);
                    
                    expect(res.status).to.eql(200);
                    
                    var body = res.body;
                    
                    expect(body).to.be.an('object');
                    expect(body).to.not.be.empty();
                    expect(body.status).to.eql("OK");
                    expect(body.accounts).to.be.an('object');
                    expect(body.accounts.length).to.eql(1);
                    
                    done();
                  });
    });
    
    it('fails to login with a non-existent account', function (done) {
        var earl = BASE_URL + "session";
        
        superagent.post(earl)
                  .set('x-access-token', account.token)
                  .send({
                    name    : "lol",
                    password: "lol"
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
    
    it('fails to update a non-existent account', function (done) {
        superagent.put(BASE_URL + 'accounts/lol')
                  .set('x-access-token', account.token)
                  .send({
                    active: 0
                  })
                  .end(function(e, res) {
                      expect(e).to.eql(null);           
                      expect(res.status).to.eql(404);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("ERROR");
                      
                      done();
                  });
    });
    
    it('updates a specific account', function (done) {
        superagent.put(BASE_URL + 'accounts/' + account.guid)
                  .set('x-access-token', account.token)
                  .send({
                    active: 0
                  })
                  .end(function(e, res) {
                      expect(e).to.eql(null);           
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      
                      done();
                  });
    });
    
    it('fails to fetch an inactive account', function (done) {
        var earl = BASE_URL + "accounts/" + account.guid;
        
        superagent.get(earl)
                  .set('x-access-token', account.token)
                  .end(function(e, res) {
                    expect(e).to.eql(null);
                    
                    expect(res.status).to.eql(404);
                    
                    var body = res.body;
                    
                    expect(body).to.be.an('object');
                    expect(body).to.not.be.empty();
                    expect(body.status).to.eql("ERROR");
                    
                    done();
                  });
    });
    
    it('deletes an account', function (done) {
        superagent.del(BASE_URL + 'accounts/' + account.guid)
                  .set('x-access-token', account.token)
                  .end(function(e, res) {
                      expect(e).to.eql(null);           
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      
                      done();
                  });
    });
    
    it('fails to fetch a non-existent account', function (done) {
        var earl = BASE_URL + "accounts/" + account.guid;
        
        superagent.get(earl)
                  .set('x-access-token', account.token)
                  .end(function(e, res) {
                    expect(e).to.eql(null);
                    
                    expect(res.status).to.eql(404);
                    
                    var body = res.body;
                    
                    expect(body).to.be.an('object');
                    expect(body).to.not.be.empty();
                    expect(body.status).to.eql("ERROR");
                    
                    done();
                  });
    });
});

describe('note api', function() {
    var id;
    
    it('gets a list of delivered notes', function (done) {
        var origin  = 'chillulum';
        var dest    = 'n';
        var channel = 'guacamole';
        
        var payload = {
            originNick: origin,
            destNick  : dest,
            channel   : channel,
            delivered : 1
        };
        
        var fmt  = qs.stringify(payload);        
        var earl = BASE_URL + 'notes/?' + fmt;
        
        superagent.get(earl)
                  .end(function(e, res) {
                      expect(e).to.eql(null);           
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      expect(body.notes).to.be.an('object');
                      
                      for (var j = 0; j < body.notes.length; j++) {
                        expect(body.notes[j].origin_nick).to.eql(origin);
                        expect(body.notes[j].dest_nick).to.eql(dest);
                        expect(body.notes[j].channel).to.eql('#' + channel);
                        expect(body.notes[j].delivered).to.eql(1);
                      }
                      
                      done();
                  });
    });
    
    it('gets a list of filtered notes', function (done) {
        var origin  = 'chillulum';
        var dest    = 'n';
        var channel = 'guacamole';
        
        superagent.get(BASE_URL + 'notes?originNick='+origin+'&dest_nick='+dest+'&channel='+channel)
                  .end(function(e, res) {
                      expect(e).to.eql(null);           
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      expect(body.notes).to.be.an('object');
                      
                      for (var j = 0; j < body.notes.length; j++) {
                        expect(body.notes[j].origin_nick).to.eql(origin);
                        expect(body.notes[j].dest_nick).to.eql(dest);
                        expect(body.notes[j].channel).to.eql('#' + channel);
                      }
                      
                      done();
                  });
    });
    
    it('gets a list of notes', function (done) {
        superagent.get(BASE_URL + 'notes')
                  .end(function(e, res) {
                      expect(e).to.eql(null);           
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      expect(body.notes).to.be.an('object');
                      
                      done();
                  });
    });
    
    it('gets a list of notes limit 1', function (done) {
        superagent.get(BASE_URL + 'notes?limit=1')
                  .end(function(e, res) {
                      expect(e).to.eql(null);           
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      expect(body.notes).to.be.an('object');
                      expect(body.notes.length).to.eql(1);
                      expect(body.limit).to.eql(1);
                      
                      done();
                  });
    });
    
    it('fails to get a non-existent note', function (done) {
        superagent.get(BASE_URL + 'notes/lol')
                  .end(function(e, res) {
                      expect(e).to.eql(null);           
                      expect(res.status).to.eql(404);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("ERROR");
                      
                      done();
                  });
    });
    
    it('creates a note', function (done) {
        superagent.post(BASE_URL + 'notes')
                  .send({
                    originNick: "brother muzzone",
                    destNick  : "omar",
                    message   : "I see you favor a .45",
                    channel   : "#baltimore"
                  })
                  .end(function(e, res) {
                      expect(e).to.eql(null); 
                      expect(res.status).to.eql(201);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      expect(body.id).to.be.ok();
                      
                      id = body.id;
                      
                      done();
                  });
    });
    
    it('gets a specific note', function (done) {
        superagent.get(BASE_URL + 'notes/' + id)
                  .end(function(e, res) {
                      expect(e).to.eql(null);           
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      expect(body.note).to.be.an('object');
                      expect(body.note.id).to.eql(id);
                      expect(body.note.origin_nick).to.be.ok();
                      expect(body.note.dest_nick).to.be.ok();
                      expect(body.note.message).to.be.ok();
                      expect(body.note.channel).to.be.ok();
                      
                      done();
                  });
    });
    
    it('updates a specific note', function (done) {
        superagent.put(BASE_URL + 'notes/' + id)
                  .send({
                    originNick: "Iggy Azalea",
                    destNick  : "sploosh",
                    message   : "First thing's first: I'm the realest",
                    channel   : "#swag"
                  })
                  .end(function(e, res) {
                      expect(e).to.eql(null);           
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      
                      done();
                  });
    });
    
    it('marks a note as delivered', function (done) {
        superagent.put(BASE_URL + 'notes/' + id)
                  .send({ delivered : 1 })
                  .end(function(e, res) {
                      expect(e).to.eql(null);           
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                  });
                  
        superagent.get(BASE_URL + 'notes/' + id)
                  .end(function(e, res) {
                      expect(e).to.eql(null);           
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      expect(body.note).to.be.an('object');
                      expect(body.note.delivered).to.eql(1);
                      expect(body.note.origin_nick).to.eql("Iggy Azalea");
                      expect(body.note.dest_nick).to.eql("sploosh");
                      
                      done();
                  });
    });
    
    it('fails to update a non-existent note', function (done) {
        superagent.put(BASE_URL + 'notes/OMARCOMIN!!!')
                  .send({
                    originNick: "Iggy Azalea",
                    destNick  : "sploosh",
                    message   : "First thing's first: I'm the realest",
                    channel   : "#swag"
                  })
                  .end(function(e, res) {
                      expect(e).to.eql(null);           
                      expect(res.status).to.eql(404);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("ERROR");
                      
                      done();
                  });
    });
    
    it('deletes a specific note', function (done) {
        superagent.del(BASE_URL + 'notes/' + id)
                  .end(function(e, res) {
                      expect(e).to.eql(null);           
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      
                      done();
                  });
    });
    
    it('fails to delete a non-existent note', function (done) {
        superagent.del(BASE_URL + 'notes/' + id)
                  .end(function(e, res) {
                      expect(e).to.eql(null);           
                      expect(res.status).to.eql(404);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("ERROR");
                      
                      done();
                  });
    });
});

describe('autocomplete api', function() {
    var query = "squire";
    
    it('autocompletes plugin names', function (done) {
        superagent.get(BASE_URL + 'autocomplete/plugins?query=' + query)
                  .end(function(e, res) {
                      expect(e).to.eql(null);           
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      expect(body.plugins).to.be.an('object');
                      expect(body.plugins.length).to.be.greaterThan(0);
                      
                      done();
                  });
    });
});

describe('logger api', function() {
    var startDate = "2014-07-01 00:00:00";
    var endDate   = "2014-08-02 00:00:00";
    var query     = "chipotle";
    
    it('counts messages filtered by search query', function (done) {
        superagent.get(BASE_URL + 'logs/messages/count?query=' + query)
                  .end(function(e, res) {
                      expect(e).to.eql(null);           
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      //expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      expect(body.total).to.be.a('number');
                      expect(body.query).to.eql(query);
                      
                      done();
                  });
    });
    
    it('counts messages filtered by date', function (done) {
        superagent.get(BASE_URL + 'logs/messages/count?startDate='+startDate+'&endDate='+endDate)
                  .end(function(e, res) {
                      expect(e).to.eql(null);                      
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      expect(body.total).to.be.a('number');
                      expect(body.startDate).to.eql(startDate);
                      expect(body.endDate).to.eql(endDate);
                      
                      done();
                  });
    });
    
    it('counts messages filtered by channel and nick', function (done) {
        superagent.get(BASE_URL + 'logs/messages/count?channel=dorkd&nick=sploosh')
                  .end(function(e, res) {
                      expect(e).to.eql(null);                      
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      expect(body.total).to.be.a('number');
                      expect(body.channel.toLowerCase()).to.eql('#dorkd');
                      expect(body.nick.toLowerCase()).to.eql('sploosh');
                      
                      done();
                  });
    });
    
    it('counts messages filtered by channel', function (done) {
        superagent.get(BASE_URL + 'logs/messages/count?channel=dorkd')
                  .end(function(e, res) {
                      expect(e).to.eql(null);                      
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      expect(body.total).to.be.a('number');
                      expect(body.channel.toLowerCase()).to.eql('#dorkd');
                      
                      done();
                  });
    });
    
    it('counts messages filtered by nick', function (done) {
        superagent.get(BASE_URL + 'logs/messages/count?nick=sploosh')
                  .end(function(e, res) {
                      expect(e).to.eql(null);                      
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      expect(body.total).to.be.a('number');
                      expect(body.nick.toLowerCase()).to.eql('sploosh');
                      
                      done();
                  });
    });
    
    it('counts messages', function (done) {
        superagent.get(BASE_URL + 'logs/messages/count')
                  .end(function(e, res) {
                      expect(e).to.eql(null);                      
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      expect(body.total).to.be.a('number');
                      
                      done();
                  });
    });
    
    it('searches for a message', function (done) {
        superagent.get(BASE_URL + 'logs/messages/?nick=sploosh&channel=dorkd&limit=1&query=lol')
                  .end(function(e, res) {
                      expect(e).to.eql(null);                      
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      expect(body.messages).to.be.an('object');
                      expect(body.messages.length).to.eql(1);
                      expect(body.messages[0].nick).to.be.ok();
                      expect(body.messages[0].ts).to.be.ok();
                      expect(body.messages[0].channel.toLowerCase()).to.eql('#dorkd');
                      expect(body.messages[0].host).to.be.ok();
                      expect(body.messages[0].message.indexOf('lol')).not.to.eql(-1);
                      
                      done();
                  });
    });
    
    it('gets a message', function (done) {
        superagent.get(BASE_URL + 'logs/messages/?nick=sploosh&channel=dorkd&limit=1')
                  .end(function(e, res) {
                      expect(e).to.eql(null);                      
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      expect(body.messages).to.be.an('object');
                      expect(body.messages.length).to.eql(1);
                      expect(body.messages[0].nick).to.be.ok();
                      expect(body.messages[0].ts).to.be.ok();
                      expect(body.messages[0].channel.toLowerCase()).to.eql('#dorkd');
                      expect(body.messages[0].host).to.be.ok();
                      
                      done();
                  });
    });
    
    it('gets information about a nick', function (done) {
        superagent.get(BASE_URL + 'logs/messages/?nick=sploosh&limit=1')
                  .end(function(e, res) {
                      expect(e).to.eql(null);                      
                      expect(res.status).to.eql(200);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      expect(body.messages).to.be.an('object');
                      expect(body.messages.length).to.eql(1);
                      expect(body.messages[0].nick.toLowerCase()).to.eql('sploosh');
                      expect(body.messages[0].ts).to.be.ok();
                      expect(body.messages[0].channel).to.be.ok();
                      expect(body.messages[0].host).to.be.ok();
                      
                      done();
                  });
    });
});

/**
 *
 * Plugin 
 *
 */
describe('plugins api', function() {
    var pluginID;
    
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
                    filename: "test-plugin",
                    enabled : 0
                  })
                  .end(function(e, res) {
                      expect(e).to.eql(null);                      
                      expect(res.status).to.eql(201);
                      
                      var body = res.body;
                      
                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("OK");
                      expect(body.id).to.be.ok();
                      
                      pluginID = body.id;
                      
                      done();
                  });
    });
    
    it('updates a plugin', function (done) {
        superagent.put(BASE_URL + 'plugins/' + pluginID)                  
                  .send({
                    name    : "test plugin!",
                    filename: "test-plugin",
                    enabled : 0
                  })
                  .end(function(e, res) {
                      expect(e).to.eql(null);       
                      
                      expect(res.status).to.eql(200);
                      expect(res.header.location).to.not.be.empty();
                      expect(res.body.status).to.eql("OK");
                      
                      done();
                  });
    });
    
    it('gets a specific plugin', function (done) {
        superagent.get(BASE_URL + 'plugins/8')
                  .end(function(e, res) {
                      expect(res.status).to.eql(200);
                      expect(e).to.eql(null);
                      
                      var body = res.body;

                      expect(body.status).to.eql("OK");
                      expect(body.plugin).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.plugin.id).to.eql(8);
                      
                      done();
                  });
    });
    
    /*
    it('gets info about specific plugin', function (done) {
        superagent.get(BASE_URL + 'plugins/8')
                  .end(function(e, res) {
                      expect(res.status).to.eql(200);
                      expect(e).to.eql(null);
                      
                      var body = res.body;

                      console.log(body);
                      
                      expect(body.status).to.eql("OK");
                      expect(body.plugin).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.plugin).to.be.an('object');
                      expect(body.plugin.id).to.eql(8);
                      expect(body.plugin.name).to.be.ok();
                      expect(body.messageCount).to.be.a('Number');
                      
                      done();
                  });
    });
    */
    
    it('fails to get a non-existent plugin', function (done) {
        superagent.get(BASE_URL + 'plugins/lol')
                  .end(function(e, res) {
                      expect(res.status).to.eql(404);
                      expect(e).to.eql(null);
                      
                      var body = res.body;

                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("ERROR");
                      
                      done();
                  });
    });
    
    it('gets all plugins', function (done) {
        superagent.get(BASE_URL + 'plugins')
                  .end(function(e, res) {
                      expect(res.status).to.eql(200);
                      expect(e).to.eql(null);
                      
                      var body = res.body;

                      expect(body.status).to.be.eql("OK");
                      expect(body.plugins).to.be.an('array');
                      
                      done();
                  });
    });
    
    it('deletes a plugin', function (done) {
        superagent.del(BASE_URL + 'plugins/' + pluginID)
                  .end(function(e, res) {
                      expect(e).to.eql(null);
                      
                      expect(res.status).to.eql(200);
                      expect(res.body.status).to.eql("OK");
                      
                      done();
                  });
    });
});

/**
 * Plugin messages
 *
 */
describe('plugin messages api', function() {
    var pluginMessageID;
    
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
                      expect(body.messages.length).to.be.greaterThan(5);
                      
                      done();
                  });
    });
    
    it('gets all messages for a plugin filtered by query', function (done) {
        superagent.get(BASE_URL + 'plugins/8/messages?query=radiance')
                  .end(function(e, res) {
                      expect(e).to.eql(null);                      
                      expect(res.status).to.eql(200);
                      
                      var body = res.body; 
                      
                      expect(body.status).to.eql("OK");
                      expect(body.message).to.eql(null);
                      expect(body.messages).to.be.an('array');
                      //expect(body.messages).to.not.be.empty();
                      
                      _.each(body.messages, function (key, value) {
                        expect(body.messages[value].message).to.contain('radiance');
                      });
                      
                      done();
                  });
    });
    
    it('gets all messages for a plugin by name', function (done) {
        superagent.get(BASE_URL + 'plugins/8/messages?name=delivered')
                  .end(function(e, res) {
                      expect(e).to.eql(null);                      
                      expect(res.status).to.eql(200);
                      
                      var body = res.body; 
                      
                      expect(body.status).to.eql("OK");
                      expect(body.message).to.eql(null);
                      expect(body.messages).to.be.an('array');
                      expect(body.messages).to.not.be.empty();
                      expect(body.messages.length).to.be.greaterThan(5);
                      
                      _.each(body.messages, function (k, v) {
                        expect(body.messages[v].name).to.eql('delivered');
                      });
                      
                      done();
                  });
    });
    
    it('gets all names for plugin messgaes', function (done) {
        superagent.get(BASE_URL + 'plugins/8/messages/names')
                  .end(function(e, res) {
                      expect(e).to.eql(null);        
                      expect(res.status).to.eql(200);
                      
                      var body = res.body; 
                      
                      expect(body.status).to.eql("OK");
                      expect(body.message).to.eql(null);
                      expect(body.names).to.be.an('array');
                      expect(body.names).to.not.be.empty();
                      
                      done();
                  });
    });
    
    it('gets all messages for a plugin with limit constraint', function (done) {
        var limit = 5;
        
        superagent.get(BASE_URL + 'plugins/8/messages?limit=' + limit)
                  .end(function(e, res) {
                      expect(e).to.eql(null);                      
                      expect(res.status).to.eql(200);
                      
                      var body = res.body; 
                      
                      expect(body.status).to.eql("OK");
                      expect(body.message).to.eql(null);
                      expect(body.messages).to.be.an('array');
                      expect(body.messages).to.not.be.empty();
                      expect(body.messages.length).to.eql(limit);
                      
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

    it('gets info about plugin messages', function (done) {
        superagent.get(BASE_URL + 'plugins/8/messages/info')
                  .end(function(e, res) {
                      expect(e).to.eql(null);                      
                      expect(res.status).to.eql(200);
                      
                      var body = res.body; 
                      
                      //console.log(body);
                      
                      expect(body.status).to.eql("OK");
                      expect(body.message).to.eql(null);
                      expect(body.info.messageCount).to.be.ok();
                      
                      done();
                  });
    });
    
    it('fails to get a non-existent plugin message', function (done) {
        superagent.get(BASE_URL + 'plugins/8/messages/lol')
                  .end(function(e, res) {
                      expect(res.status).to.eql(404);
                      expect(e).to.eql(null);
                      
                      var body = res.body;

                      expect(body).to.be.an('object');
                      expect(body).to.not.be.empty();
                      expect(body.status).to.eql("ERROR");
                      
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
                    message: "Hello, world!",
                    name   : "saved"
                  })
                  .end(function(e, res) {
                      expect(e).to.eql(null);
                      
                      expect(res.body.status).to.eql("OK");
                      expect(res.status).to.eql(201);
                      expect(res.header.location).to.not.be.empty();
                      expect(res.body.id).to.be.ok();
                      
                      pluginMessageID = res.body.id;
                      
                      done();
                  });
    });
    
    it('updates a plugin message', function (done) {
        superagent.put(BASE_URL + 'plugins/8/messages/' + pluginMessageID)
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
    
    it('deletes a plugin message', function (done) {
        superagent.del(BASE_URL + 'plugins/8/messages/' + pluginMessageID)
                  .end(function(e, res) {
                      expect(e).to.eql(null);
                      
                      expect(res.status).to.eql(200);
                      expect(res.body.status).to.eql("OK");
                      
                      done();
                  });
    });
    
    it('fails to update a non-existent plugin message', function (done) {
        superagent.put(BASE_URL + 'plugins/8/messages/lol')
                  .set('Content-Type', 'application/json')
                  .send({
                    message  : "sup",
                    name     : "delivered"
                  })
                  .end(function(e, res) {
                      expect(e).to.eql(null);
   
                      expect(res.status).to.eql(404);
                      expect(res.body.status).to.eql("ERROR");
                      
                      done();
                  });
    });
    
    it('fails to delete a non-existent plugin message', function (done) {
        superagent.del(BASE_URL + 'plugins/8/messages/lol')
                  .end(function(e, res) {
                      expect(e).to.eql(null);
                      
                      expect(res.status).to.eql(404);
                      expect(res.body.status).to.eql("ERROR");
                      
                      done();
                  });
    });
});








