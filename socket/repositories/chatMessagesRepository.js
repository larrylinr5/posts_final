const ChatMessages = require("../../models/chatMessagesModel");
module.exports = class ChatMessagesQueries {
  /**
    創建訊息
    @param {object} message - 訊息物件
    @param {string} message.roomId - 房間 ID
    @param {string} message.userId - 使用者 ID
    @param {string} message.text - 訊息文字
    @param {string} message.image - 訊息圖片
    @param {object} opts - 可選參數
    @returns {Promise} - 回傳一個 Promise 物件
  */
  createMessage({ roomId, userId, text, image }, opts) {
    return ChatMessages.create(
      [
        {
          conversation: roomId,
          sender: userId,
          text: text,
          image: image,
        },
      ],
      opts
    );
  }

  findOne(createdMessageId, opts) {
    return ChatMessages.findOne(
      {
        _id: createdMessageId,
        logicDeleteFlag: false,
      },
      null,
      opts
    ).populate({
      path: "sender",
      select: "nickName avatar",
    });

  }

  /**
   * 查詢訊息
   * @param {string} roomId - 房間 ID
   * @returns {Promise} - 回傳一個 Promise 物件
  */
  findMessages(roomId, opts){
    // @ts-ignore
    return ChatMessages.find({
      conversation: roomId,
      logicDeleteFlag: false,
    }, null, opts).populate({
      path: "sender",
      select: "nickName avatar",
    });
  }
};
