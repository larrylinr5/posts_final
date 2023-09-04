const page = {
  totalPages: 1,
  currentPage: 1,
  perPage: 10,
  totalDatas: 1,
  has_pre: false,
  has_next: false
};

const Success = {
  message: "成功訊息"
};

const Error = {
  message: "錯誤訊息"
};

const Sign = {
  token: "abcde",
  _id: "123456789"
};

const user = { // Schema 定義為 editor
  _id: "123456789",
  nickName: "會員暱稱",
  avatar: "https://i.imgur.com/xxx.png"
};

const User = { // Schema 定義為 editor
  ...user,
  gender: 1,
  createdAt: "2022-05-31T14:21:36.129Z",
  updatedAt: "2022-05-31T14:21:36.129Z"
};

const profile = { // Schema 定義為 editor
  ...User,
  donatedAmount: 0
};

const post = {
  _id: "123456789",
  user,
  content: "來新增一筆資料吧",
  image: ["https://i.imgur.com/xxx.png"],
  likes: ["123456789"],
  comments: [
    {
      _id: "123456789",
      user,
      comment: "夏日大作戰?!",
      createdAt: "2022-05-24T14:44:48.358Z",
      updatedAt: "2022-05-24T14:44:48.358Z"
    }
  ],
  createdAt: "2022-06-01T08:32:14.125Z",
  updatedAt: "2022-06-01T08:32:14.125Z"
};

const Post = {
  ...post
};

const Posts = {
  list: [post],
  page: page
};

const GetPosts = {
  list: [post],
  page: page,
  Success
};

const follow = {
  _id: "123456789",
  follow: "123456789",
  following: [user],
  createdAt: "2022-06-01T09:04:47.512Z",
  updatedAt: "2022-06-01T09:04:47.512Z"
};

const Follows = {
  list: [follow],
  page: page,
  Success
};

const Comment = {
  _id: "123456789",
  user,
  comment: "大家來回應",
  createdAt: "2022-06-01T08:41:23.254Z",
  updatedAt: "2022-06-01T08:41:23.254Z"
};

const like = {
  _id: "123456789",
  user,
  content: "來新增一筆資料吧",
  image: ["https://i.imgur.com/xxx.png"],
  likes: [User],
  createdAt: "2022-06-01T08:32:14.125Z",
  updatedAt: "2022-06-01T08:32:14.125Z"
};

const Like = {
  ...like,
  Success
};

const getLike = {
  _id: "123456789",
  user,
  content: "來新增一筆資料吧",
  image: ["https://i.imgur.com/xxx.png"],
  likes: [User],
  comments: [Comment],
  createdAt: "2022-06-01T08:32:14.125Z",
  updatedAt: "2022-06-01T08:32:14.125Z"
};

const getLikes = {
  list: [getLike],
  page: page,
  Success
};

const File = {
  upload: "https://i.imgur.com/xxx.png"
};

const createOrder = {
  status: "success",
  data: {
    tradeInfo: {
      Email: "cate50503@gmail.com",
      Amt: 1,
      ItemDesc: "向charlie贊助",
      TimeStamp: "1674736227290",
      MerchantOrderNo: "1674736227290"
    }
  }
};

const getOrderInfo = {
  status: "success",
  data: {
    order: {
      Email: "cate50503@gmail.com",
      Amt: 1,
      TimeStamp: "1674736227290",
      MerchantOrderNo: "1674736227290",
    },
    aesEncrypt:
      "e49d2e80b4ce75165b4161318b7d1170c0d6cdd851f876d10b7097f75c8a5796ef039e914d11aec0c3081e1c739ed8bdb095a4fc03f5299510ae9f29e527252107ef76e8670da1da03b7c4433f0d1a02a1e50beb829de601aabe6bfd37dc6706a453f5ca598d88a3794ad0a33bd4d705f3c930395added5a49b971938e684f1038e2143624d4268452fcda9e05608b17ea42b7bd7627a62c3dda4f7c89b6a7cc",
    shaEncrypt:
      "7D8DE6CCF75FE8D2C6C6E3ED351DCBE29B9B71A1E05D1F25C42F68528FA9F022",
  },
};

const forgetPasswordResponse = {
  status: "success",
  message: "請至 Email 查收信件"
};

const changePasswordResponse = {
  status: "success",
  message: "更新密碼成功"
};

module.exports = {
  profile,
  User,
  Post,
  Posts,
  GetPosts,
  Follows,
  Like,
  getLikes,
  Comment,
  File,
  Success,
  Error,
  Sign,
  createOrder,
  getOrderInfo,
  forgetPasswordResponse,
  changePasswordResponse
};