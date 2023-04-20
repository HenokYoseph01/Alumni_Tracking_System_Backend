/*
    This file is for setting up the mailing process for reseting the password of users
*/

//Require config file
const config = require('../config')

//Require App Error
const AppError = require('./appError');

const formData = require('form-data');
const Mailgun = require('mailgun.js');

const API_KEY = config.mailgun.api_key;
const DOMAIN = config.mailgun.domain;

const mailgun = new Mailgun(formData);
const client = mailgun.client({username: 'api', key: API_KEY});


//Send mailgun
const sendMailer = async(options)=>{
    try {
        
        const email = {
            from: '"Alumni System" <aaualumnitracking@gmail.com>',
            to:options.email,
            subject: 'Alumni System Credentials',
            text: `Welcome to the start of our alumni tracking system, your credentials are:\nUsername:${options.username}\nPassword:${options.password}`
        }
        client.messages.create(DOMAIN, email)
            .then((res) => {
            console.log(res);
            })
            .catch((err) => {
            console.error(err);
            });
    } catch (error) {
        console.log(error)
    }
}



module.exports = sendMailer
