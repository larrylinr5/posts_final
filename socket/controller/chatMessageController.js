const ChatMessages = require("../../models/chatMessagesModel");
const User = require("../../models/userModel");
const { decodedUserId } = require("../middleware/auth");
const SocketResponse = require("../response/response");
const chatMessages = {
  chatHandler: async (io, data) => {
    console.log("chat", data);
    // 更新資料庫跟顯示的時間差會不會有bug
    const chatMessage = await chatMessages.setChatMessages(data);
    // 操作成功，向客户端发送成功的消息
    const response = new SocketResponse({
      statusCode: "success",
      message: "",
      data: chatMessage,
      error: null
    });
    io.sockets.in(data.roomId).emit("chatResponse", response);
  },
  getMessagesHandler: async (socket, {roomId}) => {
    console.log("getMessages", roomId);
    if(!roomId){
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
      error: null
    });
    socket.emit("getMessagesResponse", response);
  },
  async setChatMessages({ roomId, userId, text, image = "" }) {
    const updatedMessage = await ChatMessages.create({
      conversation: roomId,
      sender: userId,
      text: text,
      image: image,
    });

    const newMessage = await ChatMessages.findOne({
      _id: updatedMessage._id,
      logicDeleteFlag: false
    }).populate({
      path: "sender",
      select: "nickName avatar",
    });
    
    return newMessage;
  },
};

module.exports = chatMessages;
