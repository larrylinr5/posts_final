const mongoose = require("mongoose");
const {appError} = require("../utils/errorHandler");
const User = require("../models/userModel");

const checkUserId = async(req, res, next) => {
  const { userId } = req.params;
  const isValidId = mongoose.Types.ObjectId.isValid(userId);
  if (!isValidId) {
    return next(appError(400, "40002", "使用者 ID 格式錯誤, 請重新確認"));
  }
  const user = await User.findById(userId);
  if (!user) {
    return next(appError(400, "40010", "ID 不存在"));
  }
  next();
};

module.exports = {checkUserId};