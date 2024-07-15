import http from "http";
import { Server } from "socket.io";
import loginSocket from "./login/loginSocket.js";
import chatSocket from "./message/chatSocket.js";
import ticTacToeSocket from "./tictactoe/tictactoeSocket.js";
import notificationSocket from "./notifications/notificationSocket.js";
import dotenv from "dotenv";
import rpsSocket from "./rps/rpsSocket.js";

dotenv.config();

const server = http.createServer((req, res) => {
  res.end("Connected");
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let users = [];
let messages = [];
let ticTacToeGames = [];

loginSocket(io, users, ticTacToeGames);
chatSocket(io, messages);
ticTacToeSocket(io, ticTacToeGames, users);
rpsSocket(io, ticTacToeGames, users);
notificationSocket(io, users);

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
