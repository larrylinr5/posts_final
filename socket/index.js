const { Server } = require("socket.io");
const { isAuthValid } = require("./middleware/auth");
const users = require("./controller/userController");
const conversations = require("./controller/conversationController");
const chatMessages = require("./controller/chatMessageController");

module.exports = class Socket {
  constructor(server) {
    this.io = require("socket.io")(server, {
      cors: {
        origin: "*",
      },
    });
    this.users = [];
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
      var currentRoomId;

      socket.on("addUserInRoom", async ({roomId, userId})=>{
        console.log("addUserInRoom");
        conversations.addParticipant({roomId, userId});
      });

      socket.on("getMessages", async ({ roomId }) => {
        const messages = await chatMessages.getChatMessage({ roomId });
        // this.io.in(data.roomId).emit("getMessagesResponse", messages);
        socket.emit("getMessagesResponse", messages);
      });

      socket.on("getUserList", async ()=>{
        console.log("getUserList");
        const userList = await users.findAllUser(socket.handshake.query?.token);
        socket.emit("getUserListResponse", userList);
      });

      socket.on("getUserInfo", async ({ token }) => {
        const userInfo = await users.getUserInfo(socket.handshake.query?.token);
        console.log("getUserInfo");
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

      socket.on("joinRoom", async data => {
        console.log("joinRoom");
        const conversation = await conversations.findConversation({
          roomId: data.roomId,
          token: socket.handshake.query?.token,
        });
        console.log("conversation",conversation);
        currentRoomId = conversation._id.toString();
        socket.join(currentRoomId);
        
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
        const userInfo = await users.getUserInfo(socket.handshake.query?.token);
        console.log("userInfo", socket.id);
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
        const userInfo = await users.getUserInfo(socket.handshake.query?.token);
        await users.updateUserStatus({token: socket.handshake.query?.token, status: "offline"});
        socket.broadcast.to(currentRoomId).emit("leaveRoomMessage", {
          userName: userInfo.nickName,
          message: `${userInfo.nickName} 下線`,
        });
      });
    });
  }
};
