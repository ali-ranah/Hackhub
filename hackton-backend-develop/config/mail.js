require('dotenv').config();
const MailGen = require('mailgen');

const mailGenerator = new MailGen({
  theme: 'salted',
  product: {
    name: "HacksHub",
    link: "https.hackshub.com",
    logo: process.env.MAIL_LOGO
  }
});

module.exports = {
  mailGenerator
};
