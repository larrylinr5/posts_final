const express = require('express');
const router = express.Router();
const PostController = require('../controller/postController');
const { isAuth } = require('../middleware/auth')

// 張貼個人動態 - 新增貼文
router.post('/', isAuth, (req, res, next) => {
  PostController.postOnePost(req, res, next);
});

module.exports = router;