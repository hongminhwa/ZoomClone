import express from "express"; 
import http from "http"; 
import WebSocket from "ws";
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


const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); 


function onSocketClose() {
    console.log("DisConnected from browser");
}

// function onSocketMessage(message) {
//     console.log("This is " + message);
// }
const sockets = [ ];


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


server.listen(PORT, handleListening);

