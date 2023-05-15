const ChatMessages = require("../../models/chatMessagesModel");
const User = require("../../models/userModel");
const { decodedUserId } = require("../middleware/auth");
const SocketResponse = require("../response/response");
const chatMessages = {
  getMessagesHandler: async (socket, {roomId, userId}) => {
    console.log("getMessages", roomId, userId);
    if(!roomId){
      throw Error("找不到 roomId");
    }
    if(!userId){
      throw Error("找不到 userId");
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
