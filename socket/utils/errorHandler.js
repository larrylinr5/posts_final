const SocketResponse = require("../response/response");

const handleSocketErrorAsync = (socket, func) => {
  // const _socket = socket;
  return async (...args) => {
    try {
      await func(socket, ...args);
    } catch (error) {
      console.log("error", error);
      const response = new SocketResponse({
        statusCode: "error",
        message: "",
        data: null,
        error: error
      });
      socket.emit("error", response);
    }
  };
};

module.exports = {
  handleSocketErrorAsync,
};