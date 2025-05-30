// create a webscoket server with ws
import { WebSocketServer } from "ws";
import express from "express";

const app = express();
const server = app.listen(8080, () => {
    console.log("Server started on port 8080");
});

const wss = new WebSocketServer({ server });
let allSockets=[];

wss.on("connection", (ws) => {
    console.log("Client connected");
    allSockets.push(ws)
    ws.on("message", (message) => {
        // console.log("Message from client:", message.toString());
        allSockets.forEach((socket)=>{
            socket.send(message.toString());
        })
    });
});