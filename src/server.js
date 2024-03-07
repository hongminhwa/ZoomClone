import express from "express"; 
import http from "http"; 
// import WebSocket from "ws";
import  SocketIO from "socket.io";
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

const wsServer = SocketIO(httpServer);


wsServer.on("connection", (socket) => { 
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`); 
    });

    socket.on("enter-room", (roomName, nickname, done) => { 
        console.log(socket.id);
        socket["nickname"] = nickname; 
        socket.join(roomName);   
        console.log(roomName);
        socket.to(roomName).emit("welcome", socket.nickname); 
        done(); 
    }); 
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname)); 
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

