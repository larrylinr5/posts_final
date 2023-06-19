// import ChatMessages from "../../models/chatMessagesModel";
const ConversationUnread = require("../../models/conversationUnreadModel");
module.exports = class ConversationUnreadQueries {
  /**
    更新多個未讀計數
    @param {object} params - 參數物件
    @param {string} params.roomId - 房間 ID
    @param {string} params.userId - 使用者 ID
    @param {object} opts - 可選參數
    @returns {Promise} - 回傳一個 Promise 物件
  */
  updateManyUnreadCount({ roomId, userId }, opts) {
    // @ts-ignore
    return ConversationUnread.updateMany(
      {
        conversation: roomId,
        user: { $ne: userId }, // Exclude the sender
        logicDeleteFlag: false,
      },
      {
        $inc: { unreadCount: 1 }, // Use the $inc operator to increase the value of unreadCount
      },
      opts
    );
  }
};
