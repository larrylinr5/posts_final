const { decodedUserId } = require("../middleware/auth");
const SocketResponse = require("../response/response");
const ConversationService = require("../services/conversationService");

const conversations = {
  getParticipantListHandler: async (socket, { roomId }) => {
    const conversationService = new ConversationService();
    const conversation = await conversationService.getParticipantList(roomId);
    // 操作成功，向客户端发送成功的消息
    const response = new SocketResponse({
      statusCode: "success",
      message: "",
      data: conversation,
      error: null,
    });
    socket.emit("getParticipantListResponse", response);
  },
  joinRoomHandler: async (io, socket, { roomId, token }) => {
    // console.log("joinRoom");
    const conversationService = new ConversationService();
    const conversation = await conversationService.joinRoom({
      roomId: roomId,
      token: token,
    });

    const currentRoomId = conversation._id.toString();

    socket.join(currentRoomId);
    // 操作成功，向客户端发送成功的消息
    const response = new SocketResponse({
      statusCode: "success",
      message: "",
      data: conversation,
      error: null,
    });
    io.to(`${socket.id}`).emit("joinRoomResponse", response);
  },
  leaveConversationHandler: async (io, socket, { roomId, token }) => {
    // console.log("leaveConversation");
    const conversationService = new ConversationService();

    if (!roomId) {
      throw Error("找不到 roomId");
    }
    const updatedUser = await conversationService.leaveConversation({
      roomId: roomId,
      token: token,
    });

    // 操作成功，向客户端发送成功的消息
    const response = new SocketResponse({
      statusCode: "success",
      message: "",
      data: updatedUser,
      error: null,
    });
    io.to(`${socket.id}`).emit("leaveChatroomResponse", response);
  },
  createConversationHandler: async (io, socket, { displayName, token }) => {
    const userId = await decodedUserId(token);
    const conversationService = new ConversationService();
    await conversationService.createConversation({ displayName, userId });
    // 操作成功，向客户端发送成功的消息
    const response = new SocketResponse({
      statusCode: "success",
      message: "",
      data: {},
      error: null,
    });
    io.to(`${socket.id}`).emit("getChatroomListRequest", response);
  },

  addUserInRoomHandler: async (socket, { roomId, userId }) => {
    // console.log("addUserInRoomHandler", roomId, userId);
    if (!roomId) {
      throw Error("找不到 roomId");
    }
    if (!userId) {
      throw Error("找不到 userId");
    }
    const conversationService = new ConversationService();
    await conversationService.addUserInRoom({ roomId, userId });
    // 操作成功，向客户端发送成功的消息
    const response = new SocketResponse({
      statusCode: "success",
      message: "成功添加用户到房間",
      data: null,
      error: null,
    });
    socket.emit("addUserInRoomResponse", response);
  },
};

module.exports = conversations;
