const ChatMessages = require("../../models/chatMessagesModel");
const ConversationUnread = require("../../models/conversationUnreadModel");
// @ts-ignore
const User = require("../../models/userModel");
const { transactionHandler } = require("../../utils/commitHandler");
// @ts-ignore
const { decodedUserId } = require("../middleware/auth");
const SocketResponse = require("../response/response");
const ChatMessageService = require("../services/chatMessageService");
const chatMessages = {
  chatHandler: async (io, data) => {
    console.log("chat", data);
    // 更新資料庫跟顯示的時間差會不會有bug
    // @ts-ignore
    const chatMessageService = new ChatMessageService();
    const chatMessage = await chatMessageService.setChatMessages(data);
    console.log("chatMessage", chatMessage);
    // 操作成功，向客户端发送成功的消息
    const response = new SocketResponse({
      statusCode: "success",
      message: "",
      data: chatMessage,
      error: null,
    });
    io.sockets.in(data.roomId).emit("chatResponse", response);
  },
  getMessagesHandler: async (socket, { roomId }) => {
    console.log("getMessages", roomId);
    if (!roomId) {
      throw Error("找不到 roomId");
    }
    const messages = await ChatMessages.find({
      conversation: roomId,
      logicDeleteFlag: false,
    }).populate({
      path: "sender",
      select: "nickName avatar",
    });

    // 操作成功，向客户端发送成功的消息
    const response = new SocketResponse({
      statusCode: "success",
      message: "",
      data: messages,
      error: null,
    });
    socket.emit("getMessagesResponse", response);
  },
  
};

module.exports = chatMessages;
