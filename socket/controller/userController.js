const ConversationUnread = require("../../models/conversationUnreadModel");
const User = require("../../models/userModel");
const { decodedUserId } = require("../middleware/auth");
const ConversationUnreadRepository = require("../repositories/conversationUnreadRepository");
const UserRepository = require("../repositories/userRepository");
const SocketResponse = require("../response/response");
const UserService = require("../services/userService");
const users = {
  // async isUserExist(token){
  //   try {
  //     const userId = await decodedUserId(token);
  //     const user = await User.findOne({
  //       _id: userId,
  //       logicDeleteFlag: false,
  //     });
  //     if(user){
  //       return true;
  //     }
  //     throw Error("User 不存在");

  //   } catch (error) {
  //     console.log(error);
  //     return false;
  //   }
  // }
  getChatroomListHandler: async (io, socket, { token }) => {
    console.log("getChatroomListHandler");
    const userService = new UserService();
    const userInfo = await userService.getChatroomList(token);
    const response = new SocketResponse({
      statusCode: "success",
      message: "",
      data: userInfo,
      error: null,
    });
    io.to(`${socket.id}`).emit("getChatroomListResponse", response);
  },
  // 重構的部分
  getUserInfoHandler: async (socket, { token }) => {
    console.log("getUserInfo");
    const userService = new UserService();
    const userInfo = userService.getUserInfo(token);
    const response = new SocketResponse({
      statusCode: "success",
      message: "",
      data: userInfo,
      error: null,
    });
    socket.emit("getUserInfoResponse", response);
  },
  getUserListHandler: async (socket, { token }) => {
    console.log("getUserList");
    const userService = new UserService();
    const userList = await userService.getUserList(token);
    const response = new SocketResponse({
      statusCode: "success",
      message: "",
      data: userList,
      error: null,
    });
    socket.emit("getUserListResponse", response);
  },
  setOnlineStatusHandler: async (socket, { token }) => {
    console.log("setOnlineStatusHandler");
    const userService = new UserService();
    const user = await userService.setUserStatusOnline(token);
    console.log("user", user);
    // 操作成功，向客户端发送成功的消息
    const response = new SocketResponse({
      statusCode: "success",
      message: "",
      data: user,
      error: null,
    });
    socket.broadcast.emit("updateUserStatusResponse", response);
  },

  setOfflineStatusHandler: async (socket) => {
    console.log("setOnlineStatusHandler");
    const userService = new UserService();
    const user = userService.setUserStatusOffline();
    // socket.broadcast.emit("updateUserStatusResponse", user);

    // 操作成功，向客户端发送成功的消息
    const response = new SocketResponse({
      statusCode: "success",
      message: "",
      data: user,
      error: null,
    });
    socket.broadcast.emit("updateUserStatusResponse", response);
  },
  // async deleteUserConversation({ roomId, token }) {
  //   console.log("leaveConversation", roomId);
  //   const userService = new UserService();
  //   const userId = await decodedUserId(token);
  //   const updatedUser = await userService.deleteUserConversation({ roomId, userId });
  //   return updatedUser;
  // },
};

module.exports = users;
