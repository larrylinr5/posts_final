const { appError, handleErrorAsync } = require("../utils/errorHandler");
const getHttpResponse = require('../utils/successHandler');

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

    const { sort, q, page } = req.query
    // 時間排序
    const timeSort = sort === 'asc' ? 'createdAt' : '-createdAt'

    // 建立搜尋條件：名稱的關鍵字搜尋
    // TODO: 尚無法用關鍵字搜尋 nickName
    // const keyword = q !== undefined ? { "nickName": new RegExp(q) } : {};

    // 建立搜尋條件：editor 為自己的資料、已刪除的資料不顯示
    const filter = {
      editor: req.user.id,
      logicDeleteFlag: false
    }

    /* 頁碼處理 */
    // 取得總筆數
    const totalDatas = await Follow.find(filter).count()

    // 以一頁 10 筆為基礎，算出總頁數
    const totalPages = Math.ceil(totalDatas / 10)

    // 若頁碼不為整數
    if (!page || !validator.isInt(page.toString())) {
      return next(appError('400', '資料內容有誤', `請輸入正確頁碼，共有${totalPages}頁`, next))
    }

    // 若總頁數 >0 且 page 大於最大頁數
    if (totalPages > 0 && page > totalPages) {
      return next(appError('400', '資料內容有誤', `請輸入正確頁碼，共有${totalPages}頁`, next))
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
      data: {
        page: {
          totalPages: totalPages, // 總頁數
          currentPage: page, // 當前頁數
          perPage: 10, // 一頁顯示資料筆數
          totalDatas: totalDatas, // 資料總筆數
          has_pre: page > 1, // 是否有前一頁
          has_next: page < totalPages // 是否有下一頁
        },
        list: list
      }
    });
  })
}

module.exports = follows;