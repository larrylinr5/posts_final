const express = require("express");
const router = express.Router();
const PostController = require("../controller/postController");
const LikesControllers = require("../controller/likeController");
const CommentController = require("../controller/commentController");
const FileController = require("../controller/fileController");
const { handleErrorAsync } = require("../utils/errorHandler");
const { isAuth } = require("../middleware/auth");
const { upload } = require("../utils/upload");

/* 取得或搜尋所有貼文 */
router.get("/", isAuth, (req, res, next) =>
/**
           * #swagger.tags = ['Posts']
           * #swagger.summary = '取得所有貼文'
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
              description: '排序方式，desc 為新至舊，asc 為舊至新，hot 為最熱門',
              type: 'string',
            }
            #swagger.parameters['currentPage'] = {
              in: 'query',
              description: '當前頁面',
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
      description: '取得貼文成功',
      schema: { $ref: '#/definitions/GetPosts' }
    }
   */
  PostController.getAllPosts(req, res, next)
);

/* 取得個人按讚列表 */
router.get("/likes", isAuth, handleErrorAsync(LikesControllers.getUserLikeList));

/* 取得或搜尋特定會員的所有貼文 */
router.get("/:userId", isAuth, (req, res, next) =>
/**
          * #swagger.tags = ['Posts']
          * #swagger.summary = '取得特定會員的所有貼文'
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
             description: '排序方式，desc 為新至舊，asc 為舊至新，hot 為最熱門',
             type: 'string',
           }
           #swagger.parameters['currentPage'] = {
             in: 'query',
             description: '當前頁面',
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
     description: '取得貼文成功',
     schema: { $ref: '#/definitions/GetPosts' }
   }
  */
  PostController.getAllPosts(req, res, next)
);

/* 新增一則貼文 */
router.post("/", isAuth, (req, res, next) =>
/**
         * #swagger.tags = ['Posts']
         * #swagger.summary = '新增一則貼文'
         * #swagger.security = [{
            "Bearer": [] 
          }]
         */
/**
          #swagger.parameters['parameter_name'] = {
            in: 'body',
            description: '貼文資料',
            schema: {
              $content: '貼文內容',
              image: ['https://i.imgur.com/xxx.png']
            }
          }
        */
  /**
    #swagger.responses[201] = {
      description: '新增貼文成功',
      schema: { $ref: '#/definitions/Post' }
    }
    #swagger.responses[400] = {
      description: '新增貼文失敗',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  PostController.postOnePost(req, res, next)
);

/* 上傳圖片 */
router.post("/image", isAuth, upload, handleErrorAsync(FileController.uploadOneImage));

/* 新增一則貼文的留言 */
router.post("/comment/:postId", isAuth, handleErrorAsync(CommentController.postPostComment));

/* 新增一則貼文的讚 */
router.put("/likes/:postId", isAuth, handleErrorAsync(LikesControllers.addPostLike));

/* 修改一則貼文的留言 */
router.patch("/comment/:postId/:commentId", isAuth, handleErrorAsync(CommentController.patchPostComment));

/* 修改一則特定貼文 */
router.patch("/:postId", isAuth, (req, res, next) =>
/**
    * #swagger.tags = ['Posts']
    * #swagger.summary = '修改一則特定貼文'
    * #swagger.security = [{
      "Bearer": [] 
    }]
    */
/**
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '貼文資料',
      schema: {
      $content: '貼文內容',
      image: ['https://i.imgur.com/xxx.png']
      }
    }
    */
  /**
    #swagger.responses[201] = {
      description: '修改貼文成功',
      schema: { $ref: '#/definitions/Post' }
    }
    #swagger.responses[400] = {
      description: '修改貼文失敗',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  PostController.patchOnePost(req, res, next)
);

/* 取消一則貼文的讚 */
router.delete("/likes/:postId", isAuth, handleErrorAsync(LikesControllers.delPostLike));

/* 刪除一則貼文的留言 */
router.delete("/comment/:postId/:commentId", isAuth, handleErrorAsync(CommentController.deletePostComment));

/* 刪除一則特定貼文 */
router.delete("/:postId", isAuth, (req, res, next) =>
/**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '刪除一則特定貼文'
   * #swagger.security = [{
      "Bearer": [] 
    }]
   */
  /**
    #swagger.responses[201] = {
      description: '刪除貼文成功',
      schema: { $ref: '#/definitions/Success' }
    }
    #swagger.responses[400] = {
      description: ' 刪除貼文失敗 ',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  PostController.deleteOnePost(req, res, next)
);

module.exports = router;