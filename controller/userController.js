const mongoose = require("mongoose");
const { appError, handleErrorAsync } = require("../utils/errorHandler");
const getHttpResponse = require("../utils/successHandler");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { generateJwtToken } = require("../middleware/auth");
const User = require("../models/userModel");
const Payment = require("../models/paymentModel");
const Verification = require('../models/verificationModel');
const Validator = require("../utils/validator");
const mailer = require('../utils/nodemailer');

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
    const { email } = req.body;
    if (!email) return next(appError(400, "40001", "欄位未填寫"));

    const isEmailValid = validator.isEmail(email.trim());
    if (!isEmailValid) return next(appError(400, "40001", "Email 格式錯誤"));

    const user = await User.findOne({ email }).select("+email");
    if (!user) return next(appError(400, "40002", "此 Email 尚未註冊"));
    
    await Verification.findOneAndDelete({ user: user._id });

    const createdResult = await Verification.create({
      userId: user._id,
      verification: (Math.floor(Math.random() * 90000) + 10000).toString()
    });

    const verification = {
      verificationCode: createdResult.verification,
      verificationId: createdResult._id
    };

    mailer(res, next, user, verification);
  }),
  verification: handleErrorAsync(async (req, res, next) => {
    const { verificationCode, verificationId } = req.body;

    if (!verificationCode && !targetVerificationId) return next(appError(400, "40001", "欄位未填寫"));
    
    const result = await Verification.findOne({ _id: verificationId,  verification: verificationCode});

    if (!result) {
      return next(appError(400, "40101", "驗證碼輸入錯誤，請重新輸入"));
    }
    const token = await generateJwtToken(result.userId.toString());
    const data = {
      token,
      id: result.userId.toString()
    };
    res.status(201).json(getHttpResponse({
      data
    }));
  }),
  changePassword: handleErrorAsync(async (req, res, next) => {
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return next(appError(400, "40001", "欄位未填寫"));
    }

    if (password !== confirmPassword) {
      return next(appError(400, "40001", "密碼不一致"));
    }

    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minUppercase: 0,
      minSymbols: 0
    })) {
      return next(appError(400, "40001", "密碼至少 8 個字元以上，並英數混合"));
    }

    const newPassword = await bcrypt.hash(password, 12);
    await User.findByIdAndUpdate(req.user.id, { password: newPassword });

    res.status(201).json(getHttpResponse({
      message: "更新密碼成功"
    }));

    await Verification.findOneAndDelete({ user: req.user._id });
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
    const donated = await Payment.aggregate([
      { $match: { 
        donateTo: profile._id,
        logicDeleteFlag: false,
        isPaid: true,
      }},
      { $group: { _id: null, amount: { $sum: "$Amt" } } }
    ]);

    res.status(200).json(
      getHttpResponse({
        data: {
          _id: profile._id,
          nickName: profile.nickName,
          avatar: profile.avatar,
          gender: profile.gender,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
          donatedAmount: donated.length > 0 ? donated[0].amount : 0,
        },
      })
    );
  }),
  getOtherProfile: handleErrorAsync(async (req, res, next) => {
    const { userId } = req.params;
    if (!(userId && mongoose.Types.ObjectId.isValid(userId))) {
      return next(appError(400, "格式錯誤", "欄位未填寫正確"));
    }
    const profile = await User.findById(userId).select("-logicDeleteFlag");
    const donated = await Payment.aggregate([
      { $match: { 
        donateTo: profile._id,
        logicDeleteFlag: false,
        isPaid: true,
      }},
      { $group: { _id: null, amount: { $sum: "$Amt" } } }
    ]);
    res.status(200).json(
      getHttpResponse({
        data: {
          _id: profile._id,
          nickName: profile.nickName,
          avatar: profile.avatar,
          gender: profile.gender,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
          donatedAmount: donated.length > 0 ? donated[0].amount : 0,
        },
      })
    );
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