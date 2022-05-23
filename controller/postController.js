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
    if (image && image.length > 0) {
      image.forEach(function (item, index, array) {
        let result = item.split(":");
        
        if (!validator.equals(result[0], 'https')) {
          return next(appError(400, '格式錯誤', '圖片格式不正確!'));
        }
      });
    }

    if (!content)
      return next(appError(400, '格式錯誤', '欄位未填寫正確!'));

    await Post.create({ editor: user, content, image });
    const newPost = await Post.find({}).sort({_id:-1}).limit(1).select('-logicDeleteFlag');

    res.status(201).json(getHttpResponse(newPost));
  }),
  // 修改貼文
  patchOnePost: handleErrorAsync(async (req, res, next) => {
    const { user, body: { content, image }, params: { postId } } = req;

    // 判斷圖片開頭是否為 http
    if (image && image.length > 0) {
      image.forEach(function (item, index, array) {
        let result = item.split(":");
        
        if (!validator.equals(result[0], 'https')) {
          return next(appError(400, '格式錯誤', '圖片格式不正確!'));
        }
      });
    }

    if (!content)
      return next(appError(400, '格式錯誤', '欄位未填寫正確!'));

    const ExistPost = await Post.findById(postId).exec();
    if (!ExistPost)
      return next(appError(400, '資料錯誤', '尚未發布貼文!'));
    if (ExistPost.editor.toString() !== user._id.toString())
      return next(appError(400, '資料錯誤', '您無權限編輯此貼文'));
      
    await Post.findByIdAndUpdate(postId, { editor: user, content, image });
    const editPost = await Post.find({}).sort({_id:-1}).limit(1).select('-logicDeleteFlag');

    res.status(201).json(getHttpResponse(editPost));
  })
}

module.exports = posts;