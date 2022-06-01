// swagger.js
const swaggerAutogen = require("swagger-autogen")();

const schemes = process.env.NODE_ENV === "dev" ? ["http"] : ["https"];
const definitions = require("./swagger-defintion");

const doc = {
  info: {
    title: "MetaWall", // swagger 文件名稱
    description: "MetaWall API 文件" // 描述文件
  },
  host: "localhost:3000", // 生成文件的路徑
  schemes, // 文件所支援的模式
  tags: [
    { name: "Auth", description: "驗證相關" },
    { name: "Users", description: "會員相關" },
    { name: "Posts", description: "貼文相關" },
    { name: "Follows", description: "追蹤相關" },
    { name: "Likes", description: "按讚相關" },
    { name: "Comments", description: "留言相關" },
    { name: "Files", description: "上傳檔案相關" }
  ],
  definitions,
  securityDefinitions: {
    // Token
    apiKeyAuth: {
      type: "apiKey",
      in: "headers", // can be 'header', 'query' or 'cookie'
      name: "authorization", // name of the header, query parameter or cookie
      description: "JSON Web Token"
    }
  }
};

const outputFile = "./swagger-output.json"; // 輸出的文件名稱
const endpointsFiles = ["./routes/index.js"]; // 進入點/注入點，分析 router 和自動生成

swaggerAutogen(outputFile, endpointsFiles, doc);