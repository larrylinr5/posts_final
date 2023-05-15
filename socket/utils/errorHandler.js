const SocketResponse = require("../response/response");

const handleSocketErrorAsync = (func) => {
  // const _socket = socket;
  return async (socket, ...args) => {
    try {
      await func(socket, ...args);
    } catch (error) {
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