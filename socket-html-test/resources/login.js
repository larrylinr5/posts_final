const loginUserTokenInput = document.getElementById("LOGIN_USER_TOKEN_INPUT");
loginUserTokenInput.value = localStorage.getItem(
  "userToken",
  loginUserTokenInput.value
);
const roomNameInput = document.getElementById("ROOM_NAME_INPUT");
const chatroomListEl = document.getElementById("CHATROOM_LIST");

var alertToast = null;
var socket = null;

function connectSocket() {
  if (!isInputHasValue(loginUserTokenInput)) {
    showAlert("請輸入 User token");
    return;
  }
  localStorage.setItem("userToken", loginUserTokenInput.value);
  localStorage.setItem("roomName", roomNameInput.value);
  console.log("token", loginUserTokenInput.value);
  connectSocketServer(loginUserTokenInput.value);
  initSocketMethod();
}

function searchChatroom() {
  // if (!isInputHasValue(roomNameInput)) {
  //   showAlert("請輸入 Room name");
  //   return;
  // }

  if (!isInputHasValue(loginUserTokenInput)) {
    showAlert("請輸入 User token");
    return;
  }

  getChatroomList();
}

function getChatroomList() {
  console.log("do getChatroomList");
  socket.emit("getChatroomList", {});
}

function goChatPage(index) {
  const conversationIdEl = document.getElementsByName("CONVERSATION_ID_"+index);
  console.log("id:", conversationIdEl[0].value);
  localStorage.setItem("roomId", conversationIdEl[0].value);
  window.location.href = "index.html";
}

function init() {
  addEnterEvent();
  alertToast = createToast("liveToast");
}

function addEnterEvent() {
  window.document.onkeydown = function (event) {
    if (event.key === "Enter") login();
  };
}

function showAlert(messageHtml) {
  const alertToastBody = document.getElementById("ALERT_TOAST_BODY");
  alertToastBody.innerHTML = /*html*/ `<p font="noto" class="mb-0">${messageHtml}</p>`;
  alertToast.show();
  timeToHideToast(2000, alertToast);
}

function initSocketMethod() {
  socket.on("connect", () => {
    console.log("connected", socket.connected); // true
    if(!socket.connected){
      socket.close();
    }
  });
  socket.on("getChatroomListRequest", data=>{
    socket.emit("getChatroomList", {});
  });

  socket.on("getChatroomListResponse", userInfo => {
    console.log("getChatroomListResponse", userInfo);
    console.log(userInfo.conversations);
    if (userInfo.conversations) {
      userInfo.conversations.forEach((conversation, index) => {
        console.log("loop");
        const li = document.createElement("li");
        let innerHtml = "";
        innerHtml += /*html*/ `
        <div class="border border-1 border-dark rounded-2 p-4 mt-3">
          <div class="row">
            <div class="room-container  d-flex justify-content-between align-content-center ">
              <h5 font="noto" class="d-flex align-content-center mb-0 lh-base">${conversation.displayName}</h5>
              <button class="btn btn-warning" onclick="goChatPage(${index})">進入</button>
            </div>
          </div>
        `;
        innerHtml +=
          /*html*/ `<div class="row"><div class="col-1">` +
          createNameTags(conversation.participants) +
          /*html*/ `</div></div></div>`;

        innerHtml +=`<input type="text" name="CONVERSATION_ID_${index}" value="${conversation._id}" hidden>`;
        li.innerHTML = innerHtml;
        chatroomListEl.appendChild(li);
      });
    }

    // appendMessage(data);
  });
}

function createNameTags(participants) {
  let html = "";
  participants.forEach(participant => {
    html += /*html*/ `<button class="btn btn-secondary btn-sm mb-2">${participant.nickName}</button>`;
  });
  return html;
}

function createChatroom() {
  if (!isInputHasValue(roomNameInput)) {
    showAlert("請輸入 Room name");
    return;
  }
  socket.emit("createChatroom", {
    displayName: roomNameInput.value,
  });
}
