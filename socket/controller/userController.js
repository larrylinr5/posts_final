const User = require("../../models/userModel");
const { decodedUserId } = require("../middleware/auth");
const SocketResponse = require("../response/response");
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
  getChatroomListHandler: async (io, socket, socketUser) => {
    console.log("getChatroomListHandler");
    const userInfo = await socketUser.getUserInfo();
    const response = new SocketResponse({
      statusCode: "success",
      message: "",
      data: userInfo,
      error: null
    });
    io.to(`${socket.id}`).emit("getChatroomListResponse", response);
  },
  // 重構的部分
  getUserInfoHandler: async (socket, socketUser) => {
    console.log("getUserInfo");
    const userInfo = await socketUser.getUserInfo();
    const response = new SocketResponse({
      statusCode: "success",
      message: "",
      data: userInfo,
      error: null
    });
    socket.emit("getUserInfoResponse", response);
  },
  getUserListHandler: async (socket, socketUser) => {
    console.log("getUserList");
    const userList = await socketUser.getUserList();
    const response = new SocketResponse({
      statusCode: "success",
      message: "",
      data: userList,
      error: null
    });
    socket.emit("getUserListResponse", response);
  },
  setOnlineStatusHandler: async (socket, socketUser) => {
    console.log("setOnlineStatusHandler");
    // console.log("data", data);
    const user = await socketUser.setUserStatusOnline();
    // 操作成功，向客户端发送成功的消息
    const response = new SocketResponse({
      statusCode: "success",
      message: "",
      data: user,
      error: null
    });
    socket.broadcast.emit("updateUserStatusResponse", response);
  },

  setOfflineStatusHandler: async (socket, socketUser) => {
    console.log("setOnlineStatusHandler");
    const user = await socketUser.setUserStatusOffline();
    // socket.broadcast.emit("updateUserStatusResponse", user);

    // 操作成功，向客户端发送成功的消息
    const response = new SocketResponse({
      statusCode: "success",
      message: "",
      data: user,
      error: null
    });
    socket.broadcast.emit("updateUserStatusResponse", response);
  },
  async deleteUserConversation({ roomId, token }) {
    console.log("leaveConversation", roomId);
    const userId = await decodedUserId(token);
    const updateUser = await User.findOneAndUpdate(
      {
        _id: userId
      },
      {
        $pull: { conversations: roomId }
      },
      {
        new: true
      }
    );
    return updateUser;
  },

  async setUserStatus({token, status}){
    const userId = await decodedUserId(token);
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
  },

  async getUserInfo(token) {
    const userId = await decodedUserId(token);
    const user = await User.findOne({
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
    // console.log(user);
    if (user) {
      return user;
    }
    return Error("User 不存在");
  },
  /**
    * @param {string} token - The user status.
    */
  async findAllUser(token) {
    const userId = await decodedUserId(token);
    const users = await User.find({
      _id: { $ne: userId },
      logicDeleteFlag: false,
    });
    if(users.length === 0){
      return Error("User 不存在");
    }
    return users;
  },
};

module.exports = users;
