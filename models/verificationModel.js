const mongoose = require('mongoose');

const verificationSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: [true, 'User ID 未填寫']
  },
  verification: {
    type: String,
    required: [true, '驗證碼未填寫']
  }
}, { versionKey: false })

const Verification = mongoose.model('Verification', verificationSchema);

module.exports = Verification