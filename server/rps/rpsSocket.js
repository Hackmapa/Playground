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
          winner: {
            user: null,
          },
          privateRoom: privateRoom,
          password: password,
          gameTag: "rock-paper-scissors",
          roundWinners: [null, null, null],
        };

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
      const game = games.find((room) => room.id === gameId);

      if (!game) return;

      game.players = game.players.filter((player) => player.id !== userId);

      socket.leave(game.id);

      if (game.players.length === 0) {
        // If no players left, delete the room
        games = games.filter((r) => r.id !== gameId);
      } else {
        // Otherwise, notify the remaining players
        io.to(game.id).emit("rpsRoom", game);
        io.emit("rpsRooms", games);
      }

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
      console.log("Game created in DB: ", id);
      io.to(game.id).emit("rpsRoom", game, id);
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
        const winner = checkWin(game.moves[game.turn]);
        game.roundWinners[game.turn] = winner;
        game.moves[game.turn].push({ winner: winner });

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
      game.players.map((player) => (player.ready = false));

      io.to(game.id).emit("rpsRoom", game);
    });
  });
};
