// messageSocket.js
module.exports = (io, games) => {
  io.on("connection", (socket) => {
    socket.on("createTicTacToeGame", (name, user) => {
      const game = {
        id: games.length + 1,
        name: name,
        players: [],
      };
      game.players.push(user);
      socket.join(game.id);
      games.push(game);

      console.log("TicTacToe Room created: ", game);

      io.emit("ticTacToeRoom", game);
      io.emit("ticTacToeRooms", games);
    });

    socket.on("joinTicTacToeGame", (gameId, user) => {
      const game = games.find((game) => game.id === gameId);
      game.players.push(user);
      socket.join(game.id);
      console.log("TicTacToe Room joined: ", game);
      io.emit("ticTacToeRooms", games);
    });

    socket.on("getTicTacToeGames", () => {
      io.emit("ticTacToeRooms", games);
      console.log("TicTacToe Rooms sent: ", games);
    });
  });
};
