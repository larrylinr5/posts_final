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

    const newComment = await Comment.create({ editor: user, comment });
    await Post.updateOne({ _id: postId }, { comments: [...ExistPost.comments, newComment._id] });

    res.status(201).json(getHttpResponse({ data: { comment: newComment } }));
  }),
  // 修改一則貼文的留言
  patchPostComment: handleErrorAsync(async (req, res, next) => {
    const { body: { comment }, params: { postId, commentId } } = req;

    if (!(commentId && mongoose.Types.ObjectId.isValid(commentId)))
      return next(appError(400, '資料錯誤', '請傳入特定留言'));

    if (!comment)
      return next(appError(400, '格式錯誤', '請填寫留言內容!'));

    const ExistPost = await Post.findById(postId).exec();
    if (!ExistPost)
      return next(appError(400, '資料錯誤', '尚未發布貼文!'));

    const ExistComment = await Comment.findById(commentId).exec();
    if (!ExistComment)
      return next(appError(400, '資料錯誤', '尚未發布留言!'));

    const editComment = await Comment.findByIdAndUpdate(commentId, { comment });
    const patchComment = await Comment.findById(editComment._id).populate({ path: "editor", select: "nickName avatar" })

    res.status(201).json(getHttpResponse({ data: { comment: patchComment } }));
  }),
  // 刪除一則貼文的留言
  deletePostComment: handleErrorAsync(async (req, res, next) => {
    const { params: { postId, commentId } } = req;

    if (!(commentId && mongoose.Types.ObjectId.isValid(commentId)))
      return next(appError(400, '資料錯誤', '請傳入特定留言'));

    const ExistPost = await Post.findById(postId).exec();
    if (!ExistPost)
      return next(appError(400, '資料錯誤', '尚未發布貼文!'));

    const ExistComment = await Comment.findById(commentId).exec();
    if (!ExistComment)
      return next(appError(400, '資料錯誤', '尚未發布留言!'));

    // 執行刪除，其實是把 Comment 的 logicDeleteFlag 設為 true
    await Comment.findOneAndUpdate({ '_id': commentId }, { $set: { 'logicDeleteFlag': true } });
    res.status(201).json(getHttpResponse({ message: "刪除留言成功！" }))
  })
};

module.exports = comments;