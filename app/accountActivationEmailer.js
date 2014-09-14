/**
 * accountActivationEmailer - sends email with activation link
 *
 */
"use strict";

var nodemailer                = require('nodemailer');
var accountActivationEmailer  = {};

accountActivationEmailer.send = function (options) {
    // create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: options.mailUsername,
            pass: options.mailPassword
        }
    });
    
    // setup e-mail data with unicode symbols
    var mailOptions = options;
    
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
};



module.exports = accountActivationEmailer;