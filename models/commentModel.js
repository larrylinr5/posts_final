const mongoose = require('mongoose')

// 建立 Schema
const commentSchema = new mongoose.Schema(
  {
    editor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, '請填寫創作者 ID'],
    },
    comment: {
      type: String,
      trim: true,
      required: [true, '請填寫留言內容'],
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    logicDeleteFlag: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    versionKey: false,
  }
)

// 建立 Model
const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
