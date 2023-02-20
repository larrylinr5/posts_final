const URL = "http://localhost:3005";

function connectSocketServer(userToken) {
  console.log("token", userToken);
  socket = io(URL, {
    reconnectionDelayMax: 10000,
    query: {
      token: userToken,
    },
  });
}
