const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.static(__dirname + "/public")); 
ch=0;
io.on("connection", (socket) => {
    console.log("✅ A user connected:", socket.id);

    socket.emit("connectSuccess", { ch });
    socket.on("sendMessage", (data) => {
        console.log("📩 Received sendMessage event:", data);
        io.emit("receiveMessage", data);
    });
    socket.on("sm", (data) => {
        console.log("📩 Received sendMessage event:", data);
        io.emit("rm", data);
    });

    console.log("➡️ Sent `connectSuccess` event with ch:", ch);

    if(ch==0)
        ch=1;
    else
    ch=0;
    socket.on("disconnect", () => {
        // ch--;
        console.log("❌ User disconnected:", socket.id);
    });
});

server.listen(5001, () => {
    console.log("Server running on http://localhost:5001");
});
