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
    const input = room.querySelector("input"); 
    const value = input.value;
    socket.emit("new-message", input.value,
       roomName, ()=> {
       addMessage(`You: ${value}`);   
    });   
    input.value="";
} 





function showRoom(msg) {
    console.log(`The backend says: `, msg ); 
    welcome.hidden = true; 
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const form = room.querySelector("form"); 
    form.addEventListener("submit", handleMessageSubmit)

};



function handleRoomSubmit(event) {
    event.preventDefault();  
    const input = form.querySelector("input"); 
    socket.emit("enter-room", input.value,  showRoom);
    //value값이라는 room이 있으면 함수를 실행한다.
    roomName = input.value;
    input.value ="";
 
}
form.addEventListener("submit", handleRoomSubmit); 

socket.on("welcome", ()=> {
    addMessage("someone Joined!");
});
socket.on("bye", ()=> {
    addMessage("someone lefted!");
});

socket.on("new-message", addMessage);
