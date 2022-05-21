const { appError, handleErrorAsync } = require("../utils/errorHandler");
const getHttpResponse = require('../utils/successHandler');

const validator = require('validator');

const User = require('../models/userModel');
const Follow = require('../models/followModel');

const follows = {
  // 取得個人所有追蹤列表
  getFollowList: handleErrorAsync(async (req, res, next) => {

    const { sort, q, page } = req.query
    // 時間排序
    const timeSort = sort === 'asc' ? 'createdAt' : '-createdAt'

    // 建立搜尋條件：關鍵字搜尋
    const filter = q !== undefined ? { "content": new RegExp(q) } : {};

    // 建立搜尋條件：editor 為自己的資料
    filter.editor = req.user.id

    /* 頁碼處理 */
    // 取得總筆數
    const total = await Follow.find(filter).count()

    // 以一頁 10 筆為基礎，算出總頁數
    const totalPage = Math.ceil(total / 10)

    // 若頁碼不為整數
    if (!page || !validator.isInt(page.toString())) {
      return next(appError('400', '資料內容有誤', `請輸入正確頁碼，共有${totalPage}頁`, next))
    }

    // 若總頁數 >0 且 page 大於最大頁數
    if (totalPage > 0 && page > totalPage) {
      return next(appError('400', '資料內容有誤', `請輸入正確頁碼，共有${totalPage}頁`, next))
    }

    // 要跳過的筆數
    const skip = (page - 1) * 10

    const list = await Follow.find(filter).populate({
      path: 'following',
      select: 'nickName avatar'
    }).sort(timeSort).limit(10).skip(skip)

    // 回傳結果
    res.json({
      status: 'success',
      data: list
    });
  })
}

module.exports = follows;