/**
 * 取得 http 回傳的內容
 * @param {string|array} data 回傳的內容
 * @returns {object} http 回傳的內容
 * @returns {string} http 回傳的message
 */
const getHttpResponse = ({data, message}) => {
  const result = { status: "success" };
  if (data) result.data = data;
  if (message) result.message = message;
  return result;
};

module.exports = getHttpResponse;