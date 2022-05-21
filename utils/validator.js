const validator = require('validator')
module.exports = class Validator {
  /**
   *
   * @param {Object} param0
   * @param {Next} next
   * @returns {status,msg}
   */
  static signUp({ nickName, email, password, confirmPassword }) {
    if (!nickName || !email || !password || !confirmPassword) {
      return {
        status: false,
        msg: '欄位未填寫正確!',
      }
    }
    if (password !== confirmPassword) {
      return {
        status: false,
        msg: '密碼不一致!',
      }
    }
    if (!validator.isEmail(email)) {
      return {
        status: false,
        msg: 'Email 格式不正確!',
      }
    }

    if (!validator.isLength(password, { min: 8 })) {
      return {
        status: false,
        msg: '密碼少於8位數!',
      }
    }
    return {
      status: true,
      msg: 'success',
    }
  }
  static signIn({ email, password }) {
    if (!email || !password) {
      return {
        status: false,
        msg: '帳號密碼不可為空!',
      }
    }
    if (!validator.isEmail(email)) {
      return {
        status: false,
        msg: 'Email 格式不正確!',
      }
    }
    if (!validator.isLength(password, { min: 8 })) {
      return {
        status: false,
        msg: '密碼少於8位數!',
      }
    }
    return {
      status: true,
      msg: 'success',
    }
  }
}
