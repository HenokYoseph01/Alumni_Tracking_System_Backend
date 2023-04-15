/*
    This file is for setting up the mailing process for reseting the password of users
*/

//Require config file
const config = require('../config')

//Require App Error
const AppError = require('./appError');

//Require SendGrid
const sgMailer = require('@sendgrid/mail')


//Configure Send Grid Mailer
sgMailer.setApiKey(config.sendgrid.api_key);

//Creating actual mailing logic
const sendMailer = async(options)=>{
    try {
        await sgMailer.send({
            to:options.email,
            from: config.sendgrid.sender,
            subject: 'Alumni System Credentials',
            text: `Welcome to the start of our alumni tracking system, your credentials are:\nUsername:${options.username}\nPassword:${options.password}`
        });
    } catch (error) {
        return new AppError('Could not send email',500)
    }
}

module.exports = sendMailer