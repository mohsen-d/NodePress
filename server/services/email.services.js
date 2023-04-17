const nodemailer = require("nodemailer");
const config = require("config");

var transport = nodemailer.createTransport({
  host: config.get("mail.host"),
  port: config.get("mail.port"),
  auth: {
    user: config.get("mail.username"),
    pass: config.get("mail.password"),
  },
});

var mailOptions = {
  from: config.get("mail.from"),
};

function send(options) {
  transport.sendMail(options, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
}

module.exports.sendConfirmEmail = function (email, token) {
  const confirmLink = `<a href='${config.get(
    "domain"
  )}/confirm/${token}' target='_blank' > here </a>`;

  mailOptions.to = email;
  mailOptions.subject = "NodePress, Confirm your email address";
  mailOptions.html = `<b>Hey there! </b><br> Click ${confirmLink} to confirm your email`;

  send(mailOptions);
};
