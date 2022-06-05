const { appError, handleErrorAsync } = require("../utils/errorHandler");
const getHttpResponse = require("../utils/successHandler");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { generateJwtToken } = require("../middleware/auth");
const User = require("../models/userModel");
const Validator = require("../utils/validator");

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
      return next(appError(400, "40010", "不存在該筆資料"));
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
  getOtherProfile: handleErrorAsync(async (req, res) => {
    const { userId } = req.params;
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