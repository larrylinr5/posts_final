const mongoose = require('mongoose');
const { appError, handleErrorAsync } = require('../utils/errorHandler');
const getHttpResponse = require('../utils/successHandler');
const validator = require('validator');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel')

const posts = {
  // 取得全部貼文或個人全部貼文
  getAllPosts: handleErrorAsync(async (req, res, next) => {
    const { query, params: { userId } } = req
    const timeSort = query.sort === "asc" ? 1 : query.sort === 'desc' ? -1 : 'asc'
    const currentPage = query.currentPage ? Math.max(0, Number(query.currentPage - 1)) : 0
    const perPage = query.perPage ? Number(query.perPage) : 10
    const queryString = query.q !== undefined
      ? {
        $or: [
          { "content": new RegExp(query.q.trim()) }
        ],
        'logicDeleteFlag': false
      }
      : {}

    if(userId){
      queryString.editor = userId
    }

    // 向 DB 取得目標貼文資料
    const populateQuery = [
      {
        path: 'editor',
        select: 'nickName avatar'
      },
      {
        path: 'comments',
        select: 'editor comment',
        populate: {
          path: 'editor',
          select: 'nickName avatar'
        }
      }
    ]
    const targetPosts = await Post.find(queryString).populate(populateQuery).skip(currentPage  * perPage).limit(perPage).sort({ 'createdAt': timeSort, '_id': -1 })

    const total = await Post.find(queryString).countDocuments()
    const totalPages = Math.ceil(total / perPage)

    const resData = {
      message: targetPosts.length === 0 ? '搜尋無資料' : '成功取得搜尋貼文',
      list: targetPosts,
      page: {
        totalPages,
        currentPage: currentPage + 1,
        perPage,
        totalDatas: total,
        has_pre: total === 0 ?  false : currentPage + 1 > 1,
        has_next: total === 0 ?  false : currentPage + 1 < totalPages
      }
    }

    res.status(200).json(getHttpResponse(resData));
  }),

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

    if (!(postId && mongoose.Types.ObjectId.isValid(postId)))
      return next(appError(400, '資料錯誤', '請傳入特定貼文'));

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
      
    await Post.findByIdAndUpdate(postId, { content, image });
    const editPost = await Post.findOne({_id: postId}).limit(1).select('-logicDeleteFlag');
    res.status(201).json(getHttpResponse(editPost));
  })
}

module.exports = posts;