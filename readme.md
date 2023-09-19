# Meta Wall


![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/t/larrylinr5/posts_final?style=for-the-badge)
![GitHub Repo stars](https://img.shields.io/github/stars/larrylinr5/posts_final?style=for-the-badge)
![GitHub contributors](https://img.shields.io/github/contributors/larrylinr5/posts_final?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/larrylinr5/posts_final?style=for-the-badge)

---
![Image](https://i.imgur.com/h7XdEPc.png)

Metawall 是一個旨在將社交體驗推向更高層次的平台，將 Instagram 和 Facebook 的魅力融入其中，為您帶來前所未有的交流樂趣。

### 連結 Link

- [link to MetaWall](https://www.universewalls.com/)
- [frontend repo](https://github.com/cotton123236/metawall-frontend)
- [backend repo]([https://github.com/larrylinr5/posts_final)


### Built With

#### core
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Express](https://img.shields.io/badge/express-35495E?style=for-the-badge&logo=express&logoColor=4FC08D) 
![Socket.io](https://img.shields.io/badge/socket.io-35495E?style=for-the-badge&logo=socket.io&logoColor=4FC08D)
![MongoDB](https://img.shields.io/badge/MongoDB-35495E?style=for-the-badge&logo=mongodb&logoColor=4FC08D)
![AWS](https://img.shields.io/badge/AWS-35495E?style=for-the-badge&logo=amazonaws&logoColor=4FC08D) 

#### plugins
![Doppler](https://img.shields.io/badge/Doppler-35495E?style=for-the-badge&logo=doppler&logoColor=4FC08D)
![Imgur](https://img.shields.io/badge/imgur-35495E?style=for-the-badge&logo=imgur&logoColor=4FC08D)
![Passport](https://img.shields.io/badge/passport-35495E?style=for-the-badge&logo=passport&logoColor=4FC08D)
![Google](https://img.shields.io/badge/google%20login-35495E?style=for-the-badge&logo=google&logoColor=4285F4) 
![Discord](https://img.shields.io/badge/discord%20login-35495E?style=for-the-badge&logo=discord&logoColor=5865F2)
![Facebook](https://img.shields.io/badge/facebook%20login-35495E?style=for-the-badge&logo=facebook&logoColor=1877F2) 
![Line](https://img.shields.io/badge/line%20login-35495E?style=for-the-badge&logo=line&logoColor=00C300)



### 功能說明
![Image](https://i.imgur.com/r2gQWgD.png)
##### 登入頁

![Image](https://i.imgur.com/m8m1duG.png)
##### 動態牆

![Image](https://i.imgur.com/AJQKgEP.png)
##### 收藏貼文

![Image](https://i.imgur.com/WW1YY2O.png)
##### 修改個人檔案


![忘記密碼gif (1)](https://github.com/larrylinr5/posts_final/assets/61115012/e6deb755-3743-4ce6-b1fe-70938d82e9ee)

##### 忘記密碼

![2rThA9kOye](https://github.com/larrylinr5/posts_final/assets/61115012/e0e1e9c7-403b-4c47-8bd2-e717f702b53c)

<small>Google, LINE, Discord, Facebook</small>
##### 第三方登入

![CMwqxJzdwE](https://github.com/larrylinr5/posts_final/assets/61115012/44b6aa75-3396-4bb9-bb73-1d1e246e62da)

##### 藍新金流

[![Watch the video](https://github.com/larrylinr5/posts_final/assets/61115012/794fb0b0-bf96-4e9a-89af-aa1e7a15cbb6)](https://youtu.be/OqpZwYZrEKg)
一般聊天功能示範

[![Watch the video](https://github.com/larrylinr5/posts_final/assets/61115012/794fb0b0-bf96-4e9a-89af-aa1e7a15cbb6)](https://youtu.be/upI4KOYch-M)
上傳圖片功能

##### Chat 
##### 


## For Developer:

### 使用技術
- node.js
- express
- mongoDB
- JWT
- Imgur
- Google第三方登入
- AWS

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


### 專案結構
```
├── connections           // 負責與資料庫連接
├── controller            // 處理 HTTP 請求的控制器
├── log                   // 存放日誌的資料夾
├── middleware            // 中間件，用於處理請求和回應
├── models                // 用於描述 mongoDB 的數據模型
├── routes                // 定義 HTTP 路由
├── socket                // 處理 socket.io 的相關功能
│   ├── controller        // 處理 socket 的控制器
│   ├── middleware        // 處理 socket 的中間件
│   ├── repositories      // 處理 socket 的資料存儲
│   ├── response          // 處理 socket 的回應格式
│   ├── services          // 處理 socket 的服務邏輯
│   └── utils             // 處理 socket 的工具函數
└── utils                 // 存放共用的工具函數

```

### AWS 架構圖
![image](https://i.imgur.com/XAShGBE.png)
- DNS：透過 Cloudflare 做DNS轉址的設定與取得免費的SSL/TLS憑證做更安全的HTTPS連線。
- 前端：把Vue3的程式碼部署在AWS S3 靜態儲存庫
- 後端：把Node.js API 部署在AWS EB 容器內，在環境執行起的時候，會自動起一個EC2 instance。
- 資料庫：MongoDB Atlas


### 貢獻 Contributors

<a href="https://github.com/larrylinr5/posts_final/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=larrylinr5/posts_final" />
</a>

Made with [contrib.rocks](https://contrib.rocks).
