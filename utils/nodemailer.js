const nodemailer = require('nodemailer');
const getHttpResponse = require('./successHandler');
const { appError } = require('./errorHandler');
const mailer = async (res, next, user, verification) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_SECRET
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const options = {
    from: process.env.MAILER_USER,
    to: user.email,
    subject: 'Metawall - 忘記密碼',
    html: `
    <h2>密碼重置</h2> 
    <p> ${user.nickName}，您好: <br />
      要重新設定您的密碼，請點選連結並輸入以下驗證碼<br />
      驗證成功後，即可設定您的新密碼<br />
      <a href="${process.env.FRONTEND_REDIRECT_URL}/?#/login?mode=verification&verificationId=${verification.verificationId.toString()}">變更密碼</a><br />
      驗證碼: <span style="color:red">${verification.verificationCode}</span><br />
      如果你並未要求重設密碼，你可以略過這則訊息。
    </p>
    <p style=color:gray>本郵件請勿直接回覆。</p>
    `
  };

  transporter.sendMail(options, function(error, info) {
    if(!error) {
      res.status(201).json(getHttpResponse({ 
        message: "請至 Email 查收信件"
      }));
    } else {
      return next(appError(401, 40101, '請稍後重試或聯絡管理員'));
    }
  });
}

module.exports = mailer