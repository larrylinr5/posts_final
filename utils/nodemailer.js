const nodemailer = require('nodemailer');
const getHttpResponse = require('./successHandler');
const { appError } = require('./errorHandler');

const mailer = (res, next, user, randomNum) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.MAILER_USER,
      clientId: process.env.MAILER_CLIENTID,
      clientSecret: process.env.MAILER_CLIENT_SECRET,
      refreshToken: process.env.MAILER_REFRESH_TOKEN,
      accessToken: process.env.MAILER_ACCESS_TOKEN
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
      <a href="http://127.0.0.1:3005/users/verification/${user._id.toString()}">變更密碼</a><br />
      驗證碼: <span style="color:red">${randomNum}</span><br />
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