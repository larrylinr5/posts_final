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