const ChatMessages = require("../../models/chatMessagesModel");
const ConversationUnread = require("../../models/conversationUnreadModel");
// @ts-ignore
const User = require("../../models/userModel");
const { transactionHandler } = require("../../utils/commitHandler");
// @ts-ignore
const { decodedUserId } = require("../middleware/auth");
const SocketResponse = require("../response/response");
const chatMessages = {
  chatHandler: async (io, data) => {
    console.log("chat", data);
    // 更新資料庫跟顯示的時間差會不會有bug
    const chatMessage = await chatMessages.setChatMessages(data);
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
  async setChatMessages({ roomId, userId, text, image = "" }) {
    return await transactionHandler(async (session) => {
      const opts = { session, upsert: true, returnOriginal: false };

      const createdMessages = await ChatMessages.create(
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

      // Update all users (except the sender) in the same conversation and increase their unreadCount
      await ConversationUnread.updateMany(
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

      const createdMessage = createdMessages[0];

      // 這裡不再需要 `findOne` 來尋找剛創建的訊息
      const newMessage = await ChatMessages.findOne(
        {
          _id: createdMessage._id,
          logicDeleteFlag: false,
        },
        null,
        { session }  // 加入這行
      ).populate({
        path: "sender",
        select: "nickName avatar",
      });
      
      // 檢查 newMessage 是否為 null 或 undefined
      if (!newMessage) {
        throw new Error(`Could not find message with ID ${createdMessage._id}`);
      }
      
      return newMessage;
    });
  },
};

module.exports = chatMessages;
