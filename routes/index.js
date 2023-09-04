const userRouter = require("./users");
const postRouter = require("./posts");
const authRouter = require("./auth");
const paymentRouter = require("./payment");
const generalRouter = require("./general"); // includes 404 missing routes
const { isAuth } = require("../middleware/auth");
const getHttpResponse = require("../utils/successHandler");
/** 生成 Swagger 套件 */
const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("../swagger-output.json");

module.exports = (app) => {
  app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerFile));
  app.use("/users", userRouter),
  app.use("/posts", postRouter),
  app.use("/auth", authRouter),
  app.use("/payment", paymentRouter),
  app.use("/check", isAuth, ({res}) => {
    res.status(200).json(getHttpResponse({
      message: "驗證成功"
    }));
  });
  app.use("/", generalRouter);
};
