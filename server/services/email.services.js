const nodemailer = require("nodemailer");
const config = require("config");

const transport = nodemailer.createTransport({
  host: config.get("mail.host"),
  port: config.get("mail.port"),
  auth: {
    user: config.get("mail.username"),
    pass: config.get("mail.password"),
  },
});

const mailOptions = {
  from: config.get("mail.from"),
};

async function send(options) {
  try {
    const result = await transport.sendMail(options);
    transport.close();
    return result;
  } catch (error) {
    transport.close();
    return { error };
  }
}

module.exports.sendConfirmEmail = async function (to, token) {
  const confirmLink = `<a href='${config.get(
    "domain"
  )}/confirm/${token}' target='_blank' > here </a>`;

  const subject = "NodePress, Confirm your email address";
  const content = `<b>Hey there! </b><br> Click ${confirmLink} to confirm your email`;

  return await module.exports.sendEmail(to, subject, content);
};

module.exports.sendPasswordRecoveryEmail = async function (to, token) {
  const recoveryLink = `<a href='${config.get(
    "domain"
  )}/confirm/${token}' target='_blank' > here </a>`;

  const subject = "NodePress, Recover your password";
  const content = `<b>Hey there! </b><br> Click ${recoveryLink} to recover your password`;

  return await module.exports.sendEmail(to, subject, content);
};

module.exports.sendAccountStatusEmail = async function (to, status) {
  const subject = "NodePress, Change in your account";
  const content = `<b>Hey there! </b><br> Your account has been ${status}`;

  return await module.exports.sendEmail(to, subject, content);
};

module.exports.sendNewLoginEmail = async function (to, loginInfo) {
  const subject = "NodePress, new login";
  const content = `<b>Hey there! </b><br> You have logged in at ${loginInfo.date} from ${loginInfo.ip}`;

  return await module.exports.sendEmail(to, subject, content);
};

module.exports.sendEmail = async function (to, subject, content) {
  if (Array.isArray(to)) mailOptions.bcc = to;
  else mailOptions.to = to;

  mailOptions.subject = subject;
  mailOptions.html = content;

  return await send(mailOptions);
};
