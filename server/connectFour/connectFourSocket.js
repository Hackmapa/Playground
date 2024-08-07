import post from "../utils/post.js";
import put from "../utils/put.js";

const ROWS = 6;
const COLUMNS = 7;

const checkVictory = (board, player) => {
  const directions = [
    { x: 1, y: 0 }, // Horizontal
    { x: 0, y: 1 }, // Vertical
    { x: 1, y: 1 }, // Diagonal \
    { x: 1, y: -1 }, // Diagonal /
  ];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      if (board[row][col] !== player.color) continue;

      for (let { x, y } of directions) {
        let count = 1;
        for (let k = 1; k < 4; k++) {
          const newRow = row + k * y;
          const newCol = col + k * x;
          if (newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLUMNS)
            break;
          if (board[newRow][newCol] === player.color) count++;
          else break;
        }
        if (count === 4) return true;
      }
    }
  }
  return false;
};

const checkDraw = (board) => {
  return board.every((row) => row.every((cell) => cell !== null));
};

export default (io, games) => {
  io.on("connection", (socket) => {
    // create tic tac toe game
    socket.on(
      "createConnectFourGame",
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
          currentBoard: Array(6)
            .fill(null)
            .map(() => Array(7).fill(null)),
          currentPlayer: {
            color: "",
            user: null,
          },
          winner: null,
          draw: false,
          gameTag: "connect-four",
          dbGameId: 0,
          owner: user,
          logs: [],
        };

        user.ready = false;
        user.owner = true;

        game.players.push(user);
        socket.join(game.id);
        games.push(game);

        game.logs.push({
          id: game.logs.length + 1,
          message: `${user.username} a créé la partie`,
          type: "create",
          createdAt: new Date(),
        });

        console.log("Game created: ", game.id);

        io.to(game.id).emit("connectFourRoom", game);
        io.emit("connectFourRooms", games);
      }
    );

    // join tic tac toe game
    socket.on("joinConnectFourGame", (gameId, user) => {
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

      console.log("Player joined game: ", game.id);

      io.to(game.id).emit("connectFourRoom", game);
      io.emit("connectFourRooms", games);
    });

    // get all tic tac toe games
    socket.on("getConnectFourGames", () => {
      io.emit("connectFourRooms", games);
    });

    // get one tic tac toe game
    socket.on("getConnectFourGame", (gameId) => {
      const game = games.find((game) => game.id == gameId);

      io.emit("connectFourRoom", game);
    });

    // leave tic tac toe game
    socket.on("leaveConnectFourGame", async (gameId, userId, token) => {
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
          currentBoard: Array(6)
            .fill(null)
            .map(() => Array(7).fill(null)),
          currentPlayer: {
            color: "",
            user: null,
          },
          winner: null,
          draw: false,
          gameTag: "connect-four",
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
      io.to(game.id).emit("connectFourRoom", game);
      io.emit("connectFourRooms", games);

      console.log(`User ${userId} left room: ${gameId}`);
    });

    // set ready
    socket.on("setReadyConnectFour", (gameId, userId) => {
      const game = games.find((game) => game.id == gameId);
      const player = game.players.find((player) => player.id === userId);

      player.ready = !player.ready;

      io.to(game.id).emit("connectFourRoom", game);
    });

    socket.on("startConnectFourGame", async (gameId, token) => {
      const game = games.find((game) => game.id == gameId);
      game.started = true;
      const currentPlayer = Math.floor(Math.random() * game.players.length);
      game.currentPlayer = {
        color: "Red",
        user: game.players[currentPlayer],
      };

      game.currentBoard = Array(ROWS)
        .fill(null)
        .map(() => Array(COLUMNS).fill(null));
      game.moves.push({ player: game.currentPlayer, board: game.currentBoard });
      game.turn = 0;

      const body = {
        gameId: 3,
        players: game.players,
        name: game.name,
        gameTag: "connect-four",
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

      io.to(game.id).emit("connectFourRoom", game, id);
      io.emit("connectFourRooms", games);
    });

    socket.on(
      "makeConnectFourMove",
      async (gameId, userId, index, token, dbGameId) => {
        const game = games.find((game) => game.id == gameId);
        const user = game.players.find((user) => user.id === userId);

        if (game.players.length < game.maxPlayers) return;

        const player = game.currentPlayer;

        if (user.id !== player.user.id) return;

        let row = ROWS - 1;
        while (row >= 0) {
          if (game.currentBoard[row][index] === null) {
            game.currentBoard[row][index] = player.color;
            break;
          }
          row--;
        }

        game.moves.push({ player: player, board: game.currentBoard });
        game.turn++;

        game.logs.push({
          id: game.logs.length + 1,
          message: `${player.user.username} a joué`,
          createdAt: new Date(),
          type: "move",
        });

        const winner = checkVictory(game.currentBoard, player);
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
            color: player.color === "Red" ? "Yellow" : "Red",
            user: game.players.find((user) => user.id !== player.user.id),
          };
        }

        const url = `turns/${parseInt(dbGameId)}`;
        const body = JSON.stringify(game);
        await post(url, body, token);

        io.to(game.id).emit("connectFourRoom", game);
      }
    );

    socket.on("resetConnectFourGame", (gameId) => {
      const game = games.find((game) => game.id == gameId);
      game.started = false;
      game.finished = false;
      game.turn = 0;
      game.moves = [];
      game.currentBoard = Array(6)
        .fill(null)
        .map(() => Array(7).fill(null));
      game.currentPlayer = {
        symbol: "",
        user: null,
      };
      game.winner = null;
      game.draw = false;
      game.players.map((player) => (player.ready = false));
      game.logs = [];

      io.to(game.id).emit("connectFourRoom", game);
    });
  });
};
