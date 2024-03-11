websocket
/////////////app.js/////////////////////////////////

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

///////////////pug///////////////////////////////////
// main 
// form#nick
//     input(type="text", placeholder="choose a nickname", required)
//     button Save
// ul
// form#message
//     input(type="text", placeholder="write a message", required)
//     button Send        


//////////server.js///////////////////////////////// 
function onSocketClose() {
    console.log("DisConnected from browser");
}

function onSocketMessage(message) {
    console.log("This is " + message);
}
const sockets = [ ];


const wss = new WebSocket.Server({ server }); 
wss.on("connection", (socket) => {
    sockets.push(socket); 
    socket["nickname"] = "Anon";
    console.log("connected to Browser");
    socket.on("close", onSocketClose); 
    // socket.on("message", onSocketMessage ); 
    socket.on("message", (msg) => {
       const message = JSON.parse(msg);  
    switch (message.type) {
        case "new-message": 
       sockets.forEach((aSocket)=> aSocket.send
             (`${socket.nickname}: ${message.payload}`));
            break;
             case "nickname": 
            console.log(message.payload);
            socket["nickname"] = message.payload;
            break;
        }
    });
});