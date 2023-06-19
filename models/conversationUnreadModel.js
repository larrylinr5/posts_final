const mongoose = require("mongoose");

// 建立 Schema
const conversationUnreadSchema = new mongoose.Schema(
  {
    conversation: {
      // @ts-ignore
      type: mongoose.Schema.ObjectId,
      ref: "Conversation",
      required: true,
    },
    user: {
      // @ts-ignore
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
    lastSeenAt: {
      type: Date,
      required: [true, "請輸入最後查看時間"],
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
);

// 建立 Model
const ConversationUnread = mongoose.model("ConversationUnread", conversationUnreadSchema);

module.exports = ConversationUnread;
