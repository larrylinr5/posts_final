const express = require('express');
const router = express.Router();
const PostController = require('../controller/postController');
const LikesControllers = require('../controller/likes_controller')
const { isAuth } = require('../middleware/auth')

// 張貼個人動態 - 新增貼文
router.post('/', isAuth, (req, res, next) => {
    PostController.postOnePost(req, res, next);
});

// 取得個人按讚列表
router.get('/likes', isAuth, (req, res, next) => {
    LikesControllers.getUserLikeList(req, res, next)
})

module.exports = router;