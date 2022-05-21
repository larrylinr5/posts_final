/**
 * 取得 http 回傳的內容
 * @param {string|array} data 回傳的內容
 * @returns {object} http 回傳的內容
 */
const getHttpResponse = (data) => {
  const result = { status: 'success' };
  if (data) result.data = data;
  return result;
};

module.exports = getHttpResponse;