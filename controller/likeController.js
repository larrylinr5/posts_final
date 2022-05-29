const { appError, handleErrorAsync } = require('../utils/errorHandler');
const getHttpResponse = require('../utils/successHandler');
const Post = require('../models/postModel');
const mongoose = require('mongoose');

const like = {
    getUserLikeList: handleErrorAsync(async(req, res, next) => {

        const { user, query } = req

        const keyword = query.q ? query.q : '' // 關鍵字
        let currentPage = Math.max(0, Number(query.currentPage - 1)) // 當前頁數
        let perPage = query.perPage ? Number(query.perPage) : 10 // 一頁顯示幾筆資料

        // 搜尋條件
        const filter = {
            '$in': user._id,
            'likes.0': { $exists: true },
            'logicDeleteFlag': false,
            $or: [
                { content: { $regex: keyword } },
            ],
        }

        // 倒序: desc，升序: asc
        const sort = query.sort === 'desc' ? -1 : query.sort === 'asc' ? 1 : 'asc'
            // 用戶有按讚的所有貼文，隱藏comments欄位
        const userAllPost = await Post.find(filter, { 'comments': false }).populate({ path: 'editor', select: 'nickName avatar' }).skip(currentPage).limit(perPage).sort({ 'createdAt': sort })

        let totalDatas = userAllPost.length // 總資料筆數
        let totalPages = Math.ceil(userAllPost.length / perPage) // 一共顯示幾頁

        const message = userAllPost.length === 0 ? '您尚未按讚，故無該資料' : '取得資料成功';
        const resData = {
            list: userAllPost,
            page: {
                totalPages, // 總頁數
                currentPage, // 當前頁數
                perPage, // 一頁顯示資料筆數
                totalDatas, // 資料總筆數
                has_pre: totalDatas === 0 ? false : currentPage + 1 > 1,
                has_next: totalDatas === 0 ? false : currentPage + 1 < totalPages
            },
        }

        res.status(200).json(getHttpResponse({ data: resData, message }));
    }),
    addPostLike: handleErrorAsync(async(req, res, next) => {
        const { user, params: { postId } } = req

        if (!(postId && mongoose.Types.ObjectId.isValid(postId)))
            return next(appError(400, '資料錯誤', '請傳入特定貼文'))

        const ExistPost = await Post.findById(postId)
        if (!ExistPost)
            return next(appError(400, '資料錯誤', '尚未發布貼文'))

        const likes = await Post.findOneAndUpdate({ postId }, { $addToSet: { likes: user._id } }, { new: true })

        res.status(201).json(getHttpResponse({ data: likes, message: '加入按讚成功' }));
    }),
    delPostLike: handleErrorAsync(async(req, res, next) => {
        const { user, params: { postId } } = req

        if (!(postId && mongoose.Types.ObjectId.isValid(postId)))
            return next(appError(400, '資料錯誤', '請傳入特定貼文'))

        const ExistPost = await Post.findById(postId)
        if (!ExistPost)
            return next(appError(400, '資料錯誤', '尚未發布貼文'))

        const likes = await Post.findOneAndUpdate({ postId }, { $pull: { likes: user._id } }, { new: true })

        res.status(201).json(getHttpResponse({ data: likes, message: '移除按讚成功' }));
    })
}

module.exports = like