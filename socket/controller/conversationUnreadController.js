const ConversationUnread = require("../../models/conversationUnreadModel");

const conversationUnread = {
  resetUnreadCountHandler: async (socket, {roomId, userId}) => {
    const updatedConversation = await ConversationUnread.findOneAndUpdate(
      {
        conversation: roomId,
        participants: { $in: [userId]},
        logicDeleteFlag: false
      },
      {
        $set: {
          unreadCount: 0
        }
      },
      {
        new: true
      }
    );
    return updatedConversation;
  }
};

module.exports = conversationUnread;