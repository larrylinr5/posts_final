const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const followController = require('../controller/followController');
const { handleErrorAsync } = require('../utils/errorHandler');
const { checkUserId } = require('../middleware/checkId');
const { isAuth } = require('../middleware/auth');
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

router.post('/follows/:id', isAuth, checkUserId, followController.postFollow);

router.delete('/follows/:id', isAuth, checkUserId, followController.deleteFollow);

// 取得個人資料(自己)
router.get('/profile', isAuth, handleErrorAsync(async (req, res, next) => {
  userController.getMyProfile(req, res, next)
}))

// 取得個人資料(自己)
router.get('/profile/:userId', isAuth, handleErrorAsync(async (req, res, next) => {
  userController.getOtherProfile(req, res, next)
}))

// 更新個人資料
router.patch('/profile/:userId', isAuth, handleErrorAsync(async (req, res, next) => {
  userController.updateProfile(req, res, next)
}))
module.exports = router
