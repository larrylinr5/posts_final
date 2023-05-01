const users = require("./controller/userController");
module.exports = class SocketUser {

  constructor(socket) {
    this.socket = socket;
    this.token = this.socket.handshake.query?.token;
  }

  async setUserStatus(status) {
    console.log("setUserStatus", status);
    // console.log("setUserStatus", this.token);
    const user = await users.setUserStatus({token: this.token, status: status});
    return user;
  }

  async getUserList(){
    return users.findAllUser(this.token);
  }

  async setUserStatusOnline() {
    return this.setUserStatus("online");
  }
  async setUserStatusOffline() {
    return this.setUserStatus("offline");
  }

  async getUserInfo(){
    return users.getUserInfo(this.token);
  }
};