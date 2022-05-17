// models/UsersModel.js
const mongoose = require('mongoose')

// 建立 Schema
const usersSchema = new mongoose.Schema(
  {
    nickName: {
      type: String,
      required: [true, '請填寫暱稱'],
    },
    gender: {
      // (原始) true:male, false:female
      // (討論) 男性存 0，女性存 1，跨性別存 2
      type: Number,
      default: 0,
      enum: [0, 1, 2],
    },
    avatar: {
      type: String,
    },
    email: {
      type: String,
      required: [true, '請填寫 Email'],
      unique: true,
      lowercase: true,
      select: false,
    },
    password: {
      type: String,
      required: [true, '請填寫密碼'],
      minlength: 8,
      select: false,
    },
    // 設計稿 4.追蹤名單
    follower: {
      // 別人 -> 自己
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    following: {
      // 自己 -> 別人
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    logicDeleteFlag: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  }
)

// 建立 Model
const User = mongoose.model('User', usersSchema)

module.exports = User
