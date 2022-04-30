/** 載入 mongoose 套件 */
const mongoose = require('mongoose');
/** 載入 全域變數套件 */
const dotenv = require('dotenv');
// 全域變數套件設定
dotenv.config({ path: "./config.env" })

// 遠端連線字串
const connectString = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
)
// 連線字串
mongoose.connect(connectString)
    .then(() => {
        console.log('資料庫連線成功')
    })
//#endregion