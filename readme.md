# Meta Wall
---
![Image](https://i.imgur.com/h7XdEPc.png)
我們想打造一個貼近 IG or FB 的交流平台，
並且鎖定只有成為會員才能享有我們所提供的服務

- [Metawall網址](https://www.universewalls.com/)
- [前端Repo](https://github.com/cotton123236/metawall-frontend)

### 功能說明
![Image](https://i.imgur.com/r2gQWgD.png)
##### 登入頁

![Image](https://i.imgur.com/m8m1duG.png)
##### 動態牆

![Image](https://i.imgur.com/AJQKgEP.png)
##### 收藏貼文

![Image](https://i.imgur.com/WW1YY2O.png)
##### 修改個人檔案


## For Developer:
### 執行指令
```javascript
//開發環境
npm run dev

//正式機環境
npm run prod

//Swagger開發文件
npm run swagger

//執行ESlint格式化
npm run format
```
### 建立專案和引入套件
- (1) 切換 Node.js 版本：``` nvm use v16.14.0 ```
- (2) 建立專案：``` express --no-view [專案] ```
- (3) 引入模組：``` npm install ```
- (4) 安裝套件：``` npm i mongoose dotenv cors bcryptjs validator jsonwebtoken imgur tslib image-size multer express-rate-limit -s ```
- (5) package.json 自訂指令、部署 AWS / Heroku
- (6) 加入 .gitignore、config.env、example.env 檔案


#### 建立專案結構
- app.js
- connections/db.js：連接資料庫
- controllers/postsControllers.js、usersControllers.js、uploadsController.js：操作 HTTP 動詞
- models/postsModel.js、usersModel.js、commentsModel.js：定義 Schema、建立模型
- routes/posts.js、users.js、uploads.js：建立路由
- service/errorHandler.js、process.js：自訂錯誤設計、統一處理 asyncError 服務
- service/successHandler.js：接收成功訊息
- service/auth.js：身份驗證
- service/upload.js：上傳圖片驗證

#### AWS 架構圖
![image](https://i.imgur.com/XAShGBE.png)
- DNS：透過 Cloudflare 做DNS轉址的設定與取得免費的SSL/TLS憑證做更安全的HTTPS連線。
- 前端：把Vue3的程式碼部署在AWS S3 靜態儲存庫
- 後端：把Node.js API 部署在AWS EB 容器內，在環境執行起的時候，會自動起一個EC2 instance。
- 資料庫：MongoDB Atlas