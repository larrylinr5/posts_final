const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_SERVICE_AUTH_USER,
    pass: process.env.EMAIL_SERVICE_AUTH_PW
  }
});

const sendEmail = async (options) => {
  const { accepted } = await transporter.sendMail(options);
  return Array.isArray(accepted) && accepted.length > 0;
};

module.exports = {
  sendEmail
};