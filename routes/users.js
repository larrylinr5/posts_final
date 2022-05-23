const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const followController = require('../controller/followController')
const { isAuth } = require('../middleware/auth')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

router.post('/sign_up_check', handleErrorAsync(async (req, res, next) => {
  userController.signUpCheck(req, res, next)
}))

router.post('/sign_up', handleErrorAsync(async (req, res, next) => {
  userController.signUp(req, res, next)
}))

router.post('/sign_in', handleErrorAsync(async (req, res, next) => {
  userController.signIn(req, res, next)
}))

router.patch('/updatePassword', isAuth, handleErrorAsync(async (req, res, next) => {
  userController.updatePassword(req, res, next)
}))

/* 取得個人所有追蹤列表 */
router.get('/follows', isAuth, (req, res, next) => {
  followController.getFollowList(req, res, next)
})

module.exports = router
