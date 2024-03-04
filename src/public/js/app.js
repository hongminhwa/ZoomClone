
const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket  = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
    const msg = { type, payload };
    return JSON.stringify(msg);
  }

function handleOpen() {
    console.log("Connected to Server");
};


socket.addEventListener("open", handleOpen);


socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data; 
    messageList.append(li); 
    console.log("New message:  ",  message.data);    

});


socket.addEventListener("close", () => {
    console.log("DisConnected from Browser");
});

function handleSubmit(event) {
    console.log("....");
    event.preventDefault(); 
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new-message", input.value));
    const li = document.createElement("li");
    li.innerText = `You: ${input.value}`; 
    messageList.append(li); 
    input.value = "";
}

function handleNickSubmit(event) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value = "";

}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);