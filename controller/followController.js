const { appError } = require("../utils/errorHandler");
const getHttpResponse = require("../utils/successHandler");
const mongoose = require("mongoose");
const validator = require("validator");
const Follow = require("../models/followModel");

const follows = {
  // 取得個人所有追蹤列表
  getFollowList: async (req, res, next) => {
    let { 
      sort, 
      q, 
      currentPage,
      perPage 
    } = req.query;

    // 關鍵字處理
    const keyword = q ? new RegExp(q) : "";

    // 時間排序
    const timeSort = sort === "asc" ? 1 : -1;

    // 取得總筆數
    const totalDatas = await Follow.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "_id",
          pipeline: [
            { "$project": { "nickName": 1, "avatar": 1 } }
          ],
          as: "following",
        },
      },
      {
        $match: {
          "$and": [
            { follow: new mongoose.Types.ObjectId(req.user.id) },
            { logicDeleteFlag: false },
            { "following.nickName": { "$regex": keyword } }
          ]
        }
      },
      {
        $sort: {
          createdAt: timeSort
        }
      },
      {
        $count: "totalDatas"
      }
    ]);

    // 若沒有資料，則回傳空陣列
    if (totalDatas.length === 0) {
      return res.status(200).json(getHttpResponse({
        message: "取得資料成功",
        data: {
          page: {
            totalPages: 0, // 總頁數
            currentPage: 1, // 當前頁數
            perPage: perPage, // 一頁顯示資料筆數
            totalDatas: 0, // 資料總筆數
            has_pre: false, // 是否有前一頁
            has_next: false // 是否有下一頁
          },
          list: []
        }
      }));
    }

    /*
      當前頁碼處理
        若有輸入參數，則進一步判定，否則回傳預設值 0
        若輸入參數不為整數，則回傳預設值 0
    */
    currentPage = currentPage
      ? validator.isInt(currentPage.toString())
        ? Math.max(0, Number(currentPage - 1))
        : 0
      : 0;


    /* 單頁筆數處理
        若有輸入參數，則進一步判定，否則回傳預設值 10
        若輸入參數不為整數，且<0 ，則回傳預設值 10
    */
    perPage = perPage
      ? validator.isInt(perPage.toString()) && Number(perPage) > 0
        ? Number(perPage)
        : 10
      : 10;

    // 算出總頁數
    const totalPages = Math.ceil(totalDatas[0].totalDatas / perPage);

    // 若總頁數 >0 且 當前頁碼 大於等於 最大頁數
    if (totalPages > 0 && currentPage >= totalPages) {
      return next(appError(400, "40002", `請輸入正確頁碼，共有${totalPages}頁`));
    }

    // 要跳過的筆數
    const skip = currentPage * perPage;

    // 取得列表
    const list = await Follow.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "_id",
          as: "following",
          pipeline: [
            { "$project": { "nickName": 1, "avatar": 1 } }
          ],
        },
      },
      {
        $match: {
          $and: [
            { follow: new mongoose.Types.ObjectId(req.user.id) },
            { logicDeleteFlag: false },
            { "following.nickName": { "$regex": keyword } }
          ]
        }
      },
      {
        $project: {
          "logicDeleteFlag": 0,
        }
      },
      {
        $skip: skip
      },
      {
        $sort: {
          createdAt: timeSort
        }
      },
      {
        $limit: perPage
      }
    ]);

    // 回傳結果
    res.status(200).json(getHttpResponse({
      message: "取得資料成功",
      data: {
        page: {
          totalPages: totalPages, // 總頁數
          currentPage: currentPage + 1, // 當前頁數
          perPage: perPage, // 一頁顯示資料筆數
          totalDatas: totalDatas[0].totalDatas, // 資料總筆數
          has_pre: (currentPage + 1) > 1, // 是否有前一頁
          has_next: (currentPage + 1) < totalPages // 是否有下一頁
        },
        list: list
      }
    }));
  },
  postFollow: async (req, res, next) => {
    const { user } = req;
    const otherUser = req.params.userId;
    if (otherUser === user.id) {
      return next(appError(400, "40004", "無法追蹤自己"));
    }
    const existedFollowing = await Follow.findOne({
      follow: user.id,
      following: otherUser
    });
    if (existedFollowing) {
      return next(appError(400, "40010", "已經追蹤"));
    }
    await Follow.create({
      follow: user.id,
      following: otherUser
    });
    res.status(201).json(getHttpResponse({ 
      message: "追蹤成功" 
    }));
  },
  deleteFollow: async (req, res, next) => {
    const { user } = req;
    const otherUser = req.params.userId;
    if (otherUser === user.id) {
      return next(appError(400, "40004", "無法取消追蹤自己"));
    }
    const existedFollowing = await Follow.findOne({
      follow: user.id,
      following: otherUser
    });
    if (!existedFollowing) {
      return next(appError(400, "40010", "尚未追蹤"));
    }
    await Follow.deleteOne({
      follow: user.id,
      following: otherUser
    });
    res.status(201).json(getHttpResponse({ 
      message: "取消追蹤成功" 
    }));
  }
};

module.exports = follows;