const mongoose = require("mongoose");
const { appError, handleErrorAsync } = require("../utils/errorHandler");
const getHttpResponse = require("../utils/successHandler");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { generateJwtToken } = require("../middleware/auth");
const User = require("../models/userModel");
const Validator = require("../utils/validator");
const nodemailer = require("nodemailer");

const users = {
  signUpCheck: handleErrorAsync(async (req, res, next) => {
    const validatorResult = Validator.signUpCheck(req.body);
    if (!validatorResult.status) {
      return next(appError(400, "40001", validatorResult.msg));
    }
    const { email } = req.body;
    const user = await User.find({ email });
    if (user.length > 0) {
      return next(appError(400, "40002", "已註冊此用戶"));
    }
    res.status(201).json(getHttpResponse({
      message: "驗證成功"
    }));
  }),
  signUp: handleErrorAsync(async (req, res, next) => {
    const validatorResult = Validator.signUp(req.body);
    if (!validatorResult.status) {
      return next(appError(400, "40001", validatorResult.msg));
    }
    password = await bcrypt.hash(req.body.password, 12);
    const { nickName, email } = req.body;
    let newUser = {};
    try {
      newUser = await User.create({
        nickName,
        email,
        password
      });
    } catch (error) {
      if (error.code === 11000) {
        return next(appError(400, "40011", "已註冊此用戶"));
      }
      return next(appError(400, "40005", "不明原因錯誤"));
    }

    const { _id } = newUser;
    const token = await generateJwtToken(_id);
    if (token.length === 0) {
      return next(appError(400, "40003", "token 建立失敗"));
    }
    const data = {
      token,
      "id": _id
    };
    res.status(201).json(getHttpResponse({
      data
    }));
  }),
  signIn: handleErrorAsync(async (req, res, next) => {
    const validatorResult = Validator.signIn(req.body);
    if (!validatorResult.status) {
      return next(appError(400, "40001", validatorResult.msg));
    }
    const { email, password } = req.body;
    const user = await User.findOne({
      email
    }).select("+password");
    if (!user) {
      return next(appError(400, "40010", "尚未註冊"));
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return next(appError(400, "40002", "您的密碼不正確"));
    }
    const { _id } = user;
    const token = await generateJwtToken(_id);
    if (token.length === 0) {
      return next(appError(400, "40003", "token 建立失敗"));
    }
    const data = {
      token,
      "id": _id
    };
    res.status(201).json(getHttpResponse({
      data
    }));
  }),
  forgetPassword: handleErrorAsync(async (req, res, next) => {
    // 接收使用者輸入的信箱
    const { email } = req.body;

    // 驗證使用者輸入的內容
    const user = await User.findOne({ email });
    if (!email) {
      return next(appError(400, "40002", "欄位未填寫正確"));
    } else if (!validator.isEmail(email)) {
      return next(appError(400, "40001", "Email 格式不正確"));
    }else if (!user) {
      return next(appError(400, "40010", "尚未註冊"));
    }

    // 產生一組臨時身分證 (token)
    const { _id } = user;
    const token = await generateJwtToken(_id);
    if (token.length === 0) {
      return next(appError(400, "40003", "token 建立失敗"));
    }

    // 產生一組隨機密碼
    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const passwordLength = 12;
    let newPassword = "";
    for (let i = 0; i <= passwordLength; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      newPassword += chars.substring(randomNumber, randomNumber + 1);
    }

    user.password = null;
    const postPassword = await bcrypt.hash(newPassword, 12);
    await User.updateOne(
      {
        _id: user._id
      },
      {
        password: postPassword
      }
    );

    // 提供登入頁面網址
    const postUrl = process.env.FRONTEND_REDIRECT_URL;

    // 寄信至輸入信箱
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false, // port: 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to: process.env.EMAIL_USER, // 正確為 req.body.email，list of receivers
      subject: "請接收臨時密碼，建議重新登入帳號和更新密碼", // Subject line
      html: `<p>您的臨時密碼:${newPassword}</p><p>登入網址：${postUrl}</p><p>請重新登入帳號和更新密碼</p>` // html body
    });

    res.status(201).json(getHttpResponse({
      message: "請至 Email 查收信件"
    }));
  }),
  updatePassword: handleErrorAsync(async (req, res, next) => {
    const {
      user,
      body: {
        password,
        confirmPassword,
        oldPassword
      },
    } = req;
    const validatorResult = Validator.updatePw({
      password,
      confirmPassword,
      oldPassword
    });
    if (!validatorResult.status) {
      return next(appError(400, "40001", validatorResult.msg, next));
    }
    const users = await User.findOne({
      _id: user._id
    }).select("+password");
    const compare = await bcrypt.compare(oldPassword, users.password);
    if (!compare) {
      return next(appError(400, "40002", "您的舊密碼不正確!"));
    }

    users.password = null;
    const newPassword = await bcrypt.hash(req.body.password, 12);
    await User.updateOne(
      {
        _id: user._id
      },
      {
        password: newPassword
      });
    res.status(201).json(getHttpResponse({
      message: "更新密碼成功"
    }));
  }),
  getMyProfile: handleErrorAsync(async (req, res) => {
    const { user } = req;
    const profile = await User.findById(user._id).select("-logicDeleteFlag");
    res.status(200).json(getHttpResponse({
      data: profile
    }));
  }),
  getOtherProfile: handleErrorAsync(async (req, res, next) => {
    const { userId } = req.params;
    if (!(userId && mongoose.Types.ObjectId.isValid(userId))) {
      return next(appError(400, "格式錯誤", "欄位未填寫正確"));
    }
    const profile = await User.findById(userId).select("-logicDeleteFlag");
    res.status(200).json(getHttpResponse({
      data: profile
    }));
  }),
  updateProfile: handleErrorAsync(async (req, res, next) => {
    const {
      user,
      params: { userId },
      body: {
        nickName,
        gender,
        avatar
      }
    } = req;
    if (String(user._id) !== String(userId)) {
      return next(appError(400, "40004", "您無權限修改他人資料"));
    };
    if (!nickName || nickName.trim().length === 0) {
      return next(appError(400, "40001", "請填寫暱稱"));
    };
    if (avatar && !validator.isURL(avatar, { protocols: ["https"] }))
      return next(appError(400, "40001", "圖片格式不正確!"));
    const profile = await User.findByIdAndUpdate(userId,
      {
        nickName,
        gender,
        avatar
      },
      {
        new: true
      }).select("-logicDeleteFlag");
    res.status(201).json(getHttpResponse({
      data: profile
    }));
  })
};

module.exports = users;