// @ts-nocheck
const { Server } = require("socket.io");
const { isAuthValid } = require("./middleware/auth");
const conversations = require("./controller/conversationController");
const chatMessages = require("./controller/chatMessageController");
const SocketResponse = require("./response/response");
const { handleSocketErrorAsync } = require("./utils/errorHandler");
const users = require("./controller/userController");
const conversationUnread = require("./controller/conversationUnreadController");
const UserService = require("./services/userService");
module.exports = class Socket {
  constructor(server) {
    this.io = require("socket.io")(server, {
      cors: {
        origin: "*",
      },
    });
    this.io.use(async (socket, next) => {
      if (await isAuthValid(socket.handshake.query?.token)) {
        next();
      } else {
        next(new Error("用戶驗證失敗"));
      }
    });
  }

  init() {
    this.connect();
  }

  connect() {
    this.io.on("connection", socket => {
      // console.log("----connection-----");
      var currentRoomId;
      socket.on("setOnlineStatus", handleSocketErrorAsync(socket, (...args) => users.setOnlineStatusHandler(socket, {
        token: socket.handshake.query?.token,
      })));

      socket.on("setOfflineStatus", handleSocketErrorAsync(socket, (...args) => users.setOnlineStatusHandler(socket, {
        token: socket.handshake.query?.token,
      })));

      socket.on("addUserInRoom", handleSocketErrorAsync(socket, ( ...args) => {
        const [ socketInstance, data] = args;
        const { roomId, userId } = data;
        return conversations.addUserInRoomHandler(socket, {roomId, userId});
      }));

      socket.on("getMessages", handleSocketErrorAsync(socket, ( ...args) => {
        const [ socketInstance, data] = args;
        const { roomId, userId } = data;
        return chatMessages.getMessagesHandler(socket, {roomId});
      }));

      socket.on("getUserList", handleSocketErrorAsync(socket, (...args) => users.getUserListHandler(socket, {
        token: socket.handshake.query?.token,
      })));

      socket.on("getUserInfo", handleSocketErrorAsync(socket, (...args) => users.getUserInfoHandler(socket, {
        token: socket.handshake.query?.token,
      })));

      socket.on("createChatroom", handleSocketErrorAsync(socket, ( ...args) => {
        const [ socketInstance, data] = args;
        const { displayName } = data;
        return conversations.createConversationHandler(this.io, socket, {
          displayName,
          token: socket.handshake.query?.token,
        });
      }));
      socket.on("leaveChatroom", handleSocketErrorAsync(socket, ( ...args) => {
        const [ socketInstance, data] = args;
        const { roomId } = data;
        return conversations.leaveConversationHandler(this.io, socket, {
          roomId,
          token: socket.handshake.query?.token,
        });
      }));

      socket.on("joinRoom", handleSocketErrorAsync(socket, ( ...args) => {
        const [ socketInstance, data] = args;
        const { roomId } = data;
        return conversations.joinRoomHandler(this.io, socket, {
          roomId,
          token: socket.handshake.query?.token,
        });
      }));

      socket.on("sendJoinRoomMessage", handleSocketErrorAsync(socket, ( ...args) => {
        const [ socketInstance, data] = args;
        const { roomId } = data;
        // console.log("sendJoinRoomMessage", roomId);
        const response = new SocketResponse({
          statusCode: "success",
          message: "",
          data: {
            userName: data.userName,
            message: `${data.userName} 使用者進入聊天室`,
          },
          error: null
        });
        socket.broadcast.to(roomId).emit("joinRoomMessage", response);
      }));

      socket.on("getChatroomList", handleSocketErrorAsync(socket, ( ...args) => users.getChatroomListHandler(this.io, socket, {token: socket.handshake.query?.token})));

      socket.on("chat", handleSocketErrorAsync(socket, (...args) => {
        const [ socketInstance, data] = args;
        const { roomId, userId, text, image } = data;
        chatMessages.chatHandler(this.io, { roomId, userId, text, image });
      }));

      socket.on("getParticipantList", handleSocketErrorAsync(socket, (...args) => {
        const [ socketInstance, data] = args;
        const { roomId } = data;
        conversations.getParticipantListHandler(socket, { roomId });
      }));

      socket.on("resetUnreadCount", handleSocketErrorAsync(socket, (...args) => {
        const [ socketInstance, data] = args;
        const { roomId } = data;
        conversationUnread.resetUnreadCountHandler(this.io, socket, { roomId, token: socket.handshake.query?.token });
      }));

      socket.on("disconnect", async () => {
        // 更新其他客戶端在該用戶下線後的該用戶狀態
        const userService = new UserService();
        const token= socket.handshake.query?.token;
        const user = await userService.setUserStatusOffline(token);

        const updateUserStatusResponse = new SocketResponse({
          statusCode: "success",
          message: "",
          data: user,
          error: null
        });
        socket.broadcast.emit("updateUserStatusResponse", updateUserStatusResponse);

        const leaveRoomMessageResponse = new SocketResponse({
          statusCode: "success",
          message: "",
          data: {
            userName: user.nickName,
            message: `${user.nickName} 下線`,
          },
          error: null
        });
        // 該用戶所在房間設為下線
        socket.broadcast.to(currentRoomId).emit("leaveRoomMessage", leaveRoomMessageResponse);
      });
    });
  }
};
