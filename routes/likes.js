const express = require('express')
const router = express.Router()
const LikesControllers = require('../controller/likes_controller')
const { isAuth } = require('../middleware/auth')

// 取得個人按讚列表
router.get('/', isAuth, (req, res, next) => {
    LikesControllers.getUserLikeList(req, res, next)
})

// 新增一則貼文的讚
// router.get('/:postId', LikesControllers.getUserLikePost)

// 取消一則貼文的讚
// router.delete('/:postId', LikesControllers.getUserLikePost)

module.exports = router;