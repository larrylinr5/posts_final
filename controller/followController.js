const { appError, handleErrorAsync } = require("../utils/errorHandler");
const getHttpResponse = require('../utils/successHandler');
const mongoose = require('mongoose');
const validator = require('validator');

const User = require('../models/userModel');
const Follow = require('../models/followModel');

const follows = {
  postFollow: handleErrorAsync(async (req, res, next) => {
    const { user } = req;
    const otherUser = req.params.id;
    if (otherUser === user.id) {
      return next(appError(400, '無法追蹤自己', '無法追蹤自己', next));
    }
    const existedFollowing = await Follow.findOne({
      editor: user.id,
      following: otherUser
    })
    if (existedFollowing) {
      return next(appError(400, '已追蹤該用戶', '已追蹤該用戶', next));
    }
    await Follow.create({
      editor: user.id,
      following: otherUser
    });
    res.status(201).json({
      status: 'success',
      message: '追蹤成功'
    });
  }),
  deleteFollow: handleErrorAsync(async (req, res, next) => {
    const { user } = req;
    const otherUser = req.params.id;
    if (otherUser === user.id) {
      return next(appError(400, '無法取消追蹤自己', '無法取消追蹤自己', next));
    }
    const existedFollowing = await Follow.findOne({
      editor: user.id,
      following: otherUser
    });
    if (!existedFollowing) {
      return next(appError(400, '尚未追蹤該用戶', '尚未追蹤該用戶', next));
    }
    await Follow.deleteOne({
      editor: user.id,
      following: otherUser
    });
    res.status(200).json({
      status: 'success',
      message: '取消追蹤成功'
    });
  }),
  // 取得個人所有追蹤列表
  getFollowList: handleErrorAsync(async (req, res, next) => {
    let { sort, q, currentPage, perPage } = req.query

    // 關鍵字處理
    const keyword = q ? new RegExp(q) : ''

    // 時間排序
    const timeSort = sort === 'asc' ? 1 : -1

    // 取得總筆數
    const totalDatas = await Follow.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'following',
          foreignField: '_id',
          pipeline: [
            { "$project": { "nickName": 1, "avatar": 1 } }
          ],
          as: 'following',
        },
      },
      {
        $match: {
          "$and": [
            { editor: new mongoose.Types.ObjectId(req.user.id) },
            { logicDeleteFlag: false },
            { 'following.nickName': { '$regex': keyword } }
          ]
        }
      },
      {
        $sort: {
          createdAt: timeSort
        }
      },
      {
        $count: 'totalDatas'
      }
    ])

    // 若沒有資料，則回傳空陣列
    if (totalDatas.length === 0) {
      res.json({
        status: 'success',
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
      });
    }

    /*
      當前頁碼處理
        若輸入參數不為整數，則回傳預設值 0
    */
    currentPage = validator.isInt(currentPage.toString())
      ? Math.max(0, Number(currentPage - 1))
      : 0

    /* 單頁筆數處理
        若輸入參數不為整數，且<0 ，則回傳預設值 10
    */
    perPage = validator.isInt(perPage.toString()) && Number(perPage) > 0
      ? Number(perPage)
      : 10

    // 算出總頁數
    const totalPages = Math.ceil(totalDatas[0].totalDatas / perPage)

    // 若總頁數 >0 且 當前頁碼 大於等於 最大頁數
    if (totalPages > 0 && currentPage >= totalPages) {
      return next(appError('400', '資料內容有誤', `請輸入正確頁碼，共有${totalPages}頁`))
    }

    // 要跳過的筆數
    const skip = currentPage * perPage

    // 取得列表
    const list = await Follow.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'following',
          foreignField: '_id',
          as: 'following',
          pipeline: [
            { "$project": { "nickName": 1, "avatar": 1 } }
          ],
        },
      },
      {
        $match: {
          $and: [
            { editor: new mongoose.Types.ObjectId(req.user.id) },
            { logicDeleteFlag: false },
            { 'following.nickName': { '$regex': keyword } }
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
    ])

    // 回傳結果
    res.json({
      status: 'success',
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
    });
  })
}

module.exports = follows;