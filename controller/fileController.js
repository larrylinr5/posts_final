const { ImgurClient } = require("imgur");
const { appError, handleErrorAsync } = require("../utils/errorHandler");
const getHttpResponse = require("../utils/successHandler");

const files = {
  uploadOneImage: handleErrorAsync(async (req, res, next) => {
    const {
      files
    } = req;

    if (!files.length) {
      return next(appError(400, "40004", "未選擇檔案"));
    }

    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENT_ID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });

    const { data, status, success } = await client.upload({
      image: files[0].buffer.toString("base64"),
      type: "base64",
      album: process.env.IMGUR_ALBUM_ID
    });

    if (success) {
      res.status(201).json(getHttpResponse({ 
        data: {
          upload: data.link
        } 
      }));
    } else {
      return next(appError(status, "40005", "發生錯誤，請稍後再試"));
    }
  })
};

module.exports = files;