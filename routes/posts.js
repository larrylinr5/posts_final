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

/* 上傳貼文圖片 */
router.post("/image", isAuth, upload, (req, res, next) =>
/**
   * #swagger.tags = ['Files']
   * #swagger.summary = '上傳貼文圖片'
   * #swagger.security = [{
      "Bearer": [] 
    }]
   */
/**
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['files'] = {
      in: 'formData',
      type: 'file',
      required: 'true',
      description: '圖片檔案',
    }
   */
  /**
    #swagger.responses[201] = {
      description: '上傳成功',
      schema: {
        data: 'https://i.imgur.com/xxx.png'
      }
    }
    #swagger.responses[400] = {
      description: '上傳失敗',
      schema: { $ref: '#/definitions/Error' }
    }
   */
  FileController.uploadOneImage(req, res, next)
);

/* 新增一則特定貼文的留言 */
router.post("/comment/:postId", isAuth, (req, res, next) =>
/**
    * #swagger.tags = ['Comments']
    * #swagger.summary = '新增一則特定貼文的留言'
    * #swagger.security = [{
      "Bearer": [] 
    }]
    */
/**
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '留言資料',
      schema: {
        $comment: '留言內容',
      }
    }
    */
  /**
    #swagger.responses[201] = {
      description: '新增貼文留言成功',
      schema: { $ref: '#/definitions/Comment' }
    }
    #swagger.responses[400] = {
      description: '新增貼文留言失敗',
      schema: { $ref: '#/definitions/Error' }
    }
    */
  CommentController.postPostComment(req, res, next)
);

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

/* 修改一則特定貼文的特定留言 */
router.patch("/comment/:postId/:commentId", isAuth, (req, res, next) =>
/**
    * #swagger.tags = ['Comments']
    * #swagger.summary = '修改一則特定貼文的特定留言'
    * #swagger.security = [{
      "Bearer": [] 
    }]
    */
/**
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '留言資料',
      schema: {
        $comment: '留言內容',
      }
    }
    */
  /**
    #swagger.responses[201] = {
      description: '修改貼文留言成功',
      schema: { $ref: '#/definitions/Comment' }
    }
    #swagger.responses[400] = {
      description: '修改貼文留言失敗',
      schema: { $ref: '#/definitions/Error' }
    }
    */
  CommentController.patchPostComment(req, res, next)
);

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

/* 刪除一則特定貼文的特定留言 */
router.delete("/comment/:postId/:commentId", isAuth, (req, res, next) =>
/**
    * #swagger.tags = ['Comments']
    * #swagger.summary = '刪除一則特定貼文的特定留言'
    * #swagger.security = [{
        "Bearer": [] 
      }]
    */
  /**
    #swagger.responses[201] = {
      description: '刪除貼文留言成功',
      schema: { $ref: '#/definitions/Success' }
    }
    #swagger.responses[400] = {
      description: '刪除貼文留言失敗',
      schema: { $ref: '#/definitions/Error' }
    }
    */
  CommentController.deletePostComment(req, res, next)
);

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