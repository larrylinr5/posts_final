const { appError, handleErrorAsync } = require('../utils/errorHandler');
const getHttpResponse = require('../utils/successHandler');

const validator = require('validator');

const User = require('../models/userModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

const posts = {
  // 新增貼文
  postOnePost: handleErrorAsync(async (req, res, next) => {
    const { user, body: { content, image } } = req;

    // 判斷圖片開頭是否為 http
    let ary = [];
    image.forEach(function (item, index, array) {
      let result = item.split(":");
      if (result[0] === "http") {
        ary.push(1);
      } else {
        ary.push(0);
      }
    });
    const isHttp = ary.some(function (item, index, array) {
      return item === 1
    });

    if (!content)
      return next(appError(400, '格式錯誤', '欄位未填寫正確!', next));
    if (image && isHttp) {
      return next(appError(400, '格式錯誤', '圖片格式不正確!', next));
    }

    const newPost = await Post.create({
      editor: user,
      content,
      image
    });

    res.status(201).json(getHttpResponse(newPost));
  }),
}

module.exports = posts;