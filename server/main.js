const http = require("http");
const socketIo = require("socket.io");
const loginSocket = require("./login/loginSocket");
const chatSocket = require("./message/chatSocket");
const ticTacToeSocket = require("./tictactoe/tictactoeSocket");
require("dotenv").config();

const server = http.createServer((req, res) => {
  res.end("Connected");
});

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

let users = [];
let messages = [];
let ticTacToeGames = [];

loginSocket(io, users);
chatSocket(io, messages);
ticTacToeSocket(io, ticTacToeGames);

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
