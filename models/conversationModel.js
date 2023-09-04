const mongoose = require("mongoose");

// 建立 Schema
const conversationSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: [true, "請填寫聊天室名稱"],
    },
    participants: {
      type: [{
        type: mongoose.Schema.ObjectId,
        ref: "User",
      }],
      required: [true, "請添加成員ID"],
    },
    conversationUnreadList: [
      {
        type: [{
          // @ts-ignore
          type: mongoose.Schema.ObjectId,
          ref: "ConversationUnread",
        }],
      }
    ],
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
const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
