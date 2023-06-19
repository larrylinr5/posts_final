const mongoose = require("mongoose");

// 事務處理器
const transactionHandler = async (action) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 執行傳入的操作
    const result = await action(session);
    // 如果操作成功，則提交事務
    await session.commitTransaction();

    return result;
  } catch (error) {
    // 如果操作失敗，則中止事務
    await session.abortTransaction();

    throw error;
  } finally {
    // 結束session
    session.endSession();
  }
};


module.exports = {
  transactionHandler
};