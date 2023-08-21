// @ts-nocheck
const { transactionHandler } = require("../utils/commitHandler");
const ConversationUnreadRepository = require("../repositories/conversationUnreadRepository");
module.exports = class ConversationUnreadService {
  async resetUnreadCount({ roomId, userId }) {
    return transactionHandler(async (session) => {
      const conversationUnreadRepository = new ConversationUnreadRepository();
      const updatedConversation =
        await conversationUnreadRepository.findOneAndUpdateUnreadCount(
          {
            roomId,
            userId,
          },
          {
            session,
          }
        );

      return updatedConversation;
    });
  }
};
