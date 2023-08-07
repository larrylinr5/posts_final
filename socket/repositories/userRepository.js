const User = require("../../models/userModel");
module.exports = class UserRepository {
  async deleteUserConversation({ roomId, userId }, opts) {
    const newOpts = { ...opts, new: true };
    const updateUser = await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $pull: { conversations: roomId },
      },
      newOpts
    );
    if (updateUser) {
      return updateUser;
    }
    throw Error("更新失敗");
  }

  async addConversationToUser({ roomId, userId }, opts) {
    const query = { _id: userId, logicDeleteFlag: false };
    const updateDocument = {
      $addToSet: { conversations: roomId },
      upsert: true,
      returnOriginal: false,
      runValidators: true,
    };

    const updatedUser = await User.updateOne(query, updateDocument, opts);
    if (
      updatedUser?.acknowledged === true &&
      updatedUser?.modifiedCount === 0
    ) {
      throw Error("已添加過 conversation");
    }
  }

  async setConversationAndConversationUnread(
    { roomId, userId, conversationUnreadId },
    opts
  ) {
    const userQuery = { _id: userId, logicDeleteFlag: false };
    const userUpdateDocument = {
      $addToSet: {
        conversations: roomId,
        conversationUnread: conversationUnreadId,
      },
    };

    const updateOptions = {
      upsert: true,
      new: true, // 請注意，Mongoose 中的 'returnOriginal' 是 'new' 選項
      runValidators: true,
      ...opts,
    };

    const updatedUser = await User.updateOne(
      userQuery,
      userUpdateDocument,
      updateOptions
    );
    if (
      updatedUser?.acknowledged === true &&
      updatedUser?.modifiedCount === 0
    ) {
      throw Error("已添加過 user collection");
    }
  }

  async findAllUser(userId) {
    const users = await User.find({
      _id: { $ne: userId },
      logicDeleteFlag: false,
    }).sort({
      userStatus: -1,
    });
    if (users.length === 0) {
      return Error("User 不存在");
    }
    return users;
  }

  async getUserInfoWhereConversationsAndParticipants(userId) {
    let user = await User.findOne({
      _id: userId,
      logicDeleteFlag: false,
    }).populate({
      path: "conversations",
      select: "displayName participants _id",
      match: {
        logicDeleteFlag: { $eq: false },
      },
      populate: {
        path: "participants",
        select: "nickName avatar userStatus",
        match: {
          logicDeleteFlag: { $eq: false },
        },
      },
    });

    if (user) {
      return user;
    }
    return Error("User 不存在");
  }

  async updateUserStatus({
    userId,
    status
  }){
    const user = await User.findOneAndUpdate({
      _id: userId,
      logicDeleteFlag: false,
    }, {
      userStatus: status
    }, { new: true });
    if (user) {
      return user;
    }
    return Error("User 不存在");
  }
};
