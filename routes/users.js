const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const followController = require("../controller/followController");
const FileController = require("../controller/fileController");
const { handleErrorAsync } = require("../utils/errorHandler");
const { checkUserId } = require("../middleware/checkId");
const { isAuth } = require("../middleware/auth");
const { upload } = require("../utils/upload");

/* 取得個人所有追蹤列表 */
router.get("/follows", isAuth, handleErrorAsync(followController.getFollowList));

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
      schema: { $ref: '#/definitions/User' }
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
      schema: { $ref: '#/definitions/User' }
    }
  */
  userController.getOtherProfile(req, res, next)
);

/* 驗證註冊會員 */
router.post("/sign_up_check", (req, res, next) =>
/**
     * #swagger.tags = ['Auth']
     * #swagger.summary = '驗證註冊會員'
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
  */
  userController.signUpCheck(req, res, next)
);

/* 註冊 */
router.post("/sign_up", (req, res, next) =>
/**
     * #swagger.tags = ['Users']
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
  */
  userController.signUp(req, res, next)
);

/* 登入 */
router.post("/sign_in", (req, res, next) =>
/**
     * #swagger.tags = ['Users']
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
  */
  userController.signIn(req, res, next)
);

/* 上傳會員頭像 */
router.post("/avatar", isAuth, upload, handleErrorAsync(FileController.uploadOneImage));

/* 追蹤朋友(自己 → 別人) */
router.post("/follows/:userId", isAuth, checkUserId, handleErrorAsync(followController.postFollow));

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
  */
  userController.updateProfile(req, res, next)
);

/* 取消追蹤(自己 → 別人) */
router.delete("/follows/:userId", isAuth, checkUserId, handleErrorAsync(followController.deleteFollow));

module.exports = router;