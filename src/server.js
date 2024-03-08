import express from "express"; 
import http from "http"; 
// import WebSocket from "ws";
import SocketIO from "socket.io";
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

httpServer.listen(PORT, handleListening);


