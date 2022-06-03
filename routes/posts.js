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

/* 取得按讚貼文列表 */
router.get("/likes", isAuth, (req, res, next) =>
/**
       * #swagger.tags = ['Likes']
       * #swagger.summary = '取得按讚貼文列表'
       * #swagger.security = [{
          "Bearer": [] 
        }]
       */
/**
          #swagger.parameters['q'] = {
            in: 'query',
            description: '關鍵字',
            type: 'string',
          }
          #swagger.parameters['sort'] = {
            in: 'query',
            description: '排序方式，desc 為新至舊，asc 為舊至新',
            type: 'string',
          }
          #swagger.parameters['currentPage'] = {
            in: 'query',
            description: '當前頁數',
            type: 'number',
          }
          #swagger.parameters['perPage'] = {
            in: 'query',
            description: '一頁顯示資料筆數',
            type: 'number',
          }
         */
  /**
    #swagger.responses[200] = {
      description: '取得按讚貼文列表成功',
      schema: [{ $ref: '#/definitions/getLikes' }]
    }
   */
  LikesControllers.getUserLikeList(req, res, next)
);

/* 搜尋個人的全部貼文 */
router.get("/:userId", isAuth, handleErrorAsync(PostController.getAllPosts));

/* 張貼個人動態 - 新增貼文 */
router.post("/", isAuth, handleErrorAsync(PostController.postOnePost));

/* 上傳圖片 */
router.post("/image", isAuth, upload, handleErrorAsync(FileController.uploadOneImage));

/* 新增一則貼文的留言 */
router.post("/comment/:postId", isAuth, handleErrorAsync(CommentController.postPostComment));

/* 新增一則特定貼文的讚 */
router.put("/likes/:postId", isAuth, (req, res, next) =>
/**
     * #swagger.tags = ['Likes']
     * #swagger.summary = '新增一則特定貼文的讚'
     * #swagger.security = [{
        "Bearer": [] 
      }]
     */
  /**
    #swagger.responses[201] = {
      description: '按讚貼文成功',
      schema: { $ref: '#/definitions/Like' }
    }
    #swagger.responses[400] = {
      description: '按讚貼文失敗',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  LikesControllers.addPostLike(req, res, next)
);

/* 修改一則貼文的留言 */
router.patch("/comment/:postId/:commentId", isAuth, handleErrorAsync(CommentController.patchPostComment));

/* 張貼個人動態 - 修改貼文 */
router.patch("/:postId", isAuth, handleErrorAsync(PostController.patchOnePost));

/* 取消一則特定貼文的讚 */
router.delete("/likes/:postId", isAuth, (req, res, next) =>
/**
   * #swagger.tags = ['Likes']
   * #swagger.summary = '取消一則特定貼文的讚'
   * #swagger.security = [{
      "Bearer": [] 
    }]
   */
  /**
    #swagger.responses[201] = {
      description: '取消按讚貼文成功 ',
      schema: { $ref: '#/definitions/Like' }
    }
    #swagger.responses[400] = {
      description: '取消按讚貼文失敗 ',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  LikesControllers.delPostLike(req, res, next)
);

/* 刪除一則貼文的留言 */
router.delete("/comment/:postId/:commentId", isAuth, handleErrorAsync(CommentController.deletePostComment));

/* 個人動態 - 刪除一筆貼文 */
router.delete("/:postId", isAuth, handleErrorAsync(PostController.deleteOnePost));

module.exports = router;