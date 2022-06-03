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
};

const like = {
  _id: "123456789",
  user,
  content: "來新增一筆資料吧",
  image: ["https://i.imgur.com/xxx.png"],
  likes: ["123456789"],
  createdAt: "2022-06-01T08:32:14.125Z",
  updatedAt: "2022-06-01T08:32:14.125Z"
};

const Like = {
  ...like,
  Success
};

const getLikes = {
  list: [like],
  page: page,
  Success
};

const Comment = {
  _id: "123456789",
  User,
  comment: "大家來回應",
  createdAt: "2022-06-01T08:41:23.254Z",
  updatedAt: "2022-06-01T08:41:23.254Z"
};

const File = {
  upload: "https://i.imgur.com/xxx.png"
};

module.exports = {
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
  Sign
};