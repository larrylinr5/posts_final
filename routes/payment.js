
const express = require("express");
const router = express.Router();
const { handleErrorAsync } = require("../utils/errorHandler");
const { isAuth } = require("../middleware/auth");
const paymentController = require("../controller/paymentController");
/* 創建訂單 */
router.post("/createOrder", isAuth, (req, res, next) => 
/**
    * #swagger.tags = ['Payment']
    * #swagger.summary = '建立訂單'
    * #swagger.security = [{
        "Bearer": [] 
      }]
    */
/**
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '建立訂單 request body',
      schema: {
        userId: "635a5e0f43db2efd079d0beb",
        postId: "63cb6c8badab20127412cef8",
        amt: 1,
        ItemDesc: "贊助貼文"
      }
    }
    */
/**
    #swagger.responses[200] = {
      description: '取得特定會員的個人資料成功',
      schema: { $ref: '#/definitions/createOrder' }
    }
    #swagger.responses[401] = {
      description: 'postId 不正確',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[401] = {
      description: 'amt 必須要是數字',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[401] = {
      description: '金額不能小於等於零',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[401] = {
      description: '沒有內容',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[405] = {
      description: '該貼文不存在',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[405] = {
      description: '建立失敗',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[401] = {
      description: '無此路由',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  paymentController.postCreateOrder(req, res, next)
);
router.get("/donate", (req, res, next) => 
/**
    * #swagger.tags = ['Payment']
    * #swagger.summary = '測試用建立訂單畫面'
    */
  res.render("donate", { title: "Express" })
);
router.get("/check", (req, res, next) => 
/**
    * #swagger.tags = ['Payment']
    * #swagger.summary = '測試用顯示訂單資訊畫面'
    */
  res.render("check", { title: "Express" })
);
router.get("/getOrderInfo/:orderId", isAuth, (req, res, next) => 
/**
    * #swagger.tags = ['Payment']
    * #swagger.summary = '取得訂單資訊'
    * #swagger.security = [{
        "Bearer": [] 
      }]
    */
/**
    #swagger.responses[200] = {
      description: '取得訂單資訊',
      schema: { $ref: '#/definitions/getOrderInfo' }
    }
    #swagger.responses[401] = {
      description: 'orderId 不正確',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[405] = {
      description: '沒找到訂單',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[401] = {
      description: 'orderId 不正確',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[401] = {
      description: '無此路由',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error' }
    }
  */
{
  paymentController.getOrderInfo(req, res, next);
});
router.post("/notify", (req, res, next) => 
/**
    * #swagger.tags = ['Payment']
    * #swagger.summary = '藍新金流回傳結果，用於保存數據'
    */
{
  paymentController.postNotify(req, res, next);
});
router.post("/return", (req, res, next) => 
/**
    * #swagger.tags = ['Payment']
    * #swagger.summary = '藍新金流回傳結果，用於重定向頁面'
    */
{
  res.redirect("https://www.universewalls.com/?isPaid=true");
  // paymentController.postReturn(req, res, next);
});






module.exports = router;