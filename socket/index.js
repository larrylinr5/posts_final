const { Server } = require("socket.io");
const { isAuthValid } = require("./middleware/auth");
const conversations = require("./controller/conversationController");
const chatMessages = require("./controller/chatMessageController");
const SocketUser = require("./user");
const SocketResponse = require("./response/response");
const { handleSocketErrorAsync } = require("./utils/errorHandler");
const users = require("./controller/userController");
module.exports = class Socket {
  constructor(server) {
    this.io = require("socket.io")(server, {
      cors: {
        origin: "*",
      },
    });
    this.io.use(async (socket, next) => {
      if (await isAuthValid(socket.handshake.query?.token)) {
        console.log(true);
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
      console.log("----connection-----");
      const socketUser = new SocketUser(socket);
      var currentRoomId;
      socket.on("setOnlineStatus", handleSocketErrorAsync(socket,(...args) => users.setOnlineStatusHandler(socket, socketUser, ...args)));

      socket.on("setOfflineStatus", handleSocketErrorAsync(socket,(...args) => users.setOnlineStatusHandler(socket, socketUser, ...args)));

      socket.on("addUserInRoom", handleSocketErrorAsync(socket, ( ...args) => {
        const [socketInstance, data] = args;
        const { roomId, userId } = data;
        return conversations.addUserInRoomHandler(socket, {roomId, userId});
      }));

      socket.on("getMessages", async ({ roomId }) => {
        console.log("getMessages", roomId);
        const messages = await chatMessages.getChatMessage({ roomId });
        console.log("messages", messages);
        // this.io.in(data.roomId).emit("getMessagesResponse", messages);
        socket.emit("getMessagesResponse", messages);
      });

      socket.on("getUserList", async ()=>{
        console.log("getUserList");
        const userList = await socketUser.getUserList();
        socket.emit("getUserListResponse", userList);
      });

      socket.on("getUserInfo", async ({ token }) => {
        console.log("getUserInfo");
        const userInfo = await socketUser.getUserInfo();
        // this.io.to(`${socket.id}`).emit('getUserInfoResponse', userInfo);
        socket.emit("getUserInfoResponse", userInfo);
      });

      socket.on("createChatroom", async ({ displayName }) => {
        await conversations.createConversation({
          displayName,
          token: socket.handshake.query?.token,
        });
        this.io.to(`${socket.id}`).emit("getChatroomListRequest", {});
      });

      socket.on("leaveChatroom", async ({ roomId }) => {
        console.log("leaveChatroom", roomId);
        const updatedConversation = await conversations.leaveConversation({
          roomId,
          token: socket.handshake.query?.token,
        });
        const updatedUser = await socketUser.deleteUserConversation({
          roomId,
          token: socket.handshake.query?.token,
        });
        console.log("updatedConversation", updatedConversation);
        this.io.to(`${socket.id}`).emit("leaveChatroomResponse", {});
      });

      socket.on("joinRoom", async data => {
        console.log("joinRoom");
        console.log("data", data.roomId);
        const conversation = await conversations.findConversation({
          roomId: data.roomId,
          token: socket.handshake.query?.token,
        });
        console.log("conversation", conversation);
        currentRoomId = conversation._id.toString();
        socket.join(currentRoomId);
        this.io.to(`${socket.id}`).emit("joinRoomSuccess", conversation);
        console.log("rooms", socket.rooms);
      });

      socket.on("sendJoinRoomMessage", data => {
        console.log("sendJoinRoomMessage", data);
        socket.broadcast.to(data.roomId).emit("joinRoomMessage", {
          userName: data.userName,
          message: `${data.userName} 使用者進入聊天室`,
        });
      });

      socket.on("getChatroomList", async data => {
        console.log("server side getChatroomList", data);
        console.log("userInfo", socket.id);
        const userInfo = await socketUser.getUserInfo();
        this.io.to(`${socket.id}`).emit("getChatroomListResponse", userInfo);
      });

      socket.on("chat", async data => {
        console.log("get message", data);
        // 更新資料庫跟顯示的時間差會不會有bug
        const chatMessage = await chatMessages.setChatMessages(data);
        console.log("message --", chatMessage);
        // this.io.in(data.roomId).emit("showMessage", chatMessage);
        this.io.sockets.in(data.roomId).emit('showMessage', chatMessage);
        // socket.emit("showMessage", chatMessage);
      });

      socket.on("getParticipantList", async (data) => {
        const conversation = await conversations.findParticipants({
          roomId: data.roomId,
        });
        socket.emit("getParticipantListResponse", conversation);
      });

      socket.on("disconnect", async () => {
        console.log("disconnect", socket.handshake.query?.token);
        console.log("disconnect", currentRoomId);
        
        // 更新其他客戶端在該用戶下線後的該用戶狀態
        const user = await socketUser.setUserStatusOffline();
        socket.broadcast.emit("updateUserStatusResponse", user);

        // 該用戶所在房間設為下線
        socket.broadcast.to(currentRoomId).emit("leaveRoomMessage", {
          userName: user.nickName,
          message: `${user.nickName} 下線`,
        });
      });
    });
  }
};
