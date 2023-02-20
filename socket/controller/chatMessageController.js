const ChatMessages = require("../../models/chatMessagesModel");
const User = require("../../models/userModel");
const { decodedUserId } = require("../middleware/auth");
const chatMessages = {
  async getChatMessage({ roomId }) {
    const messages = await ChatMessages.find({
      conversation: roomId,
      logicDeleteFlag: false,
    }).populate({
      path: "sender",
      select: "nickName avatar",
    });
    return messages;
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
