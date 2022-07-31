const Post = require("../models/postModel");
const { appError, handleErrorAsync } = require("../utils/errorHandler");
const getHttpResponse = require("../utils/successHandler");
const User = require("../models/userModel");
const Payment = require("../models/paymentModel");
const {create_mpg_aes_encrypt, create_mpg_sha_encrypt, create_mpg_aes_decrypt, genDataChain} = require("../utils/payment");

const orders = {};


const pay = {
  postCreateOrder: handleErrorAsync(async (req, res, next) => {
    console.log("----",req.body);
    const { amt, postId , userId} = req.body;
    // 驗證
    if (typeof postId !== "string" && postId.length <= 0) {
      return next(appError(400, "40001", "postId 不正確"));
    }
    if (typeof +amt !== "number") {
      return next(appError(400, "40001", "amt 必須要是數字"));
    }
    if(amt <= 0) {
      return next(appError(400, "40002", "金額不能小於等於零"));
    }
    // const userId = req.user;
    //取得user資料
    const user = await User.findOne({
      _id: userId,
      logicDeleteFlag: false,
    }).select("+email");
    if (!user) {
      return next(appError(400, "40002", "沒有內容"));
    }

    // 取得post資料
    const targetPost = await Post.findOne({
      _id: postId,
      logicDeleteFlag: false,
    });
    if (!targetPost) {
      return next(appError(400, "40005", "該貼文不存在"));
    }

    // 產生訂單資訊
    const now = String(Date.now());
    const tradeInfo = {
      Email: user.email,
      Amt: amt,
      ItemDesc: `向${user.nickName}贊助`,
      TimeStamp: now,
      MerchantOrderNo: now
    };

    const result = await Payment.create({
      donateTo: targetPost.editor,
      donateFrom: user._id,
      targetPost: targetPost._id,
      MerchantOrderNo: tradeInfo.MerchantOrderNo,
      Amt: tradeInfo.Amt,
      ItemDesc: tradeInfo.ItemDesc
    });

    console.log("create",result);
    if(!result){
      return next(appError(400, "40005", "建立失敗"));
    }

    // orders[now] = tradeInfo;
    return res.json(tradeInfo);
  }),
  getOrderInfo: handleErrorAsync(async (req, res, next)=>{
    const { orderId } = req.params;
    if(!orderId){
      return next(appError(400, "40001", "orderId 不正確"));
    }

    const order = await Payment.findOne({MerchantOrderNo: orderId});
    // const order = orders[orderId];

    if(!order){
      return next(appError(400, "40005", "沒找到訂單"));
    }

    const user = await User.findOne({
      _id: order.donateFrom,
      logicDeleteFlag: false,
    }).select("+email");
    if (!user) {
      return next(appError(400, "40002", "沒有內容"));
    }

    const tradeInfo = {
      Email: user.email,
      Amt: order.Amt,
      ItemDesc: order.ItemDesc,
      TimeStamp: order.MerchantOrderNo,
      MerchantOrderNo: order.MerchantOrderNo
    };

    // 用來產出字串
    const paramString = genDataChain(tradeInfo);
    console.log("paramString:", paramString);
  
    // 加密第一段字串，此段主要是提供交易內容給予藍新金流
    const aesEncrypt = create_mpg_aes_encrypt(tradeInfo);
    console.log("aesEncrypt:", aesEncrypt);
  
    // 使用 HASH 再次 SHA 加密字串，作為驗證使用
    const shaEncrypt = create_mpg_sha_encrypt(aesEncrypt);
    console.log("shaEncrypt:", shaEncrypt);
  
    res.json({
      order: tradeInfo,
      aesEncrypt,
      shaEncrypt,
    });
  }),
  postReturn: handleErrorAsync(async (req, res, next) => {
    res.end();
  }),
  // 取得藍新通知
  postNotify: handleErrorAsync(async (req, res, next) => {
    console.log("req.body notify data", req.body);
    const reqData = req.body;
  
    const thisShaEncrypt = create_mpg_sha_encrypt(reqData.TradeInfo);
    // 使用 HASH 再次 SHA 加密字串，確保比對一致（確保不正確的請求觸發交易成功）
    if (!thisShaEncrypt === reqData.TradeSha) {
      console.log("付款失敗：TradeSha 不一致");
      return res.end();
    }
  
    // 解密交易內容
    const data = create_mpg_aes_decrypt(reqData.TradeInfo);
    console.log("data:", data);
  
    // 取得交易內容，並查詢本地端資料庫是否有相符的訂單
    // if (!orders[data?.Result?.MerchantOrderNo]) {
    //   console.log("找不到訂單");
    //   return res.end();
    // }

    // 交易完成，將成功資訊儲存於資料庫
    const result = await Payment.findOneAndUpdate({
      MerchantOrderNo: data.Result.MerchantOrderNo
    }, {
      isPaid: true,
      PaymentType: data.Result.MerchantOrderNo,
      PayTime: data.Result.PayTime,
      TradeNo: data.Result.TradeNo
    }, { returnDocument: "after", runValidators: true });

    if(!result){
      console.log("找不到訂單編號");
      return res.end();
    }
    
    return res.end();
})
};

module.exports = pay;
