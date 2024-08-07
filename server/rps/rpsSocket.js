import post from "../utils/post.js";
import put from "../utils/put.js";

const checkWin = (move) => {
  const beats = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper",
  };

  const move1 = move[0];
  const move2 = move[1];

  if (move1.move === move2.move) {
    return "draw";
  } else if (beats[move1.move] === move2.move) {
    return move1.user;
  } else {
    return move2.user;
  }
};

const translateMove = (move) => {
  switch (move) {
    case "rock":
      return "Pierre";
    case "paper":
      return "Papier";
    case "scissors":
      return "Ciseaux";
    default:
      return "";
  }
};

export default (io, games) => {
  io.on("connection", (socket) => {
    // create rock paper scissors game
    socket.on(
      "createRpsGame",
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
          winner: {
            user: null,
          },
          draw: false,
          gameTag: "rock-paper-scissors",
          roundWinners: [null, null, null],
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

      game.logs.push({
        id: game.logs.length + 1,
        message: `${user.username} a rejoint la partie`,
        type: "join",
        createdAt: new Date(),
      });

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
    socket.on("leaveRpsGame", async (gameId, userId, token) => {
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
          maxPlayers: 2,
          messages: [],
          turn: 0,
          moves: [],
          winner: {
            user: null,
          },
          draw: false,
          gameTag: "rock-paper-scissors",
          roundWinners: [null, null, null],
          dbGameId: 0,
          owner: game.owner,
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
      io.to(game.id).emit("rpsRoom", game);
      io.emit("rpsRooms", games);

      console.log(`User ${userId} left room: ${gameId}`);
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
      game.draw = false;
      game.turn = 0;
      game.moves = [[], [], []];
      game.roundWinners = [null, null, null];
      game.winner = {
        user: null,
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

      game.dbGameId = id;

      game.logs.push({
        id: game.logs.length + 1,
        message: `La partie a commencé`,
        createdAt: new Date(),
        type: "start",
      });

      io.to(game.id).emit("rpsRoom", game, id);
      io.emit("rpsRooms", games);
    });

    socket.on("makeRpsMove", async (gameId, userId, token, dbGameId, move) => {
      const game = games.find((game) => game.id == gameId);
      const user = game.players.find((user) => user.id === userId);

      if (game.players.length < game.maxPlayers) return;

      // check if user has already made a move
      if (
        game.moves[game.turn] &&
        game.moves[game.turn].find((m) => m.user.id === userId)
      ) {
        return;
      }

      game.moves[game.turn].push({
        user: user,
        move: move,
      });

      // check if all players have made a move
      if (
        game.moves[game.turn] &&
        game.moves[game.turn].length === game.players.length
      ) {
        game.logs.push({
          id: game.logs.length + 1,
          message: `Tous les joueurs ont fait leur choix`,
          createdAt: new Date(),
          type: "info",
        });

        const winner = checkWin(game.moves[game.turn]);
        game.roundWinners[game.turn] = winner;
        game.moves[game.turn].push({ winner: winner });

        game.moves[game.turn].map((move) => {
          if (move.user) {
            game.logs.push({
              id: game.logs.length + 1,
              message: `${move.user.username} a joué ${translateMove(
                move.move
              )}`,
              createdAt: new Date(),
              type: "move",
            });
          }
        });

        if (winner === "draw") {
          game.logs.push({
            id: game.logs.length + 1,
            message: `Egalité`,
            createdAt: new Date(),
            type: "info",
          });
        } else {
          game.logs.push({
            id: game.logs.length + 1,
            message: `${winner.username} a gagné la manche`,
            createdAt: new Date(),
            type: "info",
          });
        }

        const url = `turns/${parseInt(dbGameId)}`;
        const body = JSON.stringify(game);
        await post(url, body, token);

        if (game.turn === 2) {
          game.finished = true;
          game.turn++;

          // check who won the game
          const player1 = game.roundWinners.filter(
            (winner) => winner === game.players[0]
          ).length;

          const player2 = game.roundWinners.filter(
            (winner) => winner === game.players[1]
          ).length;

          if (player1 > player2) {
            game.winner.user = game.players[0];
          } else if (player2 > player1) {
            game.winner.user = game.players[1];
          } else {
            game.draw = true;
          }

          game.logs.push({
            id: game.logs.length + 1,
            message: `La partie est terminée, ${
              game.winner.user
                ? game.winner.user.username + " a gagné"
                : "Il y a égalite"
            }`,
            createdAt: new Date(),
            type: "end",
          });

          const body = {
            finished: true,
            draw: game.draw,
            winner: game.winner.user ? game.winner.user.id : null,
          };

          const url = `games/${dbGameId}`;
          await put(url, JSON.stringify(body), token);
        } else {
          game.turn++;
        }
      }

      io.to(game.id).emit("rpsRoom", game);
    });

    socket.on("resetRpsGame", (gameId) => {
      const game = games.find((game) => game.id == gameId);
      game.started = false;
      game.finished = false;
      game.turn = 0;
      game.moves = [];
      game.winner = null;
      game.draw = false;
      game.logs = [];
      game.players.map((player) => (player.ready = false));

      io.to(game.id).emit("rpsRoom", game);
    });
  });
};
