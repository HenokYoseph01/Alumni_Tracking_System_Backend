/*
    This file is for setting up the mailing process for reseting the password of users
*/

//Require config file
const config = require('../config')

const nodemailer = require('nodemailer');


// //Require App Error
// const AppError = require('./appError');

// const formData = require('form-data');
// const Mailgun = require('mailgun.js');

// const API_KEY = config.mailgun.api_key;
// const DOMAIN = config.mailgun.domain;

// const mailgun = new Mailgun(formData);
// const client = mailgun.client({username: 'api', key: API_KEY});

// Create a transporter using Mailtrap SMTP configuration
     const transporter = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 2525,
            auth: {
              user: config.mailer.user,
              pass: config.mailer.password
            },
          });

// //Send mailgun
const sendMailer = async(options)=>{
    try {


  
  // Define the email content
  const mailOptions = {
      from: '"Alumni System" <aaualumnitracking@gmail.com>',
      to:options.email,
      subject: 'Alumni System Credentials',
      text: `Welcome to the start of our alumni tracking system, your credentials are:\nUsername: ${options.username}\nPassword: ${options.password}`
  };
  
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        console.log('Error:', error);
        } else {
        console.log('Email sent:', info.response);
        }
    });
        
        // const email = {
        //     from: '"Alumni System" <aaualumnitracking@gmail.com>',
        //     to:options.email,
        //     subject: 'Alumni System Credentials',
        //     text: `Welcome to the start of our alumni tracking system, your credentials are:\nUsername: ${options.username}\nPassword: ${options.password}`
        // }
        // client.messages.create(DOMAIN, email)
        //     .then((res) => {
        //     console.log(res);
        //     })
        //     .catch((err) => {
        //     console.error(err);
        //     });
    } catch (error) {
        console.log(error)
    }
}






module.exports = sendMailer
