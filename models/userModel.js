// models/UsersModel.js
const mongoose = require("mongoose");

// 建立 Schema
const usersSchema = new mongoose.Schema(
  {
    nickName: {
      type: String,
      required: [true, "請填寫暱稱"],
      trim: true
    },
    gender: {
      // 男性存 0，女性存 1，跨性別存 2
      type: Number,
      default: 0,
      enum: [0, 1, 2],
    },
    avatar: {
      type: String,
      trim: true,
      default: ""
    },
    email: {
      type: String,
      required: [true, "請填寫 Email"],
      unique: true,
      lowercase: true,
      select: false,
      trim: true
    },
    password: {
      type: String,
      required: [true, "請填寫密碼"],
      minlength: 8,
      select: false,
      trim: true
    },
    userStatus: {
      type: String,
      default: "offline",
      enum: [{
        values: ["online", "offline"],
        message: "不支援這個 {VALUE} 屬性"
      }],
    },
    conversations: {
      type: [{
        // @ts-ignore
        type: mongoose.Schema.ObjectId,
        ref: "Conversation",
      }],
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
    versionKey: false
  }
);

// 建立 Model
const User = mongoose.model("User", usersSchema);

module.exports = User;
