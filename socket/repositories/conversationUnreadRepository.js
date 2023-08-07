const ConversationUnread = require("../../models/conversationUnreadModel");
module.exports = class ConversationUnreadRepository {
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

  async deleteOneConversationUnread({ roomId, userId }, opts) {
    const updatedConversationUnread = await ConversationUnread.updateOne(
      {
        conversationId: roomId,
        userId: userId,
      },
      {
        $set: { logicDeleteFlag: true },
      },
      opts
    );

    if (!updatedConversationUnread) {
      throw Error("刪除資料失敗");
    }
    return updatedConversationUnread;
  }

  async updateOneConversationUnread({ roomId, userId }, opts) {
    let conversationUnreadQuery = {
      // @ts-ignore
      conversation: roomId,
      user: userId,
    }; // 查詢條件
    let update = {
      logicDeleteFlag: false,
    }; // 要更新或創建的資料
    let options = {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      ...opts,
    }; // 選項

    // 進行查找並更新，如果沒有找到則創建
    const unreadResult = await ConversationUnread.findOneAndUpdate(
      conversationUnreadQuery,
      update,
      options
    );

    if (!unreadResult) {
      throw Error("建立資料失敗");
    }
    return unreadResult;
  }

  async findOneAndUpdateOrCreateConversationUnread({ roomId, userId }, opts) {
    let query = {
      conversation: roomId,
      user: userId,
    }; // 查詢條件
    let update = {
      logicDeleteFlag: false,
    }; // 要更新或創建的資料
    let options = {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      ...opts,
    }; // 選項

    // 進行查找並更新，如果沒有找到則創建
    const unreadResult = await ConversationUnread.findOneAndUpdate(
      query,
      update,
      options
    );
    if (!unreadResult) {
      throw Error("找不到未讀資料");
    }
    return unreadResult;
  }


  async findOneAndUpdateUnreadCount({ roomId, userId }, opts) {
    let options = {
      new: true,
      ...opts,
    }; // 選項
    const updatedConversation = await ConversationUnread.findOneAndUpdate(
      {
        conversation: roomId,
        user: userId,
        logicDeleteFlag: false
      },
      {
        $set: {
          unreadCount: 0
        }
      },
      options
    );
    return updatedConversation;
  }

  async findOneConversationUnread({userId, conversationId}){
    const conversationUnread = await ConversationUnread.findOne({
      conversation: conversationId,
      user: userId,
      logicDeleteFlag: { $eq: false },
    });
    return conversationUnread;
  }
};
