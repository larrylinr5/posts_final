// swagger.js
const swaggerAutogen = require("swagger-autogen")();
const definitions = require("./swagger-defintion");

const doc = {
  info: {
    title: "MetaWall", // swagger 文件名稱
    description: "MetaWall API 文件" // 描述文件
  },
  schemes: "http", // 文件所支援的模式
  tags: [
    { name: "Auth", description: "驗證相關" },
    { name: "Login", description: "登入相關" },
    { name: "Users", description: "會員相關" },
    { name: "Posts", description: "貼文相關" },
    { name: "Follows", description: "追蹤相關" },
    { name: "Likes", description: "按讚相關" },
    { name: "Comments", description: "留言相關" },
    { name: "Files", description: "上傳檔案相關" },
    { name: "Payment", description: "支付相關" },
    { name: "NotFound", description: "頁面路由相關" }
  ],
  definitions,
  securityDefinitions: {
    // Token
    Bearer: {
      type: "apiKey",
      in: "headers", // can be 'header', 'query' or 'cookie'
      name: "Authorization", // name of the header, query parameter or cookie
      description: "JWT Token"
    }
  }
};

const outputFile = "./swagger-output.json"; // 輸出的文件名稱
const endpointsFiles = ["./routes/index.js"]; // 進入點/注入點，分析 router 和自動生成

swaggerAutogen(outputFile, endpointsFiles, doc);