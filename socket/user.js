const { Socket } = require("socket.io");
const users = require("./controller/userController");

/**
 * Represents a SocketUser.
 * @class SocketUser
 */
module.exports = class SocketUser {
  /**
   * Constructs a new SocketUser object.
   * @param {Socket} socket - The socket object.
   */
  constructor(socket) {
    /**
     * The socket object.
     * @type {Socket}
     */
    this.socket = socket;
    /**
     * The token associated with the socket.
     * @type {string}
     */
    this.token = /** @type {?string} */ (this.socket.handshake.query?.token);
  }

  /**
   * Sets the user status.
   * @param {string} status - The user status.
   * @returns {Promise<object>} The updated user object.
   */
  async setUserStatus(status) {
    console.log("setUserStatus", status);
    // console.log("setUserStatus", this.token);
    const user = await users.setUserStatus({ token: this.token, status: status });
    return user;
  }

  /**
   * Retrieves the user list.
   * @returns {Promise<any>} The list of user objects.
   */
  async getUserList() {
    return users.findAllUser(this.token);
  }

  /**
   * Sets the user status as online.
   * @returns {Promise<object>} The updated user object.
   */
  async setUserStatusOnline() {
    return this.setUserStatus("online");
  }

  /**
   * Sets the user status as offline.
   * @returns {Promise<object>} The updated user object.
   */
  async setUserStatusOffline() {
    return this.setUserStatus("offline");
  }

  /**
   * Retrieves the user information.
   * @returns {Promise<object>} The user object.
   */
  async getUserInfo() {
    return users.getUserInfo(this.token);
  }
};
