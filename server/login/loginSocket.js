module.exports = (io, users, ticTacToeGames) => {
  io.on("connection", (socket) => {
    socket.on("login", (user) => {
      users.push({ socketId: socket.id, user: user });
      console.log("User joined", socket.id);
      io.emit("users", users);
    });

    socket.on("disconnect", () => {
      const user = users.find((user) => user.socketId == socket.id)?.user;
      users = users.filter((user) => user.socketId !== socket.id);

      leaveTicTacToeGame(io, socket, user, ticTacToeGames);

      console.log("User left", socket.id);

      io.emit("users", users);
    });
  });
};

const leaveTicTacToeGame = (io, socket, user, ticTacToeGames) => {
  if (!user) return;

  const game = ticTacToeGames.find((game) =>
    game.players.find((player) => player.id === user.id)
  );

  if (!game) return;

  game.players = game.players.filter((player) => player.id !== user.id);

  if (game.players.length === 0) {
    ticTacToeGames = ticTacToeGames.filter((g) => g.id !== game.id);
  }

  ticTacToeGames = ticTacToeGames.map((g) => (g.id === game.id ? game : g));

  io.to(game.id).emit("ticTacToeRoom", game);
  socket.leave(game.id);

  io.emit("ticTacToeRooms", ticTacToeGames);

  console.log("User left tic tac toe game", game.id);
};
