

const statusCodeMap = new Map([
  ["success", "success"],
  ["error", "error"]
]);

class SocketResponseMessage {
  constructor(statusCode, message, error) {
    this.status = this.SocketResponseStatus(statusCode).getStatus();
    this.message = this.setMessage(message, error);
  }

  isErrorMessage(){
    return this.status===statusCodeMap.get("error");
  }

  setMessage(message, error){
    return this.isErrorMessage() ? this.setErrorMessage(message, error) : this.setSuccessMessage(message);
  }

  setSuccessMessage(message){
    return message || "更新成功";
  }

  setErrorMessage(message, error){
    return message || (error ? `更新失敗，原因：${error.message}` : "更新失敗");
  }
}

class SocketResponseStatus {
  constructor(statusCode) {
    this.status = this.setStatus(statusCode);
  }

  setStatus(statusCode){
    const status = statusCodeMap.get(statusCode);
    return status ? status : null;
  }

  getStatus(){
    return this.status;
  }
}

module.exports = class SocketResponse {
  constructor({
    statusCode, message, data, error
  }) {
    this.status = new SocketResponseStatus(statusCode).getStatus();
    this.message = new SocketResponseMessage(statusCode, message, error);
    this.data = data;
  }
};
