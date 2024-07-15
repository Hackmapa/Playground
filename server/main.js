import http from "http";
import { Server } from "socket.io";
import loginSocket from "./login/loginSocket.js";
import chatSocket from "./message/chatSocket.js";
import ticTacToeSocket from "./tictactoe/tictactoeSocket.js";
import notifications from "./notifications/notifications.js";
import dotenv from "dotenv";

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
notifications(io, users);

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
