const { decodedUserId } = require("../middleware/auth");
const ConversationRepository = require("../repositories/conversationRepository");
const ConversationUnreadRepository = require("../repositories/conversationUnreadRepository");
const UserRepository = require("../repositories/userRepository");
const { transactionHandler } = require("../utils/commitHandler");

module.exports = class ConversationService {
  async getParticipantList(roomId) {
    const conversationRepository = new ConversationRepository();
    const conversation = await conversationRepository.findParticipants(roomId);

    if (conversation) {
      return conversation;
    }

    throw Error("沒找到 conversation");
  }

  async joinRoom({ roomId: roomId, token: token }) {
    const conversationRepository = new ConversationRepository();
    const userId = await decodedUserId(token);

    const conversation = await conversationRepository.findConversation({
      roomId: roomId,
      userId: userId,
    });

    if (conversation) {
      return conversation;
    }

    throw Error("沒找到 conversation");
  }

  async leaveConversation({ roomId: roomId, token: token }) {
    return transactionHandler(async (session) => {
      const userId = await decodedUserId(token);
      const conversationRepository = new ConversationRepository();
      await conversationRepository.findOneAndUpdate(
        { roomId, userId },
        { session }
      );

      const userRepository = new UserRepository();
      const updatedUser = await userRepository.deleteUserConversation(
        {
          roomId,
          userId,
        },
        { session }
      );

      const conversationUnreadRepository = new ConversationUnreadRepository();
      const updatedConversationUnread =
        await conversationUnreadRepository.deleteOneConversationUnread(
          {
            roomId: roomId,
            userId: userId,
          },
          { session }
        );
      return updatedUser;
    });
  }

  async createConversation({ displayName, userId }) {
    return transactionHandler(async (session) => {
      const conversationRepository = new ConversationRepository();
      const conversation = await conversationRepository.createConversation(
        { displayName, userId },
        session
      );

      const conversationUnreadRepository = new ConversationUnreadRepository();
      await conversationUnreadRepository.updateOneConversationUnread(
        {
          // @ts-ignore
          roomId: conversation._id,
          userId: userId,
        },
        { session }
      );

      const userRepository = new UserRepository();
      await userRepository.addConversationToUser(
        {
          // @ts-ignore
          roomId: conversation._id,
          userId: userId,
        },
        { session }
      );
    });
  }
  async addUserInRoom({ roomId, userId }) {
    return transactionHandler(async (session) => {
      const conversationRepository = new ConversationRepository();
      const conversation = await conversationRepository.addUserInConversation(
        { roomId, userId },
        { session }
      );

      const conversationUnreadRepository = new ConversationUnreadRepository();
      const updatedConversationUnread =
        await conversationUnreadRepository.findOneAndUpdateOrCreateConversationUnread(
          {
            // @ts-ignore
            roomId: conversation._id,
            userId: userId,
          },
          { session }
        );

      const userRepository = new UserRepository();
      await userRepository.setConversationAndConversationUnread(
        {
          // @ts-ignore
          roomId: conversation._id,
          userId: userId,
          // @ts-ignore
          conversationUnreadId: updatedConversationUnread._id,
        },
        { session }
      );
    });
  }
};
