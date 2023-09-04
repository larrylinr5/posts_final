const mongoose = require("mongoose");

// 建立 Schema
const paymentModel = new mongoose.Schema(
  {
    // 設計稿 4.追蹤名單
    donateFrom: { // 贊助人
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    donateTo: { // 贊助對象
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
    targetPost: { // 贊助貼文
      type: mongoose.Schema.ObjectId,
      ref: "Post"
    },
    Amt: { // 價格
      type: Number,
    },
    TradeNo: { // 藍新金流交易序
      type: String,
    },
    MerchantOrderNo: { // 商店訂單編號
      type: String,
      required: true,
    },
    PaymentType: { // 付款方式
      type: String,
    },
    PayTime: { // 付款時間
      type: Date,
    },
    isPaid: { // 付款成功
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    logicDeleteFlag: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    versionKey: false
  }
);

// 建立 Model
const Payment = mongoose.model("Payment", paymentModel);

module.exports = Payment;