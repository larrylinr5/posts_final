const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const followController = require('../controller/followController');
const FileController = require('../controller/fileController')
const { handleErrorAsync } = require('../utils/errorHandler');
const { checkUserId } = require('../middleware/checkId');
const { isAuth } = require('../middleware/auth');
const { upload } = require('../utils/upload')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

/* 取得個人所有追蹤列表 */
router.get('/follows', isAuth, handleErrorAsync(async (req, res, next) => {
  followController.getFollowList(req, res, next)
}))

/* 取得個人資料(自己) */
router.get('/profile', isAuth, handleErrorAsync(async (req, res, next) => {
  userController.getMyProfile(req, res, next)
}))

/* 取得個人資料(別人) */
router.get('/profile/:userId', isAuth, handleErrorAsync(async (req, res, next) => {
  userController.getOtherProfile(req, res, next)
}))

/* 驗證註冊資料 */
router.post('/sign_up_check', handleErrorAsync(async (req, res, next) => {
  userController.signUpCheck(req, res, next)
}))

/* 註冊 */
router.post('/sign_up', handleErrorAsync(async (req, res, next) => {
  userController.signUp(req, res, next)
}))

/* 登入 */
router.post('/sign_in', handleErrorAsync(async (req, res, next) => {
  userController.signIn(req, res, next)
}))

/* 上傳會員頭像 */
router.post('/avatar', isAuth, upload, handleErrorAsync(async (req, res, next) => {
  FileController.uploadOneImage(req, res, next);
}));

/* 追蹤朋友(自己 → 別人) */
router.post('/follows/:userId', isAuth, checkUserId, handleErrorAsync(async (req, res, next) => {
  followController.postFollow(req, res, next)
}));

/* 修改密碼 */
router.patch('/updatePassword', isAuth, handleErrorAsync(async (req, res, next) => {
  userController.updatePassword(req, res, next)
}))

/* 更新個人資料 */
router.patch('/profile/:userId', isAuth, handleErrorAsync(async (req, res, next) => {
  userController.updateProfile(req, res, next)
}))

/* 取消追蹤(自己 → 別人) */
router.delete('/follows/:userId', isAuth, checkUserId, handleErrorAsync(async (req, res, next) => {
  followController.deleteFollow(req, res, next)
}));

module.exports = router
