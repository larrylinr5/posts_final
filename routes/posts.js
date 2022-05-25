const express = require('express');
const router = express.Router();
const PostController = require('../controller/postController');
const LikesControllers = require('../controller/likeController');
const CommentController = require('../controller/commentController');
const FileController = require('../controller/fileController')
const { handleErrorAsync } = require('../utils/errorHandler');
const { isAuth } = require('../middleware/auth')
const { upload } = require('../utils/upload')

// 搜尋所有貼文
router.get('/', isAuth, handleErrorAsync((req, res, next) => {
  PostController.getAllPosts(req, res, next);
}));

// 搜尋個人的全部貼文
router.get('/:userId', isAuth, handleErrorAsync((req, res, next) => {
  PostController.getAllPosts(req, res, next);
}));

// 張貼個人動態 - 新增貼文
router.post('/', isAuth, handleErrorAsync(async (req, res, next) => {
  PostController.postOnePost(req, res, next);
}));

// 張貼個人動態 - 修改貼文
router.patch('/:postId', isAuth, handleErrorAsync(async (req, res, next) => {
  PostController.patchOnePost(req, res, next);
}));

// 取得個人按讚列表
router.get('/likes', isAuth, handleErrorAsync(async (req, res, next) => {
  LikesControllers.getUserLikeList(req, res, next)
}))

// 新增一則貼文的讚
router.put('/likes/:postId', isAuth, handleErrorAsync(async (req, res, next) => {
  LikesControllers.addPostLike(req, res, next)
}))

// 取消一則貼文的讚
router.delete('/likes/:postId', isAuth, handleErrorAsync(async (req, res, next) => {
  LikesControllers.delPostLike(req, res, next)
}))

// 新增一則貼文的留言
router.post('/comment/:postId', isAuth, handleErrorAsync(async (req, res, next) => {
  CommentController.postPostComment(req, res, next);
}));

// 修改一則貼文的留言
router.patch('/comment/:postId/:commentId', isAuth, handleErrorAsync(async (req, res, next) => {
  CommentController.patchPostComment(req, res, next);
}));

// 上傳圖片
router.post('/image', isAuth, upload, handleErrorAsync(async (req, res, next) => {
  FileController.uploadOneImage(req, res, next);
}));

module.exports = router;