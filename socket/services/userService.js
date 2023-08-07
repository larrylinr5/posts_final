// @ts-nocheck
const ConversationUnreadRepository = require("../repositories/conversationUnreadRepository");
const UserRepository = require("../repositories/userRepository");
const { decodedUserId } = require("../middleware/auth");
module.exports = class UserService {
  async deleteUserConversation(
    { roomId, userId }
  ){
    const userQueries = new UserRepository();
    const updatedUser = await userQueries.deleteUserConversation({ roomId, userId });
  }

  async getChatroomList(token) {
    // console.log("getChatroomListHandler");
    const userInfo = await this.getUserInfoWhereUnread(token);
    return userInfo;
  }
  async getUserInfo(token) {
    // console.log("getUserInfo");
    const userInfo = await this.getUserInfoWhereUnread(token);
    return userInfo;
  }
  async getUserList(token) {
    // console.log("getUserList");
    const userRepository = new UserRepository();
    const userId = await decodedUserId(token);
    const users = userRepository.findAllUser(userId);
    return users;
  }
  async setUserStatusOnline(token) {
    // console.log("setOnlineStatus");
    const userRepository = new UserRepository();
    const userId = await decodedUserId(token);
    const user = await userRepository.updateUserStatus({
      userId: userId,
      status: "online",
    });
    return user;
  }
  async setUserStatusOffline(token) {
    // console.log("setUserStatusOffline");
    const userRepository = new UserRepository();
    const userId = await decodedUserId(token);
    const user = await userRepository.updateUserStatus({
      userId: userId,
      status: "offline",
    });
    return user;
  }

  async getUserInfoWhereUnread(token) {
    const userRepository = new UserRepository();
    const userId = await decodedUserId(token);
    let user = await userRepository.getUserInfoWhereConversationsAndParticipants(userId);

    // 為每個對話查詢對應的未讀計數
    if (user) {
      user = user.toObject();
      const conversationUnreadRepository = new ConversationUnreadRepository();
      for (let i = 0; i < user.conversations.length; i++) {
        const conversationUnread = await conversationUnreadRepository.findOneConversationUnread(
          {
            userId,
            conversationId: user.conversations[i]._id
          }
        );

        user.conversations[i].unreadCount = conversationUnread ? conversationUnread.unreadCount : 0;
      }
    }

    if (user) {
      return user;
    }
    return Error("User 不存在");
  }
};