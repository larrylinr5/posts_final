const express = require('express')
const router = express.Router()
const Validator = require('../utils/validator')
const appError = require('../utils/errorHandler')
const bcrypt = require('bcryptjs/dist/bcrypt')
const User = require('../models/userModel)
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

router.post('/sign_up', async function (req, res, next) {
  const validatorResult = Validator.signUp(req.body)
  if (!validatorResult.status) {
    return next(appError('400', validatorResult.status, next))
  }
  password = await bcrypt.hash(req.body.password, 12)
  const { nickName, email } = req.body
  let newUser
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

  res.json({
    status: 'success',
    user: {
      token: '',
      nickName: '',
      id: '',
    },
  })
})

module.exports = router
