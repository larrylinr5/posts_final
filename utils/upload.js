const multer = require("multer");
const path = require("path");
const { appError, handleErrorAsync } = require("../utils/errorHandler");

const multerSettings = {
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
      cb(new Error("檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。"));
    }
    cb(null, true);
  }
};

const uploadCore = multer(multerSettings).any();

const upload = handleErrorAsync(async (req, res, next) => {
  uploadCore(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return next(appError(400, "", err.message, next));
    } else if (err) {
      return next(appError(500, "", "上傳發生錯誤", next));
    }
    next();
  });
});

module.exports = {
  upload
};