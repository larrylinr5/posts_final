
const express = require("express");
const router = express.Router();
const { handleErrorAsync } = require("../utils/errorHandler");
const { isAuth } = require("../middleware/auth");
const paymentController = require("../controller/paymentController");
/* 創建訂單 */
router.post("/createOrder", isAuth, (req, res, next) => 
  paymentController.postCreateOrder(req, res, next)
);
router.get("/donate", (req, res, next) => 
  res.render("donate", { title: "Express" })
);
router.get("/check", (req, res, next) => 
  res.render("check", { title: "Express" })
);
router.get("/getOrderInfo/:orderId", (req, res, next) => {
  paymentController.getOrderInfo(req, res, next);
});




module.exports = router;