const socket = io();   


const welcome = document.getElementById("welcome"); 
const form = welcome.querySelector("form");   
const room = document.getElementById("room");

room.hidden = true; 

let roomName;  

function addMessage(message) { 
    const ul = room.querySelector ("ul");
    const li = document.createElement("li"); 
    li.innerText = message;
    ul.appendChild(li);

}

function handleMessageSubmit(event) {
    event.preventDefault(); 
    const input = room.querySelector("#msg input"); 
    const value = input.value;
    socket.emit("new-message", input.value,
       roomName, ()=> {
       addMessage(`You: ${value}`);   
    });   
    input.value="";
} 


function handleNicknameSubmit(event) {
    event.preventDefault(); 
    const input = room.querySelector("#name input"); 
    socket.emit("nickname", input.value);
}



function showRoom() {
    // console.log(`The backend says: `, msg ); 
    welcome.hidden = true; 
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg"); 
    const nameForm = room.querySelector("#name"); 
    msgForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNicknameSubmit);

};


////
function handleRoomSubmit(event) {
    const roomNameInput = form.querySelector("#roomName"); 
    const nicknameInput = form.querySelector("#name");
    event.preventDefault();  

    socket.emit("enter-room", roomNameInput.value,  nicknameInput.value , showRoom); 
    roomName = roomNameInput.value; 
    roomNameInput.value = ""; 
    const changeNameInput = room.querySelector("#name input"); 
    changeNameInput.value = nicknameInput.value; 
    //value값이라는 room이 있으면 함수를 실행한다 
}

form.addEventListener("submit", handleRoomSubmit); 

socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    console.log("user:"+ user);
    addMessage(`${user} welcome! `);
});

socket.on("bye", (left, newCount)=> {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    console.log("user:" + left);
    addMessage(`${left} goodBye`);

});

socket.on("new-message", addMessage);

socket.on("room-change", (rooms) => {
    const roomList = welcome.querySelector("ul"); 
    roomList.innerHTML = ""; 
    if(rooms.length === 0) {
        return; 
    }
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room; 
        roomList.append(li);
    });
});
