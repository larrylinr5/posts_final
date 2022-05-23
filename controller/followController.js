const { appError, handleErrorAsync } = require("../utils/errorHandler");
const getHttpResponse = require('../utils/successHandler');
const mongoose = require('mongoose');
const validator = require('validator');

const User = require('../models/userModel');
const Follow = require('../models/followModel');

const follows = {
  // 取得個人所有追蹤列表
  getFollowList: handleErrorAsync(async (req, res, next) => {

    const { sort, q, currentPage, perPage } = req.query
    // 時間排序
    const timeSort = sort === 'asc' ? 1 : -1

    /* 頁碼處理 */
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
            { 'following.nickName': { '$regex': new RegExp(q) } }
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

    // 算出總頁數
    const totalPages = Math.ceil(totalDatas[0].totalDatas / perPage)

    // 若頁碼不為整數
    if (!currentPage || !validator.isInt(currentPage.toString())) {
      return next(appError('400', '資料內容有誤', `請輸入正確頁碼，共有${totalPages}頁`))
    }

    // 若總頁數 >0 且 page 大於最大頁數
    if (totalPages > 0 && currentPage > totalPages) {
      return next(appError('400', '資料內容有誤', `請輸入正確頁碼，共有${totalPages}頁`))
    }

    // 要跳過的筆數
    const skip = (currentPage - 1) * perPage

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
            { 'following.nickName': { '$regex': new RegExp(q) } }

          ]
        }
      },
      {
        $skip: skip
      },
      {
        $sort: {
          createdAt: timeSort
        }
      }
    ])

    // 回傳結果
    res.json({
      status: 'success',
      data: {
        page: {
          totalPages: totalPages, // 總頁數
          currentPage: currentPage, // 當前頁數
          perPage: perPage, // 一頁顯示資料筆數
          totalDatas: totalDatas[0].totalDatas, // 資料總筆數
          has_pre: currentPage > 1, // 是否有前一頁
          has_next: currentPage < totalPages // 是否有下一頁
        },
        list: list
      }
    });
  })
}

module.exports = follows;