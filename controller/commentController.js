const mongoose = require('mongoose');
const { appError, handleErrorAsync } = require('../utils/errorHandler');
const getHttpResponse = require('../utils/successHandler');
const validator = require('validator');
const User = require('../models/userModel')
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

const comments = {
  // 新增一則貼文的留言
  postPostComment: handleErrorAsync(async (req, res, next) => {
    const { user, body: { comment }, params: { postId } } = req;

    if (!(postId && mongoose.Types.ObjectId.isValid(postId)))
      return next(appError(400, '資料錯誤', '請傳入特定貼文'));

    if (!comment)
      return next(appError(400, '格式錯誤', '請填寫留言內容!'));

    const ExistPost = await Post.findById(postId).exec();
    if (!ExistPost)
      return next(appError(400, '資料錯誤', '尚未發布貼文!'));

    const newComment = await Comment.create({ editor: user._id, comment });
    await Post.updateOne({ _id: postId }, { comments: [...ExistPost.comments, newComment._id] });
    const postComment = await Comment.findById(newComment._id).populate({ path: "editor", select: "nickName avatar" })

    res.status(201).json(getHttpResponse(postComment));
  }),
};

module.exports = comments;