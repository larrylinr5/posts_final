const { appError, handleErrorAsync } = require('../utils/errorHandler')
const getHttpResponse = require('../utils/successHandler');

const bcrypt = require('bcryptjs')
const { generateJwtToken } = require('../middleware/auth')

const User = require('../models/userModel')
const Follow = require('../models/followModel')
const Validator = require('../utils/validator')
const users = {
  signUpCheck: handleErrorAsync(async (req, res, next) => {
    const validatorResult = Validator.signUpCheck(req.body)
    if (!validatorResult.status) {
      return next(appError('400', '格式錯誤', validatorResult.msg))
    }
    const { nickName, email } = req.body
    const user = await User.find({
      email
    })
    if (user.length > 0) {
      return next(appError('400', '資料內容', '已註冊此用戶'))
    }
    res.status(201).json({
      status: 'success',
      message: "驗證成功"
    });
  }),

  signUp: handleErrorAsync(async (req, res, next) => {
    const validatorResult = Validator.signUp(req.body)
    if (!validatorResult.status) {
      return next(appError('400', '格式錯誤', validatorResult.msg))
    }
    password = await bcrypt.hash(req.body.password, 12)
    const { nickName, email } = req.body
    let newUser = {}
    try {
      newUser = await User.create({
        nickName,
        email,
        password,
      })
    } catch (error) {
      if (error.code === 11000) {
        return next(appError('400', '資料內容', '已註冊此用戶'))
      }
      return next(appError('400', '資料內容有誤', '不明原因錯誤'))
    }

    const { _id } = newUser
    const token = await generateJwtToken(_id)
    if (token.length === 0) {
      return next(appError('400', '資料內容', 'token建立失敗'))
    }
    res.status(201)({
      status: 'success',
      token,
    });
  }),

  signIn: handleErrorAsync(async (req, res, next) => {
    const validatorResult = Validator.signIn(req.body)
    if (!validatorResult.status) {
      return next(appError('400', '格式錯誤', validatorResult.msg))
    }
    const { email, password } = req.body
    const user = await User.findOne({
      email
    }).select('+password');
    if (!user) {
      return next(appError('400', '無此資料', '不存在該筆資料'));
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return next(appError('400', '內容錯誤', '您的密碼不正確'));
    }
    const { _id } = user
    const token = await generateJwtToken(_id)
    if (token.length === 0) {
      return res.status(400).json({
        status: 'false',
        msg: 'token建立失敗',
      })
    }
    res.status(201).json({
      status: 'success',
      token,
    });
  }),
  // 更新會員密碼
  updatePassword: handleErrorAsync(async (req, res, next) => {
    const {
      user,
      body: { password, confirm_password: confirmPassword },
    } = req;
    const validatorResult = Validator.updatePw({ password, confirmPassword })
    if (!validatorResult.status) {
      return next(appError(400, '格式錯誤', validatorResult.msg, next))
    }
    const newPassword = await bcrypt.hash(req.body.password, 12)
    await User.updateOne({ _id: user._id }, { password: newPassword });
    res.status(201).json(getHttpResponse({ "message": "更新密碼成功" }));
  }),

  getMyProfile: handleErrorAsync(async (req, res, next) => {
    const { user } = req

    const profile = await User.findById(user._id).select('-logicDeleteFlag')

    res.status(200).json(getHttpResponse(profile))
  }),

  getOtherProfile: handleErrorAsync(async (req, res, next) => {
    const { userId } = req.params

    const profile = await User.findById(userId).select('-logicDeleteFlag')

    res.status(200).json(getHttpResponse(profile))
  }),

  updateProfile: handleErrorAsync(async (req, res, next) => {
    const { user, params: { userId }, body: { nickName, gender, avatar } } = req

    if (String(user._id) !== String(userId)) return next(appError('400', '操作錯誤', '您無權限修改他人資料'))

    if (!nickName || nickName.trim().length === 0) return next(appError('400', '資料錯誤', '請填寫暱稱'))

    const profile = await User.findByIdAndUpdate(userId, { nickName, gender, avatar }, { new: true }).select('-logicDeleteFlag')

    res.status(201).json(getHttpResponse(profile))
  })
}

module.exports = users
