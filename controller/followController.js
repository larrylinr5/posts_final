const { appError, handleErrorAsync } = require("../utils/errorHandler");
const getHttpResponse = require('../utils/successHandler');

const validator = require('validator');

const User = require('../models/userModel');
const Follow = require('../models/followModel');

const follows = {
  // 取得個人所有追蹤列表
  getFollowList: handleErrorAsync(async (req, res, next) => {
    // 尋找 follow 裡面 editor 為自己的資料
    const list = await Follow.find({ editor: req.user.id }).populate({
      path: 'following',
      select: 'nickName avatar'
    })

    // 回傳結果
    res.json({
      status: 'success',
      data: list
    });
  })
}

module.exports = follows;