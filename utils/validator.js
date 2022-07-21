const validator = require("validator");
module.exports = class Validator {
  /**
   *
   * @param {Object} param0 { email, password, confirmPassword } 要驗證資料項目
   * @param {Next} next
   * @returns {status,msg}
   */
  static signUpCheck({ email, password, confirmPassword }) {
    if (!email || !password || !confirmPassword) {
      return {
        status: false,
        msg: "欄位未填寫正確!",
      };
    }
    if (password !== confirmPassword) {
      return {
        status: false,
        msg: "密碼不一致!",
      };
    }
    if (!validator.isEmail(email)) {
      return {
        status: false,
        msg: "Email 格式不正確!",
      };
    }

    if (!validator.isLength(password, { min: 8 })) {
      return {
        status: false,
        msg: "密碼少於8位數!",
      };
    }
    return {
      status: true,
      msg: "success",
    };
  }
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
        msg: "欄位未填寫正確!",
      };
    }
    if (password !== confirmPassword) {
      return {
        status: false,
        msg: "密碼不一致!",
      };
    }
    if (!validator.isEmail(email)) {
      return {
        status: false,
        msg: "Email 格式不正確!",
      };
    }

    if (!validator.isLength(password, { min: 8 })) {
      return {
        status: false,
        msg: "密碼少於8位數!",
      };
    }
    return {
      status: true,
      msg: "success",
    };
  }
  static signIn({ email, password }) {
    if (!email || !password) {
      return {
        status: false,
        msg: "帳號密碼不可為空!",
      };
    }
    if (!validator.isEmail(email)) {
      return {
        status: false,
        msg: "Email 格式不正確!",
      };
    }
    if (!validator.isLength(password, { min: 8 })) {
      return {
        status: false,
        msg: "密碼少於8位數!",
      };
    }
    return {
      status: true,
      msg: "success",
    };
  }
  static updatePw({ password, confirmPassword, oldPassword }) {
    if (!password || !confirmPassword || !oldPassword) {
      return {
        status: false,
        msg: "請填寫舊密碼、新密碼或確認密碼!",
      };
    }
    if (password === oldPassword) {
      return {
        status: false,
        msg: "新密碼與舊密碼相同!",
      };
    }
    if (password !== confirmPassword) {
      return {
        status: false,
        msg: "新密碼和確認密碼不一致!",
      };
    }
    if (!validator.isLength(password, { min: 8 })) {
      return {
        status: false,
        msg: "密碼少於8位數!",
      };
    }
    return {
      status: true,
      msg: "success",
    };
  }
  static forgetPassword({ email }) {
    if (!validator.isEmail(email)) {
      return {
        status: false,
        msg: "Email 格式不正確!",
      };
    }
    return {
      status: true,
      msg: "success",
    };
  }
  static resetPw({ password, confirmPassword }) {
    if (!password || !confirmPassword) {
      return {
        status: false,
        msg: "請填寫新密碼或確認密碼!",
      };
    }
    if (password !== confirmPassword) {
      return {
        status: false,
        msg: "新密碼和確認密碼不一致!",
      };
    }
    if (!validator.isLength(password, { min: 8 })) {
      return {
        status: false,
        msg: "密碼少於8位數!",
      };
    }
    return {
      status: true,
      msg: "success",
    };
  },
};
