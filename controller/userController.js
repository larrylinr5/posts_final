const { appError, handleErrorAsync } = require('../utils/errorHandler')
const { getHttpResponse } = require('../utils/successHandler')

const bcrypt = require('bcryptjs')
const { generateJwtToken } = require('../middleware/auth')

const User = require('../models/userModel')
const Follow = require('../models/followModel')
const Validator = require('../utils/validator')

const users = {
  async signUp(req, res, next) {
    const validatorResult = Validator.signUp(req.body)
    if (!validatorResult.status) {
      return next(appError('400', '格式錯誤', validatorResult.msg, next))
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
      console.log(error)
      return res.status(400).json({
        status: 'false',
        msg: '已註冊此用戶',
      })
    }

    const { _id } = newUser
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
