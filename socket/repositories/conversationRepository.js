const Conversation = require("../../models/conversationModel");

module.exports = class ConversationRepository {
  async findParticipants(roomId) {
    const conversation = await Conversation.findOne({
      _id: roomId,
      logicDeleteFlag: false,
    }).populate({
      path: "participants",
      select: "nickName avatar userStatus",
    });

    if (conversation) {
      return conversation;
    }
    throw Error("沒找到 conversation");
  }

  async findConversation({ roomId, userId }) {
    const conversation = await Conversation.findOne({
      _id: roomId,
      participants: { $in: [userId] },
      logicDeleteFlag: false,
    });
    if (conversation) {
      return conversation;
    }
    throw Error("沒找到 conversation");
  }

  async findOneAndUpdate({ roomId, userId }, opts) {
    const newOpts = { ...opts, new: true };
    const updatedConversation = await Conversation.findOneAndUpdate(
      {
        _id: roomId,
      },
      {
        $pull: { participants: userId },
      },
      newOpts
    );
    if (updatedConversation) {
      return updatedConversation;
    }
    throw Error("沒找到 conversation");
  }

  async createConversation({ displayName, userId }, opts) {
    const conversations = await Conversation.create([{
      displayName: displayName,
      participants: [userId],
    }], opts);
    if(conversations && conversations.length > 0){
      return conversations[0];
    }
    throw Error("沒找到 conversation");
  }

  async addUserInConversation({ roomId, userId }, opts) {
    const conversationQuery = { _id: roomId, logicDeleteFlag: false };
    const conversationUpdateDocument = {
      $addToSet: { participants: userId },
    };
  
    const updateOptions = {
      upsert: true,
      new: true,
      runValidators: true,
      ...opts
    };
  
    const updatedConversation = await Conversation.findOneAndUpdate(
      conversationQuery,
      conversationUpdateDocument,
      updateOptions
    );
  
    if (!updatedConversation) {
      throw Error("已添加到conversation collection");
    }
  
    return updatedConversation;
  }
  
  
};
