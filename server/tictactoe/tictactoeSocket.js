import post from "../utils/post.js";
import put from "../utils/put.js";

const checkWin = (updatedBoard) => {
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (
      updatedBoard[a] &&
      updatedBoard[a] === updatedBoard[b] &&
      updatedBoard[a] === updatedBoard[c]
    ) {
      return true;
    }
  }
  return false;
};

const checkDraw = (updatedBoard) => {
  return updatedBoard.every((cell) => cell !== "");
};

export default (io, games) => {
  io.on("connection", (socket) => {
    // create tic tac toe game
    socket.on(
      "createTicTacToeGame",
      (name, user, privateRoom = false, password = "") => {
        const game = {
          id: games.length + 1,
          name,
          privateRoom,
          password,
          players: [],
          maxPlayers: 2,
          messages: [],
          started: false,
          finished: false,
          turn: 0,
          moves: [],
          currentBoard: Array(9).fill(""),
          currentPlayer: {
            symbol: "",
            user: null,
          },
          winner: null,
          draw: false,
          gameTag: "tic-tac-toe",
          dbGameId: 0,
          owner: null,
          logs: [],
        };

        user.ready = false;
        user.owner = true;
        game.owner = user;

        game.players.push(user);
        socket.join(game.id);
        games.push(game);

        game.logs.push({
          id: game.logs.length + 1,
          message: `${user.username} a créé la partie`,
          type: "create",
          createdAt: new Date(),
        });

        io.to(game.id).emit("ticTacToeRoom", game);
        io.emit("ticTacToeRooms", games);
      }
    );

    // join tic tac toe game
    socket.on("joinTicTacToeGame", (gameId, user) => {
      const game = games.find((game) => game.id === gameId);

      user.ready = false;
      user.owner = false;

      game.players.push(user);
      socket.join(game.id);

      game.logs.push({
        id: game.logs.length + 1,
        message: `${user.username} a rejoint la partie`,
        type: "join",
        createdAt: new Date(),
      });

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
    socket.on("leaveTicTacToeGame", async (gameId, userId, token) => {
      let game = games.find((room) => room.id === gameId);
      const user = game.players.find((player) => player.id === userId);

      if (!game || !user) return;

      game.players = game.players.filter((player) => player.id !== userId);
      socket.leave(game.id);

      if (game.players.length !== 0 && game.players.length < game.maxPlayers) {
        if (game.started) {
          const body = {
            finished: false,
            canceled: true,
            draw: false,
            winner: null,
          };

          const url = `games/${game.dbGameId}`;
          await put(url, JSON.stringify(body), token);
        }

        // check if the owner left, if so, assign a new owner
        if (game.owner.id === userId) {
          game.owner = game.players[0];
          game.players[0].owner = true;
          game.owner.ready = false;
          game.players[0].ready = false;
        }

        game = {
          id: game.id,
          name: game.name,
          privateRoom: game.privateRoom,
          password: game.password,
          started: false,
          finished: false,
          players: game.players,
          owner: game.owner,
          maxPlayers: 2,
          messages: [],
          turn: 0,
          moves: [],
          currentBoard: Array(9).fill(""),
          currentPlayer: {
            symbol: "",
            user: null,
          },
          winner: null,
          draw: false,
          gameTag: "tic-tac-toe",
          dbGameId: 0,
          logs: game.logs,
        };

        games = games.map((r) => (r.id === gameId ? game : r));
      }

      if (game.players.length === 0) {
        games = games.filter((r) => r.id !== gameId);
      }

      game.logs.push({
        id: game.logs.length + 1,
        message: `${user.username} a quitté la partie`,
        createdAt: new Date(),
        type: "leave",
      });

      // Otherwise, notify the remaining players
      io.to(game.id).emit("ticTacToeRoom", game);
      io.emit("ticTacToeRooms", games);

      console.log(`User ${userId} left room: ${gameId}`);
    });

    // set ready
    socket.on("setReadyTicTacToe", (gameId, userId) => {
      const game = games.find((game) => game.id == gameId);
      const player = game.players.find((player) => player.id === userId);

      player.ready = !player.ready;

      io.to(game.id).emit("ticTacToeRoom", game);
    });

    socket.on("startTicTacToeGame", async (gameId, token) => {
      const game = games.find((game) => game.id == gameId);
      game.started = true;
      const currentPlayer = Math.floor(Math.random() * game.players.length);
      game.currentPlayer = {
        symbol: "X",
        user: game.players[currentPlayer],
      };
      game.currentBoard = Array(9).fill("");
      game.moves.push({ player: game.currentPlayer, board: game.currentBoard });

      console.log("Game TTT started: ", game.id);

      const body = {
        gameId: 2,
        players: game.players,
        name: game.name,
        gameTag: "tic-tac-toe",
      };

      const response = await post("games", JSON.stringify(body), token);
      const id = response.id;

      game.dbGameId = id;

      game.logs.push({
        id: game.logs.length + 1,
        message: `La partie a commencé`,
        createdAt: new Date(),
        type: "start",
      });

      io.to(game.id).emit("ticTacToeRoom", game, id);
      io.emit("ticTacToeRooms", games);
    });

    socket.on("makeMove", async (gameId, userId, index, token, dbGameId) => {
      const game = games.find((game) => game.id == gameId);
      const user = game.players.find((user) => user.id === userId);

      if (game.players.length < game.maxPlayers) return;

      const player = game.currentPlayer;

      if (user.id !== player.user.id) return;

      game.currentBoard[index] = player.symbol;
      game.moves.push({ player: player, board: game.currentBoard });
      game.turn++;

      game.logs.push({
        id: game.logs.length + 1,
        message: `${player.user.username} a joué`,
        createdAt: new Date(),
        type: "move",
      });

      const winner = checkWin(game.currentBoard);
      const draw = checkDraw(game.currentBoard);

      if (winner) {
        game.winner = player;
        game.currentPlayer = {
          symbol: "",
          user: null,
        };
        game.finished = true;

        game.logs.push({
          id: game.logs.length + 1,
          message: `${player.user.username} a gagné`,
          createdAt: new Date(),
          type: "end",
        });

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

        game.logs.push({
          id: game.logs.length + 1,
          message: `Match nul`,
          createdAt: new Date(),
          type: "end",
        });

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

      io.to(game.id).emit("ticTacToeRoom", game);
    });

    socket.on("resetTicTacToeGame", (gameId) => {
      const game = games.find((game) => game.id == gameId);
      game.started = false;
      game.finished = false;
      game.turn = 0;
      game.moves = [];
      game.currentBoard = Array(9).fill("");
      game.currentPlayer = {
        symbol: "",
        user: null,
      };
      game.winner = null;
      game.draw = false;
      game.logs = [];
      game.players.map((player) => (player.ready = false));

      io.to(game.id).emit("ticTacToeRoom", game);
      io.emit("ticTacToeRooms", games);
    });
  });
};
