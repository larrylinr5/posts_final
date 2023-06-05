

const statusCodeMap = new Map([
  ["success", "success"],
  ["error", "error"]
]);
/**
 * Represents the status of a socket response.
 *
 * @class SocketResponseStatus
 */
class SocketResponseStatus {
  /**
   * Constructs a new SocketResponseStatus object.
   * @param {string} statusCode - The status code.
   */
  constructor(statusCode) {
    /**
     * The status of the response.
     * @type {?string}
     */
    this.status = this.setStatus(statusCode);
  }

  /**
   * Sets the status based on the given status code.
   * @param {string} statusCode - The status code.
   * @returns {?string} The status, or null if no matching status is found.
   */
  setStatus(statusCode) {
    const status = statusCodeMap.get(statusCode);
    return status ? status : null;
  }

  /**
   * Retrieves the status of the response.
   * @returns {?string} The status of the response.
   */
  getStatus() {
    return this.status;
  }
}

/**
 * Represents a socket response message.
 *
 * @class SocketResponseMessage
 */
class SocketResponseMessage {
  /**
   * Constructs a new SocketResponseMessage object.
   * @param {string} statusCode - The status code.
   * @param {string} message - The message.
   * @param {Error} error - The error object.
   */
  constructor(statusCode, message, error) {
    /**
     * The status of the response.
     * @type {?string}
     */
    this.status = new SocketResponseStatus(statusCode).getStatus();
    /**
     * The message of the response.
     * @type {string}
     */
    this.message = this.setMessage(message, error);
  }

  /**
   * Checks if the response is an error message.
   * @returns {boolean} True if the response is an error message, false otherwise.
   */
  isErrorMessage() {
    return this.status === statusCodeMap.get("error");
  }

  /**
   * Sets the message based on the status and error.
   * @param {string} message - The message.
   * @param {Error} error - The error object.
   * @returns {string} The formatted message.
   */
  setMessage(message, error) {
    return this.isErrorMessage()
      ? this.setErrorMessage(message, error)
      : this.setSuccessMessage(message);
  }

  /**
   * Sets the success message.
   * @param {string} message - The message.
   * @returns {string} The success message.
   */
  setSuccessMessage(message) {
    return message || "更新成功";
  }

  /**
   * Sets the error message.
   * @param {string} message - The message.
   * @param {Error} error - The error object.
   * @returns {string} The error message.
   */
  setErrorMessage(message, error) {
    return message || (error ? `更新失敗，原因：${error.message}` : "更新失敗");
  }
}

/**
 * Represents a socket response.
 *
 * @class SocketResponse
 */
module.exports = class SocketResponse {
  /**
   * Constructs a new SocketResponse object.
   * @param {Object} options - The options for the response.
   * @param {string} options.statusCode - The status code.
   * @param {string} options.message - The message.
   * @param {*} options.data - The data.
   * @param {Error} options.error - The error object.
   */
  constructor({ statusCode, message, data, error }) {
    /**
     * The status of the response.
     * @type {?string}
     */
    this.status = new SocketResponseStatus(statusCode).getStatus();
    /**
     * The message of the response.
     * @type {string}
     */
    this.message = new SocketResponseMessage(statusCode, message, error).message;
    /**
     * The data of the response.
     * @type {*}
     */
    this.data = data;
  }
};
