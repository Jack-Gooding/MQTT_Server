const sgMail = require('@sendgrid/mail');
require('dotenv').config();
const api_key = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(api_key)
const msg = {
  to: 'jack-gooding-@outlook.com', // Change to your recipient
  from: 'jack-gooding-@outlook.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
