const Conversation = require("../../models/conversationModel");
const ConversationUnread = require("../../models/conversationUnreadModel");
const User = require("../../models/userModel");
const { decodedUserId } = require("../middleware/auth");
const SocketResponse = require("../response/response");
const users = require("./userController");

const conversations = {
  getParticipantListHandler: async (socket, { roomId }) => {
    const conversation = await conversations.findParticipants({
      roomId: roomId,
    });
    // 操作成功，向客户端发送成功的消息
    const response = new SocketResponse({
      statusCode: "success",
      message: "",
      data: conversation,
      error: null
    });
    socket.emit("getParticipantListResponse", response);
  },
  joinRoomHandler: async (io, socket, { roomId, token }) => {
    console.log("joinRoom");
    const conversation = await conversations.findConversation({
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
      error: null
    });
    io.to(`${socket.id}`).emit("joinRoomResponse", response);
  },
  leaveConversationHandler: async (io, socket, { roomId, token }) => {
    console.log("leaveConversation");
    if(!roomId){
      throw Error("找不到 roomId");
    }
    const userId = await decodedUserId(token);
    const updatedConversation = await Conversation.findOneAndUpdate(
      {
        _id: roomId
      },
      {
        $pull: { participants: userId }
      },
      {
        new: true
      }
    );

    const updatedUser = await users.deleteUserConversation({
      roomId,
      token: socket.handshake.query?.token,
    });

    const updatedConversationUnread = await ConversationUnread.updateOne({
      conversationId: roomId,
      userId: socket.handshake.query?.userId
    }, {
      $set: { logicDeleteFlag: true }
    });

    if(!updatedConversationUnread){
      throw Error("刪除資料失敗");
    }

    // 操作成功，向客户端发送成功的消息
    const response = new SocketResponse({
      statusCode: "success",
      message: "",
      data: updatedUser,
      error: null
    });
    io.to(`${socket.id}`).emit("leaveChatroomResponse", response);
  },
  createConversationHandler: async (io, socket, { displayName, token }) => {
    const userId = await decodedUserId(token);

    const conversation = await Conversation.create({
      displayName: displayName,
      participants: [userId],
    });

    let conversationUnreadQuery = {
      conversation: conversation._id,
      user: userId,
    };  // 查詢條件
    let update = { 
      logicDeleteFlag: false
    };  // 要更新或創建的資料
    let options = { upsert: true, new: true, setDefaultsOnInsert: true };  // 選項
    
    // 進行查找並更新，如果沒有找到則創建
    const unreadResult = await ConversationUnread.findOneAndUpdate(conversationUnreadQuery, update, options);

    if (!unreadResult) {
      throw Error("建立資料失敗");
    }

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


    // 操作成功，向客户端发送成功的消息
    const response = new SocketResponse({
      statusCode: "success",
      message: "",
      data: {},
      error: null
    });
    io.to(`${socket.id}`).emit("getChatroomListRequest", response);
  },

  addUserInRoomHandler: async (socket, {roomId, userId}) => {
    console.log("addUserInRoomHandler", roomId, userId);
    if(!roomId){
      throw Error("找不到 roomId");
    }
    if(!userId){
      throw Error("找不到 userId");
    }
    const conversationQuery = { _id: roomId, logicDeleteFlag: false };
    const conversationUpdateDocument = {
      $addToSet: { participants: userId },
      upsert: true,
      returnOriginal: false,
      runValidators: true,
    };
    const updatedConversation = await Conversation.updateOne(conversationQuery, conversationUpdateDocument);
    if (updatedConversation?.acknowledged === true && updatedConversation?.modifiedCount === 0) {
      throw Error("已添加到conversation collection");
    }

    let query = {
      conversation: roomId,
      user: userId,
    };  // 查詢條件
    let update = { 
      logicDeleteFlag: false
    };  // 要更新或創建的資料
    let options = { upsert: true, new: true, setDefaultsOnInsert: true };  // 選項
    
    // 進行查找並更新，如果沒有找到則創建
    const unreadResult = await ConversationUnread.findOneAndUpdate(query, update, options);
    console.log("unreadResult", unreadResult);
    // console.log();
    if(!unreadResult){
      throw Error("找不到未讀資料");
    }

    console.log("roomId", roomId);
    const userQuery = { _id: userId, logicDeleteFlag: false };
    const userUpdateDocument = {
      $addToSet: { conversations: roomId, conversationUnread: unreadResult._id },
      upsert: true,
      returnOriginal: false,
      runValidators: true,
    };
    
    const updatedUser = await User.updateOne(userQuery, userUpdateDocument);
    if (updatedUser?.acknowledged === true && updatedUser?.modifiedCount === 0) {
      throw Error("已添加過 user collection");
    }

    // 操作成功，向客户端发送成功的消息
    const response = new SocketResponse({
      statusCode: "success",
      message: "成功添加用户到房间",
      data: null,
      error: null
    });
    socket.emit("addUserInRoomResponse", response);
  },

  // async leaveConversation({ roomId, token }) {
  //   console.log("leaveConversation", roomId);
  //   const userId = await decodedUserId(token);
  //   const updatedConversation = await Conversation.findOneAndUpdate(
  //     {
  //       _id: roomId
  //     },
  //     {
  //       $pull: { participants: userId }
  //     },
  //     {
  //       new: true
  //     }
  //   );
  //   return updatedConversation;
    
  // },

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
    console.log("123", conversation);
    if(conversation){
      return conversation;
    }
    throw Error("沒找到 conversation");
  },
};

module.exports = conversations;
