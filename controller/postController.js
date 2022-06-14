const mongoose = require("mongoose");
const { appError, handleErrorAsync } = require("../utils/errorHandler");
const getHttpResponse = require("../utils/successHandler");
const validator = require("validator");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");

const posts = {
  // 取得所有貼文或特定會員的所有貼文
  getAllPosts: handleErrorAsync(async (req, res) => {
    const {
      query,
      params: {
        userId
      }
    } = req;
    const currentPage = query.currentPage ? Math.max(0, Number(query.currentPage - 1)) : 0;
    const perPage = query.perPage ? Number(query.perPage) : 10;
    let querySortType = query.sort || "desc";

    /* init default response*/
    let data = {
      list: [],
      page: {
        totalPages: null,
        currentPage: null,
        perPage: null,
        totalDatas: null,
        has_pre: false,
        has_next: false
      }
    };
    let message = "請輸入搜尋條件";

    if(querySortType){
      if(querySortType === "asc" || querySortType === "desc"){
        const queryString = query.q !== undefined
          ? {
            "logicDeleteFlag": false,
            $or: [
              { "content": new RegExp(query.q.trim()) }
            ]
          }
          : {
            "logicDeleteFlag": false
          };
        if (userId) {
          queryString.editor = userId;
        }
        // 排序條件，先後順序有差
        const selectedSortRule = {};
        selectedSortRule.createdAt = querySortType === "asc" ? 1 : querySortType === "desc" ? -1 : "desc";
        const sortRule = {
          ...selectedSortRule,
          "id": -1  // 確保當 perPage 為 1 時，能找到正確值
        };

        // 向 DB 取得目標貼文資料
        const populateQuery = [
          {
            path: "editor",
            select: "nickName avatar"
          },
          {
            path: "comments",
            select: "editor comment createdAt updatedAt",
            match: { logicDeleteFlag: false },
            options: {
              sort: { "createdAt": -1 }
            },
            populate: {
              path: "editor",
              select: "nickName avatar"
            }
          }
        ];

        const targetPosts = await Post.find(queryString).populate(populateQuery).skip(currentPage * perPage).limit(perPage).sort(sortRule);

        const total = await Post.find(queryString).countDocuments();
        const totalPages = Math.ceil(total / perPage);

        message = targetPosts.length === 0 ? "搜尋無資料" : "成功取得搜尋貼文";
        data = {
          list: targetPosts,
          page: {
            totalPages,
            currentPage: currentPage + 1,
            perPage,
            totalDatas: total,
            has_pre: total === 0 ? false : currentPage + 1 > 1,
            has_next: total === 0 ? false : currentPage + 1 < totalPages
          }
        };
      }

      if(querySortType === "hot"){
        const matchRule = { $match: { logicDeleteFlag: false }};
        
        if(query.q){
          matchRule.$match["content"] = new RegExp(query.q.trim());
        }

        if(userId) {
          matchRule.$match["editor"] = mongoose.Types.ObjectId(userId);
        }

        const aggregationResult = await Post.aggregate([
          matchRule,
          {
            $lookup: {
              from: "users",
              localField: "editor",
              foreignField: "_id",
              as: "editor",
            },
          },
          { $unwind: "$editor"},
          {
            $project: {
              _id: 1,        
              editor: {
                _id: 1,
                nickName: 1,
                avatar: 1
              },
              content: 1,
              comments: 1,
              image: 1,
              likes: 1,
              createdAt: 1,
              updatedAt: 1,
              likesLength: { $size: "$likes" }
            }
          },
          { $sort: { likesLength: -1 } },
          { $skip: currentPage * perPage },
          { $limit: perPage }
        ]);

        await Post.populate(aggregationResult, {
          path: "comments",
          select: "editor comment createdAt updatedAt",
          match: { logicDeleteFlag: false },
          options: {
            sort: { "createdAt": -1 }
          },
          populate: {
            path: "editor",
            select: "nickName avatar"
          }
        });

        const rawTotal = await Post.aggregate([
          matchRule,
          { $count: "Total" }
        ]);
        const total = rawTotal[0]?.Total || 0;
        const totalPages = Math.ceil(total / perPage);

        message = aggregationResult.length === 0 ? "搜尋無資料" : "成功取得搜尋貼文";
        data = {
          list: aggregationResult.map(({likesLength, ...keepAttrs}) => keepAttrs),
          page: {
            totalPages,
            currentPage: currentPage + 1,
            perPage,
            totalDatas: total,
            has_pre: total === 0 ? false : currentPage + 1 > 1,
            has_next: total === 0 ? false : currentPage + 1 < totalPages
          }
        };
      }
    }

    res.status(200).json(getHttpResponse({
      data, message
    }));
  }),
  // 新增一則貼文
  postOnePost: handleErrorAsync(async (req, res, next) => {
    const {
      user,
      body: {
        content,
        image
      }
    } = req;

    // 判斷圖片開頭是否為 http
    if (image && image.length > 0) {
      image.forEach(function (item) {
        let result = item.split(":");
        if (!validator.equals(result[0], "https")) {
          return next(appError(400, "40001", "圖片格式不正確!"));
        }
      });
    }
    if (!content) {
      return next(appError(400, "40001", "欄位未填寫正確!"));
    }

    const newPost = await Post.create({ editor: user, content, image });
    const postPost = await Post.findById(newPost._id).populate({
      path: "editor",
      select: "nickName avatar",
    }).select("-logicDeleteFlag");
    res.status(201).json(getHttpResponse({
      data: postPost
    }));
  }),
  // 修改一則特定貼文
  patchOnePost: handleErrorAsync(async (req, res, next) => {
    const {
      user,
      body: {
        content,
        image
      },
      params: {
        postId
      }
    } = req;

    if (!(postId && mongoose.Types.ObjectId.isValid(postId)))
      return next(appError(400, "40002", "請傳入特定貼文"));
    // 判斷圖片開頭是否為 http
    if (image && image.length > 0) {
      image.forEach(function (item) {
        let result = item.split(":");
        if (!validator.equals(result[0], "https")) {
          return next(appError(400, "40001", "圖片格式不正確!"));
        }
      });
    }
    if (!content) {
      return next(appError(400, "40001", "欄位未填寫正確!"));
    }

    const ExistPost = await Post.findById(postId).exec();
    if (!ExistPost) {
      return next(appError(400, "40010", "尚未發布貼文!"));
    }
    if (ExistPost.editor.toString() !== user._id.toString()) {
      return next(appError(400, "40004", "您無權限編輯此貼文"));
    }

    await Post.findByIdAndUpdate(postId, { content, image });
    const patchPost = await Post.findById(postId).populate({
      path: "editor",
      select: "nickName avatar",
    }).select("-logicDeleteFlag");
    res.status(201).json(getHttpResponse({
      data: patchPost
    }));
  }),
  // 刪除一筆貼文
  deleteOnePost: handleErrorAsync(async (req, res, next) => {
    const {
      user,
      params: {
        postId
      }
    } = req;

    if (!(postId && mongoose.Types.ObjectId.isValid(postId))) {
      return next(appError(400, "40002", "請傳入特定貼文"));
    }

    const filter = {
      "_id": postId,
      "logicDeleteFlag": 0
    };
    const existPost = await Post.findOne(filter);
    if (!existPost) {
      return next(appError(400, "40010", "無此貼文!"));
    }

    if (existPost.editor.toString() !== user._id.toString()) {
      return next(appError(400, "40004", "您無權限編輯此貼文"));
    }

    // 執行刪除 Post，把 logicDeleteFlag 設為 true
    await Post.findOneAndUpdate(
      {
        "_id": postId
      },
      {
        $set: { "logicDeleteFlag": true }
      }
    );

    // 執行刪除 Comments，把 logicDeleteFlag 設為 true
    await Comment.updateMany(
      {
        _id: { $in: existPost.comments }
      },
      {
        $set: { "logicDeleteFlag": true }
      }
    );
    res.status(201).json(getHttpResponse({
      message: "刪除貼文成功!"
    }));
  })
};

module.exports = posts;