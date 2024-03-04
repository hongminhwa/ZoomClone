const handleListening=  () => {
    console.log(`server listening on port http://localhost:${PORT}`); 
};

app.listen(PORT, handleListening);


function handleConnection(socket) {
    console.log(socket);
}

wss.on("connection", handleConnection);




///////////////////////////////
function onSocketClose() {
    console.log("DisConnected from browser");
}

function onSocketMessage(message) {
    console.log("This is " + message);
}

wss.on("connection", (socket) => {
    console.log("connected to Browser");
    socket.on("close", onSocketClose); 
    socket.on("message", onSocketMessage ); 
    socket.send("hello");
});

setTimeout(()=> {
    socket.send("hello from the browser! checking setTimeout");
}, 10000);

