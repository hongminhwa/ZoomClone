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



// function onSocketClose() {
//     console.log("DisConnected from browser");
// }

// function onSocketMessage(message) {
//     console.log("This is " + message);
// }
// const sockets = [ ];


// const wss = new WebSocket.Server({ server }); 
// wss.on("connection", (socket) => {
//     sockets.push(socket); 
//     socket["nickname"] = "Anon";
//     console.log("connected to Browser");
//     socket.on("close", onSocketClose); 
//     // socket.on("message", onSocketMessage ); 
//     socket.on("message", (msg) => {
//        const message = JSON.parse(msg);  
//     switch (message.type) {
//         case "new-message": 
//        sockets.forEach((aSocket)=> aSocket.send
//              (`${socket.nickname}: ${message.payload}`));
//             break;
//              case "nickname": 
//             console.log(message.payload);
//             socket["nickname"] = message.payload;
//             break;
//         }
//     });
// });



httpServer.listen(PORT, handleListening);

