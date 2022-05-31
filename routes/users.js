const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const followController = require("../controller/followController");
const FileController = require("../controller/fileController");
const { handleErrorAsync } = require("../utils/errorHandler");
const { checkUserId } = require("../middleware/checkId");
const { isAuth } = require("../middleware/auth");
const { upload } = require("../utils/upload");

/* 取得個人所有追蹤列表 */
router.get("/follows", isAuth, handleErrorAsync(followController.getFollowList));

/* 取得個人資料(自己) */
router.get("/profile", isAuth, handleErrorAsync(userController.getMyProfile));

/* 取得個人資料(別人) */
router.get("/profile/:userId", isAuth, handleErrorAsync(userController.getOtherProfile));

/* 驗證註冊資料 */
router.post("/sign_up_check", handleErrorAsync(userController.signUpCheck));

/* 註冊 */
router.post("/sign_up", handleErrorAsync(userController.signUp));

/* 登入 */
router.post("/sign_in", handleErrorAsync(userController.signIn));

/* 上傳會員頭像 */
router.post("/avatar", isAuth, upload, handleErrorAsync(FileController.uploadOneImage));

/* 追蹤朋友(自己 → 別人) */
router.post("/follows/:userId", isAuth, checkUserId, handleErrorAsync(followController.postFollow));

/* 修改密碼 */
router.patch("/updatePassword", isAuth, handleErrorAsync(userController.updatePassword));

/* 更新個人資料 */
router.patch("/profile/:userId", isAuth, handleErrorAsync(userController.updateProfile));

/* 取消追蹤(自己 → 別人) */
router.delete("/follows/:userId", isAuth, checkUserId, handleErrorAsync(followController.deleteFollow));

module.exports = router;