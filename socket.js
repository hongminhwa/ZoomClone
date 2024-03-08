///////////////////app.js///////////////////////////
//  // 
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


////////////////////server.js///////////////////// 
import express from "express"; 
import http from "http"; 
// import WebSocket from "ws";
import  {Server} from "socket.io";
import { instrument } from "@socket.io/admin-ui";
const PORT = 4000; 

const app = express(); 

 
app.set("view engine", "pug");
app.set("views", __dirname + "/views");  
app.use("/public", express.static(__dirname + "/public"));



app.get("/", (req, res) => res.render("home"));

//catchall url => app.get("/*", (req, res) => res.redirect("/")); 


const handleListening=  () => {
    console.log(`server listening on port http://localhost:${PORT}`); 
};



const httpServer = http.createServer(app);

httpServer.listen(PORT, handleListening);



const wsServer = new Server(httpServer, {
    cors: {
      origin: ["https://admin.socket.io"],
      credentials: true,
    },
  });;

  instrument(wsServer, {
    auth: false
  });


function publicRooms() {

    const {
        sockets: {
            adapter: {sids, rooms }, 
        }, 
    } = wsServer;

    const publicRooms = []; 
    rooms.forEach((_,key) => {
        if(sids.get(key) === undefined) {
            publicRooms.push(key)
        }
    });
    return publicRooms; 

}

function countRoom(roomName) { 
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;    
}

wsServer.on("connection", (socket) => { 
    socket["nickname"] = "Anon";
    socket.onAny((event) => {

        console.log(wsServer.sockets.adapter);
        console.log(`Socket Event: ${event}`); 
    });

    socket.on("enter-room", (roomName, nickname, done) => {  
        //룸에서 입장 
        console.log(socket.id);
        socket["nickname"] = nickname; 
        socket.join(roomName);   
        console.log(roomName);
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName)); 
        done(); 
        wsServer.sockets.emit("room-change",publicRooms());
    }); 
    socket.on("disconnecting", () => {
        //룸에서 퇴장 
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(room) -1)
        );
    });  
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room-change", publicRooms());
         
    });
     socket.on("new-message", (msg, room, done) => {
        socket.to(room).emit("new-message", `${socket.nickname}: ${msg}`); 
        done(); 
     });

     socket.on("nickname", (nickname) => (socket["nickname"] = nickname)); 
     
    });

/////////////home.pug///////////////////////////
// html(lang="en")
//     head
//         meta(charset="UTF-8")
//         meta(name="viewport", content="width=device-width, initial-scale=1.0")
//         title Document 
//         link(rel="stylesheet", href="https://unpkg.com/mvp.css")
//     body 
//         header 
//             h1 hello world 
//         main 
//             div#welcome
//                 form 
//                     //- input(placeholder="room name", required, type="text")
//                     input#roomName(placeholder="room name", required, type="text")
//                     input#name(placeholder="Nickname", required, type="text")
//                     button Enter Room
//                 h4 Open Rooms: 
//                 ul  
//             div#room 
//                 h3 
//                 ul 
//                 form#name
//                     input(placeholder="Nickname", required, type="text")
//                     button change
//                 form#msg 
//                     input(placeholder="message name", required, type="text")
//                     button Send Message

                    
//         script(src="/socket.io/socket.io.js")
//         script(src="/public/js/app.js")
