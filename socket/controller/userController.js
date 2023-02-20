const User = require("../../models/userModel");
const { decodedUserId } = require("../middleware/auth");
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

  async updateUserStatus({token, status}){
    const userId = await decodedUserId(token);
    const users = await User.findOneAndUpdate({
      _id: userId,
      logicDeleteFlag: false,
    },{
      userStatus: status
    });
  },

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
