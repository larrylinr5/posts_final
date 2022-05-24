const mongoose = require('mongoose');
const {appError} = require('../utils/errorHandler');
const User = require('../models/userModel');
 
const checkUserId = async(req, res, next) => {
  const { id } = req.params;
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  if(!isValidId) {
    return next(appError(400, '格式錯誤', '使用者 ID 格式錯誤, 請重新確認', next));
  }
  const user = await User.findById(id);
  if(!user) {
    return next(appError(400, '無此資料', '無此用戶', next));
  }
  next()  
};

module.exports = {checkUserId}