const mongoose = require('mongoose');

// 建立 Schema
const followSchema = new mongoose.Schema(
  {
    // 設計稿 4.追蹤名單
    editor: { // 自己
      type: mongoose.Schema.ObjectId,
      ref: "User",
      select: false
    },
    following: { // 別人
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
  },
  {
    versionKey: false
  }
);

// 建立 Model
const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;