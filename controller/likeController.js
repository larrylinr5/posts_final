const { appError, handleErrorAsync } = require('../utils/errorHandler');
const getHttpResponse = require('../utils/successHandler');
const Post = require('../models/postModel')

const like = {
    getUserLikeList: handleErrorAsync(async(req, res, next) => {

        const { user, query } = req
        const keyword = query.keyword ? query.keyword : ''
        let page = Number(query.page - 1) // 當前頁數
        let pageNum = query.pageNum ? Number(query.pageNum) : 10 // 一頁顯示幾筆資料

        // 搜尋條件
        const filter = {
            '$in': user._id,
            'likes.0': { $exists: true },
            $or: [
                { content: { $regex: keyword } },
            ],
        }

        // 倒序: desc，升序: asc
        const sort = query.sort === 'desc' ? -1 : query.sort === 'asc' ? 1 : 'asc'
            // 用戶有按讚的所有貼文，隱藏comments欄位
        const userAllPost = await Post.find(filter, { 'comments': false }).populate({ path: 'editor', select: 'nickName avatar' }).skip(page).limit(pageNum).sort({ 'createdAt': sort })

        let total = userAllPost.length // 總資料筆數
        let totalPages = Math.ceil(userAllPost.length / pageNum) // 一共顯示幾頁

        const resData = {
            list: userAllPost.length === 0 ? '您尚未按讚，故無該資料' : userAllPost,
            page,
            pageNum,
            total,
            totalPages
        }

        res.status(201).json(getHttpResponse(resData));
    }),

    addPostLike: handleErrorAsync(async(req, res, next) => {
        const { user, params: { postId } } = req

        await Post.findOneAndUpdate({ postId }, { $addToSet: { likes: user._id } })

        res.status(201).json(getHttpResponse({message: '加入按讚成功'}));
    }),

    delPostLike: handleErrorAsync(async(req, res, next) => {
        const { user, params: { postId } } = req

        await Post.findOneAndUpdate({ postId }, { $pull: { likes: user._id } })

        res.status(201).json(getHttpResponse({message: '移除按讚成功'}));
    })
}

module.exports = like