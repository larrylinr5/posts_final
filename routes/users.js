const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const followController = require("../controller/followController");
const FileController = require("../controller/fileController");
const { handleErrorAsync } = require("../utils/errorHandler");
const { checkUserId } = require("../middleware/checkId");
const { isAuth } = require("../middleware/auth");
const { upload } = require("../utils/upload");

/* 忘記密碼 */
router.post("/forgetPassword", (req, res, next) => 
/**
    * #swagger.tags = ['Users']
    * #swagger.summary = '忘記密碼'
    */
/**
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '忘記密碼 request body',
      schema: {
        $email: 'test@gmail.com',
      }
    }
    */
  /**
    #swagger.responses[201] = {
      description: '',
      schema: { $ref: '#/definitions/forgetPasswordResponse' }
    }
    #swagger.responses[401] = {
      description: '欄位未填寫',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[401] = {
      description: 'Email 格式錯誤',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[402] = {
      description: '此 Email 尚未註冊',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[404] = {
      description: '無此路由',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  userController.forgetPassword(req, res, next)
);

/* 驗證碼 */
router.post("/verification", (req, res, next) => 
/**
    * #swagger.tags = ['Users']
    * #swagger.summary = '確認驗證碼'
    */
/**
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '確認驗證碼 request body',
      schema: {
        $verification: 18351,
      }
    }
    */
  /**
    #swagger.responses[201] = {
      description: '',
      schema: { $ref: '#/definitions/forgetPasswordResponse' }
    }
    #swagger.responses[400] = {
      description: '欄位未填寫',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[400] = {
      description: '驗證碼輸入錯誤，請重新輸入',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[404] = {
      description: '無此路由',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  userController.verification(req, res, next)
);

/* 變更密碼 */
router.patch("/changePassword", isAuth, (req, res, next) => 
/**
    * #swagger.tags = ['Users']
    * #swagger.summary = '忘記密碼-更改密碼'
    */
/**
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '忘記密碼-更改密碼 request body',
      schema: {
          $password: "AA12345678",
          $confirmPassword: "AA12345678"
      }
    }
    */
  /**
    #swagger.responses[201] = {
      description: '',
      schema: { $ref: '#/definitions/changePasswordResponse' }
    }
    #swagger.responses[400] = {
      description: '欄位未填寫',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[400] = {
      description: '密碼不一致',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[400] = {
      description: '密碼至少 8 個字元以上，並英數混合',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[404] = {
      description: '無此路由',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  userController.changePassword(req, res, next)
);

/* 取得會員的追蹤列表 */
router.get("/follows/:userId", isAuth, (req, res, next) =>
/**
    * #swagger.tags = ['Follows']
    * #swagger.summary = '取得會員的追蹤列表'
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
      description: '取得會員的追蹤列表成功',
      schema: { $ref: '#/definitions/Follows' }
    }
    #swagger.responses[404] = {
      description: '無此路由',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error' }
    }
    */
  followController.getFollowList(req, res, next)
);

/* 取得會員的個人資料(自己) */
router.get("/profile", isAuth, (req, res, next) =>
/**
    * #swagger.tags = ['Users']
    * #swagger.summary = '取得會員的個人資料'
    * #swagger.security = [{
        "Bearer": [] 
      }]
    */
  /**
    #swagger.responses[200] = {
      description: '取得會員的個人資料成功',
      schema: { $ref: '#/definitions/profile' }
    }
    #swagger.responses[404] = {
      description: '無此路由',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  userController.getMyProfile(req, res, next)
);

/* 取得特定會員的個人資料(別人) */
router.get("/profile/:userId", isAuth, (req, res, next) =>
/**
    * #swagger.tags = ['Users']
    * #swagger.summary = '取得特定會員的個人資料'
    * #swagger.security = [{
        "Bearer": [] 
      }]
    */
  /**
    #swagger.responses[200] = {
      description: '取得特定會員的個人資料成功',
      schema: { $ref: '#/definitions/profile' }
    }
    #swagger.responses[404] = {
      description: '無此路由',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  userController.getOtherProfile(req, res, next)
);

/* 驗證帳號是否註冊 */
router.post("/sign_up_check", (req, res, next) =>
/**
    * #swagger.tags = ['Auth']
    * #swagger.summary = '驗證帳號是否註冊'
    */
/**
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '註冊資料',
      schema: {
        $email: 'test@gmail.com',
        $password: 'a1234567',
        $confirmPassword: 'a1234567',
      }
    }
    */
  /**
    #swagger.responses[201] = {
      description: '驗證成功',
      schema: { $ref: '#/definitions/Success' }
    }
    #swagger.responses[400] = {
      description: '驗證失敗',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[404] = {
      description: '無此路由',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  userController.signUpCheck(req, res, next)
);

/* 註冊 */
router.post("/sign_up", (req, res, next) =>
/**
    * #swagger.tags = ['Login']
    * #swagger.summary = '註冊'
    */
/**
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '註冊資料',
      schema: {
        $nickName: '暱稱',
        $email: 'test@gmail.com',
        $password: 'a1234567',
        $confirmPassword: 'a1234567'
      }
    }
    */
  /**
    #swagger.responses[201] = {
      description: '註冊成功',
      schema: { $ref: '#/definitions/Sign' }
    }
    #swagger.responses[400] = {
      description: '註冊失敗',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[404] = {
      description: '無此路由',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  userController.signUp(req, res, next)
);

/* 登入 */
router.post("/sign_in", (req, res, next) =>
/**
    * #swagger.tags = ['Login']
    * #swagger.summary = '登入'
  */
/**
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '登入資料',
      schema: {
        $email: 'test@gmail.com',
        $password: 'a1234567',
      }
    }
    */
  /**
    #swagger.responses[201] = {
      description: '登入成功',
      schema: { $ref: '#/definitions/Sign' }
    }
    #swagger.responses[400] = {
      description: '登入失敗',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[404] = {
      description: '無此路由',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  userController.signIn(req, res, next)
);

/* 上傳會員頭像 */
router.post("/avatar", isAuth, upload, (req, res, next) =>
/**
     * #swagger.tags = ['Files']
     * #swagger.summary = '上傳會員頭像'
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
    #swagger.responses[404] = {
      description: '無此路由',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error' }
    }
   */
  FileController.uploadOneImage(req, res, next)
);

/* 追蹤朋友(自己 → 別人) */
router.post("/follows/:userId", isAuth, checkUserId, (req, res, next) =>
/**
    * #swagger.tags = ['Follows']
    * #swagger.summary = '追蹤朋友'
    * #swagger.security = [{
      "Bearer": [] 
    }]
    */
  /**
    #swagger.responses[201] = {
      description: '追蹤朋友成功',
      schema: { $ref: '#/definitions/Success' }
    }
    #swagger.responses[400] = {
      description: '追蹤朋友失敗',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[404] = {
      description: '無此路由',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  followController.postFollow(req, res, next)
);

/* 更新會員密碼 */
router.patch("/updatePassword", isAuth, (req, res, next) =>
/**
    * #swagger.tags = ['Users']
    * #swagger.summary = '更新會員密碼'
    * #swagger.security = [{
      "Bearer": [] 
    }]
    */
/**
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '更新資料',
      schema: {
        $password: 'ktv1234567',
        $confirmPassword: 'ktv1234567',
        $oldPassword: 'a1234567'
      }
    }
    */
  /**
    #swagger.responses[201] = {
      description: '更新密碼成功',
      schema: { $ref: '#/definitions/Success' }
    }
    #swagger.responses[400] = {
      description: '更新密碼失敗',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[404] = {
      description: '無此路由',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  userController.updatePassword(req, res, next)
);

/* 更新特定會員的個人資料 */
router.patch("/profile/:userId", isAuth, (req, res, next) =>
/**
    * #swagger.tags = ['Users']
    * #swagger.summary = '更新特定會員的個人資料'
    * #swagger.security = [{
        "Bearer": [] 
      }]
    */
/**
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '更新資料',
      schema: {
        $nickName: '兩金勘吉',
        gender: 1,
        avatar: 'https://i.imgur.com/xxx.png'
      }
    }
    */
  /**
   #swagger.responses[201] = {
     description: '更新特定會員的個人資料成功',
     schema: { $ref: '#/definitions/User' }
   }
   #swagger.responses[400] = {
     description: '更新特定會員的個人資料失敗',
     schema: { $ref: '#/definitions/Error' }
   }
   #swagger.responses[404] = {
      description: '無此路由',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  userController.updateProfile(req, res, next)
);

/* 取消追蹤朋友(自己 → 別人) */
router.delete("/follows/:userId", isAuth, checkUserId, (req, res, next) =>
/**
    * #swagger.tags = ['Follows']
    * #swagger.summary = '取消追蹤朋友'
    * #swagger.security = [{
        "Bearer": [] 
      }]
    */
  /**
    #swagger.responses[201] = {
      description: '取消追蹤朋友成功',
      schema: { $ref: '#/definitions/Success' }
    }
    #swagger.responses[400] = {
      description: '取消追蹤朋友失敗',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[404] = {
      description: '無此路由',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  followController.deleteFollow(req, res, next)
);

module.exports = router;