const userListEl = document.getElementById("USER_LIST");
const participantListElement = document.getElementById("PARTICIPANT_LIST");
const messageContainer = document.getElementById("message-bar");
const messageInput = document.getElementById("message-input");
const userNameLabel = document.getElementById("USER_NAME");
var participants = null;

var userInfo = {
  nickName: "",
};
const userToken = localStorage.getItem("userToken");
const roomName = localStorage.getItem("roomName");
const roomId = localStorage.getItem("roomId");
var alertToast = null;

var socket = null;

// init();

function getUserList() {
  console.log("getUserList");
  socket.emit("getUserList", {});
}

function leaveRoomMessage(data) {
  const messageElement = document.createElement("li");
  if (data.nickName !== userInfo.nickName) {
    messageElement.classList.add("chat-item-another");
  } else {
    messageElement.classList.add("chat-item");
  }
  messageElement.innerHTML = /*html*/ `
    <div class="chat-item-container">
      <span font="noto" class="fw-bold">${data.message}</span>
    </div>
  `;

  messageContainer.append(messageElement);
}

function joinRoomMessage(data) {
  console.log("joinRoomMessage", joinRoomMessage);
  const messageElement = document.createElement("li");
  if (data.nickName !== userInfo.nickName) {
    messageElement.classList.add("chat-item-another");
  } else {
    messageElement.classList.add("chat-item");
  }
  messageElement.innerHTML = /*html*/ `
    <div class="chat-item-container">
      <span font="noto" class="fw-bold">${data.message}</span>
    </div>
  `;

  messageContainer.append(messageElement);
}

function appendMessage(chatMessage) {
  const messageElement = document.createElement("li");
  if (chatMessage.sender.nickName !== userInfo.nickName) {
    messageElement.classList.add("chat-item-another");
  } else {
    messageElement.classList.add("chat-item");
  }
  messageElement.innerHTML = /*html*/ `
    <div class="chat-item-container">
      <span font="noto" class="fw-bold">${chatMessage.sender.nickName}</span>:
      <span font="noto">${chatMessage.text}</span>
    </div>
  `;

  messageContainer.append(messageElement);
}

function appendUser(userList) {
  userList.forEach((user, index) => {
    const userElement = document.createElement("li");
    const pointColor =
      user.userStatus === "online" ? "point-danger" : "point-secondary";
    const isRoomMember = participants.some(participant=>{
      return participant._id === user._id;
    });
    const btnDisabled = isRoomMember ? "disabled" : "";
    let innerHtml = /*html*/ `
      <li class="p-2">
        <div class="d-flex justify-content-between align-items-center border border-1 rounded-2 p-2">
          <p font="noto" class="point ${pointColor} lh-base ms-4 mb-0">${user.nickName}</p>
          <button class="btn btn-primary" onclick="addUser(${index})" ${btnDisabled}>邀請</button>
          </div><input type="text" name="USER_ID_${index}" value="${user._id}" hidden>
        </li>  
        `;
    userElement.innerHTML = innerHtml;
    userListEl.append(userElement);
  });
}

function addUser(index) {
  console.log("addUser");
  const userIdEl = document.getElementsByName("USER_ID_" + index);
  console.log("userIdEl.value", userIdEl[0].value);
  socket.emit("addUserInRoom", { roomId: roomId, userId: userIdEl[0].value });
}

function getMessages() {
  socket.emit("getMessages", {
    roomId: roomId,
  });
}

function setParticipantList(participants) {
  participants.forEach(participant => {
    console.log("loop user list");
    const participantElement = document.createElement("li");
    let innerHtml = /*html*/ `
        <li class="p-2">
          <div class="d-flex justify-content-between align-items-center border border-1 rounded-2 p-2">
            <p font="noto" class="lh-base ms-4 mb-0">${participant.nickName}</p>
          </li>
          `;
    participantElement.innerHTML = innerHtml;
    participantListElement.append(participantElement);
  });
}

function initSocketMethod() {
  // socket.on("afterCheckAuth", isUserExist => {
  //   console.log("afterCheckAuth");
  //   if(isUserExist){
  //     alert(isUserExist);
  //   }else{
  //     alert(isUserExist);
  //   }
  // });

  socket.on("showMessage", chatMessage => {
    console.log("showMessage", chatMessage);
    appendMessage(chatMessage);
    scrollToBottom(messageContainer);
  });

  socket.on("getMessagesResponse", chatMessages => {
    console.log("chatMessages", chatMessages);

    chatMessages.forEach(chatMessage => {
      appendMessage(chatMessage);
    });
  });

  socket.on("getUserListResponse", userList => {
    console.log("getUserListResponse", userList);
    appendUser(userList);
  });

  socket.on("joinRoomMessage", data => {
    console.log("joinRoomMessage", data);
    joinRoomMessage(data);
  });

  socket.on("leaveRoomMessage", data => {
    console.log("leaveRoomMessage", data);
    leaveRoomMessage(data);
    getUserList();
  });

  socket.on("getUserInfoResponse", userInfo => {
    console.log("getUserInfoResponse");
    this.userInfo = userInfo;
    setUserName();
    getMessages();
  });

  socket.on("getParticipantListResponse", conversation => {
    console.log("getParticipantListResponse", conversation);
    this.participants = conversation.participants;
    setParticipantList(conversation.participants);
    getUserList();
  });
}

function joinRoom() {
  const data = {
    roomId: roomId,
  };
  socket.emit("getUserInfo", { token: userToken });
  console.log("getUserInfo");
  socket.emit("joinRoom", data);
  socket.emit("sendJoinRoomMessage", data);
  getParticipantList();
  // getUserList();
}

function sendMessage() {
  if (!checkMessageInput()) {
    alert("請輸入內容");
    return;
  }

  const data = {
    userId: userInfo?._id,
    roomId: roomId,
    text: messageInput.value,
  };
  socket.emit("chat", data);
  messageInput.value = "";
}

function checkMessageInput() {
  if (messageInput.value !== "") return true;
  return false;
}

function checkMessageInput() {
  if (messageInput.value !== "") return true;
  return false;
}

function checkAuth() {
  socket.emit("checkAuth", {});
}

function getParticipantList() {
  socket.emit("getParticipantList", { roomId: roomId });
}

function init() {
  alertToast = createToast("liveToast");
  try {
    connectSocketServer(userToken);
    initSocketMethod();

    joinRoom();
  } catch (error) {
    console.log(error);
    showAlert("驗證失敗");
  }

  // checkAuth();
}

function setUserName() {
  userNameLabel.innerText = userInfo.nickName;
}

function showAlert(messageHtml) {
  const alertToastBody = document.getElementById("ALERT_TOAST_BODY");
  alertToastBody.innerHTML = /*html*/ `<p font="noto" class="mb-0">${messageHtml}</p>`;
  alertToast.show();
  timeToHideToast(2000, alertToast);
}

function scrollToBottom(scrollingElement) {
  scrollingElement.scrollTop = scrollingElement.scrollHeight;
}
