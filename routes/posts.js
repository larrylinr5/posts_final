const express = require('express');
const router = express.Router();
const PostController = require('../controller/postController');
const FollowController = require('../controller/followController')
const { isAuth } = require('../middleware/auth')

/* 取得個人所有追蹤列表 */
router.get('/likes', isAuth, (req, res, next) => {
  FollowController.getFollowList(req, res, next)
})

module.exports = router;