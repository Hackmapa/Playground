import post from "../utils/post.js";

// function to check if a player has won the rock paper scissors game
const checkWin = (moves) => {
  const winConditions = [
    ["rock", "scissors"],
    ["scissors", "paper"],
    ["paper", "rock"],
  ];

  for (let i = 0; i < winConditions.length; i++) {
    if (moves[0] === winConditions[i][0] && moves[1] === winConditions[i][1]) {
      return true;
    }
  }
  return false;
};

export default (io, games) => {
  io.on("connection", (socket) => {
    // create rock paper scissors game
    socket.on(
      "createRpsGame",
      (name, user, privateRoom = false, password = "") => {
        const game = {
          id: games.length + 1,
          name: name,
          players: [],
          maxPlayers: 2,
          messages: [],
          started: false,
          finished: false,
          turn: 0,
          moves: [],
          currentPlayer: {
            user: null,
          },
          winner: null,
          privateRoom: privateRoom,
          password: password,
          gameTag: "rock-paper-scissors",
        };
        console.log("User: ", user);

        user.ready = false;
        user.owner = true;

        game.players.push(user);
        socket.join(game.id);
        games.push(game);

        console.log("Game RPS created: ", game.id);

        io.to(game.id).emit("rpsRoom", game);
        io.emit("rpsRooms", games);
      }
    );

    // join rock paper scissors game
    socket.on("joinRpsGame", (gameId, user) => {
      const game = games.find((game) => game.id === gameId);

      user.ready = false;
      user.owner = false;

      game.players.push(user);
      socket.join(game.id);

      console.log("Player joined RPS game: ", game.id);

      io.to(game.id).emit("rpsRoom", game);
      io.emit("rpsRooms", games);
    });

    // get all rock paper scissors games
    socket.on("getRpsGames", () => {
      io.emit("rpsRooms", games);
    });

    // get one rock paper scissors game
    socket.on("getRpsGame", (gameId) => {
      const game = games.find((game) => game.id == gameId);

      io.emit("rpsRoom", game);
    });

    // leave rock paper scissors game
    socket.on("leaveRpsGame", (gameId, userId) => {
      const game = games.find((game) => game.id === gameId);
      if (!game) return;
      game.players = game.players.filter((player) => player.id != userId);

      if (game.players.length === 0) {
        games = games.filter((g) => g.id !== game.id);
      }

      games = games.map((g) => (g.id === game.id ? game : g));

      console.log("Player left game: ", game.id);

      io.to(game.id).emit("rpsRoom", game);
      socket.leave(game.id);

      io.emit("rpsRooms", games);
    });

    // set ready
    socket.on("setReadyRps", (gameId, userId) => {
      const game = games.find((game) => game.id == gameId);
      const player = game.players.find((player) => player.id === userId);

      player.ready = !player.ready;

      io.to(game.id).emit("rpsRoom", game);
    });

    socket.on("startRpsGame", async (gameId, token) => {
      const game = games.find((game) => game.id == gameId);
      game.started = true;
      const currentPlayer = Math.floor(Math.random() * game.players.length);
      game.currentPlayer = {
        symbol: "X",
        user: game.players[currentPlayer],
      };

      console.log("Game started: ", game.id);

      const body = {
        gameId: 1,
        players: game.players,
        name: game.name,
        gameTag: "rock-paper-scissors",
      };

      const response = await post("games", JSON.stringify(body), token);
      const id = response.id;
      io.to(game.id).emit("rpsRoom", game, id);
    });

    socket.on("makeMove", async (gameId, userId, index, token, dbGameId) => {
      const game = games.find((game) => game.id == gameId);
      const user = game.players.find((user) => user.id === userId);
      const player = game.currentPlayer;

      if (user.id !== player.user.id) return;

      if (winner) {
        game.winner = player;
        game.currentPlayer = {
          symbol: "",
          user: null,
        };
        game.finished = true;

        const body = {
          finished: true,
          draw: false,
          winner: player.user.id,
        };

        const url = `games/${dbGameId}`;
        await put(url, JSON.stringify(body), token);
      } else if (draw) {
        game.draw = true;
        game.currentPlayer = {
          symbol: "",
          user: null,
        };
        game.finished = true;

        const body = {
          finished: true,
          draw: true,
        };

        const url = `games/${dbGameId}`;
        await put(url, JSON.stringify(body), token);
      } else {
        game.currentPlayer = {
          symbol: player.symbol === "X" ? "O" : "X",
          user: game.players.find((user) => user.id !== player.user.id),
        };
      }

      const url = `turns/${parseInt(dbGameId)}`;
      const body = JSON.stringify(game);
      await post(url, body, token);

      io.to(game.id).emit("rpsRoom", game);
    });

    socket.on("resetRpsGame", (gameId) => {
      const game = games.find((game) => game.id == gameId);
      game.started = false;
      game.finished = false;
      game.turn = 0;
      game.moves = [];
      game.currentPlayer = {
        symbol: "",
        user: null,
      };
      game.winner = null;
      game.draw = false;
      game.players.map((player) => (player.ready = false));

      io.to(game.id).emit("rpsRoom", game);
    });
  });
};
