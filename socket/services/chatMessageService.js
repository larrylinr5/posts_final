// @ts-nocheck
const { transactionHandler } = require("../utils/commitHandler");
const ConversationUnreadQueries = require("../repositories/conversationUnreadRepository");
const ChatMessagesQueries = require("../repositories/chatMessagesRepository");
module.exports = class ChatMessageService {
  async setChatMessages({ roomId, userId, text, image = "" }) {
    return transactionHandler(async (session) => {
      const chatMessagesQueries = new ChatMessagesQueries();
      const conversationUnreadQueries = new ConversationUnreadQueries();
      const opts = { session, upsert: true, returnOriginal: false };

      const createdMessages = await chatMessagesQueries.createMessage({ roomId, userId, text, image }, opts);
      await conversationUnreadQueries.updateManyUnreadCount({
        roomId,
        userId,
      }, opts);
      const createdMessage = createdMessages[0];
      // 這裡不再需要 `findOne` 來尋找剛創建的訊息
      const newMessage = await chatMessagesQueries.findOne(
        createdMessage._id,
        {session}
      );
      // 檢查 newMessage 是否為 null 或 undefined
      if (!newMessage) {
        throw new Error(`Could not find message with ID ${createdMessage._id}`);
      }

      return newMessage;
    });
  }

  getMessages(roomId){
    return transactionHandler(async (session) => {
      const chatMessagesQueries = new ChatMessagesQueries();
      const opts = { session };
      return chatMessagesQueries.findMessages(roomId, opts);
    });
    
  }
};