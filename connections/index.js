/** 載入 mongoose 套件 */
const mongoose = require('mongoose');

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
