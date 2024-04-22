// messageSocket.js
module.exports = (io, games) => {
  io.on("connection", (socket) => {
    // create tic tac toe game
    socket.on("createTicTacToeGame", (name, user) => {
      const game = {
        id: games.length + 1,
        name: name,
        players: [],
      };

      game.players.push(user);
      socket.join(game.id);
      games.push(game);

      console.log("Game created: ", game.id);

      io.to(game.id).emit("ticTacToeRoom", game);
      io.emit("ticTacToeRooms", games);
    });

    // join tic tac toe game
    socket.on("joinTicTacToeGame", (gameId, user) => {
      const game = games.find((game) => game.id === gameId);
      game.players.push(user);
      socket.join(game.id);

      console.log("Player joined game: ", game.id);

      io.to(game.id).emit("ticTacToeRoom", game);
      io.emit("ticTacToeRooms", games);
    });

    // get all tic tac toe games
    socket.on("getTicTacToeGames", () => {
      io.emit("ticTacToeRooms", games);
    });

    // get one tic tac toe game
    socket.on("getTicTacToeGame", (gameId) => {
      const game = games.find((game) => game.id == gameId);

      io.emit("ticTacToeRoom", game);
    });

    // leave tic tac toe game
    socket.on("leaveTicTacToeGame", (gameId, userId) => {
      const game = games.find((game) => game.id === gameId);
      if (!game) return;
      game.players = game.players.filter((player) => player.id != userId);

      if (game.players.length === 0) {
        games = games.filter((g) => g.id !== game.id);
      }

      games = games.map((g) => (g.id === game.id ? game : g));

      io.to(game.id).emit("ticTacToeRoom", game);
      socket.leave(game.id);

      io.emit("ticTacToeRooms", games);
    });
  });
};
