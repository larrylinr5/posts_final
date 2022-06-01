const express = require("express");
const router = express.Router();
const PostController = require("../controller/postController");
const LikesControllers = require("../controller/likeController");
const CommentController = require("../controller/commentController");
const FileController = require("../controller/fileController");
const { handleErrorAsync } = require("../utils/errorHandler");
const { isAuth } = require("../middleware/auth");
const { upload } = require("../utils/upload");

/* 搜尋所有貼文 */
router.get("/", isAuth, handleErrorAsync(PostController.getAllPosts));

/* 取得個人按讚列表 */
router.get("/likes", isAuth, handleErrorAsync(LikesControllers.getUserLikeList));

/* 搜尋個人的全部貼文 */
router.get("/:userId", isAuth, handleErrorAsync(PostController.getAllPosts));

/* 張貼個人動態 - 新增貼文 */
router.post("/", isAuth, handleErrorAsync(PostController.postOnePost));

/* 上傳圖片 */
router.post("/image", isAuth, upload, handleErrorAsync(FileController.uploadOneImage));

/* 新增一則貼文的留言 */
router.post("/comment/:postId", isAuth, handleErrorAsync(CommentController.postPostComment));

/* 新增一則貼文的讚 */
router.put("/likes/:postId", isAuth, handleErrorAsync(LikesControllers.addPostLike));

/* 修改一則貼文的留言 */
router.patch("/comment/:postId/:commentId", isAuth, handleErrorAsync(CommentController.patchPostComment));

/* 張貼個人動態 - 修改貼文 */
router.patch("/:postId", isAuth, handleErrorAsync(PostController.patchOnePost));

/* 取消一則貼文的讚 */
router.delete("/likes/:postId", isAuth, handleErrorAsync(LikesControllers.delPostLike));

/* 刪除一則貼文的留言 */
router.delete("/comment/:postId/:commentId", isAuth, handleErrorAsync(CommentController.deletePostComment));

/* 個人動態 - 刪除一筆貼文 */
router.delete("/:postId", isAuth, handleErrorAsync(PostController.deleteOnePost));

module.exports = router;