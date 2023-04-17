const Conversation = require("../../models/conversationModel");
const User = require("../../models/userModel");
const { decodedUserId } = require("../middleware/auth");
const conversations = {
  async createConversation({ displayName, token }) {
    const userId = await decodedUserId(token);
    const conversation = await Conversation.create({
      displayName: displayName,
      participants: [userId],
    });
    const query = { _id: userId, logicDeleteFlag: false };
    const updateDocument = {
      $addToSet: { conversations: conversation._id },
      upsert: true,
      returnOriginal: false,
      runValidators: true,
    };
    
    const updatedUser = await User.updateOne(query, updateDocument);
    if (updatedUser?.acknowledged === true && updatedUser?.modifiedCount === 0) {
      throw Error("已添加過 conversation");
    }
  },

  async findConversation({ roomId, token }){
    const userId = await decodedUserId(token);
    const conversation = await Conversation.findOne({
      _id: roomId,
      participants: { $in: [userId]},
      logicDeleteFlag: false
    });
    if(conversation){
      return conversation;
    }
    throw Error("沒找到 conversation");
  },

  async findParticipants({ roomId }){
    console.log("roomId----", roomId);
    const conversation = await Conversation.findOne({
      _id: roomId,
      logicDeleteFlag: false
    }).populate({
      path: "participants",
      select: "nickName avatar userStatus",
    });
    console.log("123",conversation);
    if(conversation){
      return conversation;
    }
    throw Error("沒找到 conversation");
  },

  async addParticipant({ roomId, userId }){
    const conversationQuery = { _id: roomId, logicDeleteFlag: false };
    const conversationUpdateDocument = {
      $addToSet: { participants: userId },
      upsert: true,
      returnOriginal: false,
      runValidators: true,
    };
    const updatedConversation = await Conversation.updateOne(conversationQuery,conversationUpdateDocument);
    if (updatedConversation?.acknowledged === true && updatedConversation?.modifiedCount === 0) {
      throw Error("已添加到conversation collection");
    }
console.log("roomId",roomId);
    const userQuery = { _id: userId, logicDeleteFlag: false };
    const userUpdateDocument = {
      $addToSet: { conversations: roomId },
      upsert: true,
      returnOriginal: false,
      runValidators: true,
    };
    
    const updatedUser = await User.updateOne(userQuery, userUpdateDocument);
    if (updatedUser?.acknowledged === true && updatedUser?.modifiedCount === 0) {
      throw Error("已添加過 user collection");
    }
  }
};

module.exports = conversations;
