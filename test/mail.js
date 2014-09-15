/**
 * mail test
 *
 */
"use strict";

var fs         = require('fs');
var emailer    = require('../app/accountActivationEmailer');
var config     = JSON.parse(fs.readFileSync("../config/api.json", 'utf8'));
var Handlebars = require('handlebars');
var template   = fs.readFileSync('../views/accounts/activation-email.html', 'utf8');

var data    = {
    name          : "new-account-name",
    activationLink: "http://salsa.prgmrbill.com/accounts/activate/activation-code-here"
};

var tmp       = Handlebars.compile(template);
var emailBody = tmp(data);

emailer.send({
    mailUsername: config.mailUsername,
    mailPassword: config.mailPassword,
    from        : "Guacbot Salsa <salsa@prgmrbill.com>",
    to          : "bill+salsa@prgmrbill.com",
    subject     : "Salsa Account Activation",
    text        : emailBody,
    html        : emailBody,
    callback    : function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    }
});
