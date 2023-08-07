const { decodedUserId } = require("../middleware/auth");
const SocketResponse = require("../response/response");
const ConversationUnreadService = require("../services/conversationUnreadService");

const conversationUnread = {
  resetUnreadCountHandler: async (io, socket, { roomId, token }) => {
    const userId = await decodedUserId(token);
    const conversationUnreadService = new ConversationUnreadService();
    const updatedConversation = await conversationUnreadService.resetUnreadCount({
      roomId: roomId,
      userId: userId,
    });
    const response = new SocketResponse({
      statusCode: "success",
      message: "",
      data: updatedConversation,
      error: null,
    });
    io.to(`${socket.id}`).emit("updateUnreadCount", response);
  },

  
};

module.exports = conversationUnread;
