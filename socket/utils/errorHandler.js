const SocketResponse = require("../response/response");

/**
 * Handles socket errors asynchronously.
 * @param {object} socket - The socket object.
 * @param {function} func - The function to handle.
 * @returns {function} An async function that handles socket errors.
 */
const handleSocketErrorAsync = (socket, func) => {
  return async (...args) => {
    try {
      await func(socket, ...args);
    } catch (error) {
      console.log("error", error);
      /**
       * The socket response object.
       * @type {SocketResponse}
       */
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
