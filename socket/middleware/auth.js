const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");

const decodedUserId = function(token){
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      // console.log(err);
      err ? reject("Token 驗證錯誤") : resolve(payload.id);
    });
  });
};

const isAuthValid = async function(token){
  try {
    const userId = await decodedUserId(token);
    const user = await User.findOne({
      _id: userId,
      logicDeleteFlag: false,
    });
    if(user){
      return true;
    }
    throw Error("User 不存在");

  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  isAuthValid,
  decodedUserId
};