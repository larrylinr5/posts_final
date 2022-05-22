const { appError, handleErrorAsync } = require('../utils/errorHandler')

const bcrypt = require('bcryptjs')
const { generateJwtToken } = require('../middleware/auth')

const User = require('../models/userModel')
const Follow = require('../models/followModel')
const Validator = require('../utils/validator')
const users = {
  async signUp(req, res, next) {
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
      if(error.code===11000){
        return  next(appError('400', '資料內容', '已註冊此用戶'))
      }
      return  next(appError('400', '資料內容有誤', '不明原因錯誤'))
    }

    const { _id } = newUser
    const token = await generateJwtToken(_id)
    if(token.length===0) {
      return next(appError('400', '資料內容', 'token建立失敗'))
    }
    res.json({
      status: 'success',
      token,
    });
  },
  async signIn(req, res, next) {
    const validatorResult = Validator.signIn(req.body)
    if (!validatorResult.status) {
      return next(appError('400', '格式錯誤', validatorResult.msg))
    }
    // password = await bcrypt.hash(req.body.password, 12)
    const { email,password } = req.body
    const user = await User.findOne({
        email
      }).select('+password');
    if(!user) {
      return next(appError('400', '無此資料', '不存在該筆資料'));
    }
    const auth = await bcrypt.compare(password, user.password);
    if(!auth) {
      return next(appError('400', '內容錯誤', '您的密碼不正確'));
    }
    const { _id } = user
    const token = await generateJwtToken(_id)
    if(token.length===0) {
      return res.status(400).json({
        status: 'false',
        msg: 'token建立失敗',
      })
    }
    res.json({
      status: 'success',
      token,
    });
  },
}

module.exports = users
