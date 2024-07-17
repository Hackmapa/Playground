import Character from "./classes/character.js";
import Game from "./classes/game.js";
import spells from "./constants/spells.js";
import post from "../utils/post.js";
import put from "../utils/put.js";

const createCharacterFromUser = (user) => {
  const character = new Character(
    user.id,
    user.firstname,
    user.lastname,
    100,
    100,
    10,
    spells,
    user.username
  );

  return character;
};

const createCharacter = (character) => {
  const newCharacter = new Character(
    character.id,
    character.firstname,
    character.lastname,
    character.maxHealth,
    character.maxMana,
    character.attack,
    spells,
    character.username
  );

  return newCharacter;
};

export default (io, rooms) => {
  // Socket connection
  io.on("connection", (socket) => {
    // Update rooms
    socket.on("getHarryPotterGames", () => {
      io.emit("harryPotterRooms", rooms);
    });

    socket.on("getHarryPotterGame", (gameId) => {
      const room = rooms.find((game) => game.id == gameId);

      io.emit("harryPotterRoom", room);
    });

    // Create room
    socket.on("createHarryPotterGame", (name, user, privateRoom, password) => {
      const room = {
        id: rooms.length + 1,
        players: [],
        maxPlayers: 2,
        characters: [],
        name: name,
        game: null,
        messages: [],
        logs: [],
        currentPlayer: {
          symbol: "",
          user: null,
        },
        started: false,
        finished: false,
        winner: {
          user: null,
        },
        draw: false,
        privateRoom: privateRoom,
        password: password,
        gameTag: "harry-potter",
      };

      user.ready = false;
      user.owner = true;

      const character = createCharacterFromUser(user);

      room.characters.push(character);

      room.players.push(user);
      socket.join(room.id);
      rooms.push(room);

      io.to(room.id).emit("harryPotterRoom", room);
      io.emit("harryPotterRooms", rooms);
    });

    // Join room
    socket.on("joinHarryPotterGame", (roomId, user) => {
      const room = rooms.find((room) => room.id === roomId);

      user.ready = false;
      user.owner = false;

      const character = createCharacterFromUser(user);

      room.characters.push(character);
      room.players.push(user);
      socket.join(room.id);

      console.log("Player joined game: ", room.id);

      io.to(room.id).emit("harryPotterRoom", room);
      io.emit("harryPotterRooms", rooms);
    });

    // Start game
    socket.on("startHarryPotterGame", async (gameId, token) => {
      const room = rooms.find((room) => room.id === gameId);
      const characters = room.characters;

      if (room.players.length < 2) {
        return;
      }

      const newCharacters = characters.map((character) => {
        return createCharacter(character);
      });

      const game = new Game(newCharacters, room.id);

      game.startGame();
      room.game = game;
      room.started = true;

      const body = {
        gameId: 4,
        players: room.players,
        name: room.name,
        gameTag: "harry-potter",
      };

      const response = await post("games", JSON.stringify(body), token);
      const id = response.id;

      room.logs = game.logs;

      io.to(room.id).emit("harryPotterRoom", room, id);
    });

    // Cast spell
    socket.on(
      "castHarryPotterSpell",
      async (actualRoom, character, target, castedSpell, token, dbGameId) => {
        const updatedRoom = rooms.find((room) => room.id === actualRoom.id);
        const thisSpell = spells.find((spell) => spell.id === castedSpell);

        if (updatedRoom.players.length < updatedRoom.maxPlayers) return;

        const casterCharacter = updatedRoom.game.characters.find(
          (c) => c.id === character.id
        );
        const targetCharacter = updatedRoom.game.characters.find(
          (character) => character.id === target.id
        );
        const game = updatedRoom.game;

        game.characters.map((actualCharacter) => {
          if (actualCharacter.id === character.id) {
            socket.action = actualCharacter.castSpell.bind(
              actualCharacter,
              thisSpell,
              targetCharacter
            );
            socket.character = casterCharacter;
          }
        });

        const room = io.sockets.adapter.rooms.get(actualRoom.id);

        let canExecute = true;

        for (const socketId of room) {
          const socket = io.sockets.sockets.get(socketId);
          if (!socket.action) {
            canExecute = false;
            break;
          }
        }

        if (canExecute) {
          for (const socketId of room) {
            const socket = io.sockets.sockets.get(socketId);

            game.handleUserTurn(socket.character, socket.action);
            socket.action = null;
          }
          if (!game.isGameOver()) {
            const url = `turns/${parseInt(dbGameId)}`;
            const body = JSON.stringify(game);
            await post(url, body, token);

            game.endTurn();
          } else {
            game.endGame();

            updatedRoom.finished = true;
            const winnerId = game.results.winner.id;
            const winner = updatedRoom.players.find(
              (player) => player.id === winnerId
            );
            updatedRoom.winner.user = winner;

            const body = {
              finished: true,
              draw: false,
              winner: winnerId,
            };

            const url = `games/${dbGameId}`;
            await put(url, JSON.stringify(body), token);
          }
        } else {
          return;
        }

        const updatedGame = updatedRoom.game;

        updatedRoom.characters = updatedGame.characters;
        updatedRoom.game = updatedGame;
        updatedRoom.logs = updatedGame.logs;

        io.to(actualRoom.id).emit("harryPotterRoom", updatedRoom);
      }
    );

    // Set ready
    socket.on("setReadyHarryPotter", (roomId, userId) => {
      const room = rooms.find((room) => room.id === roomId);
      const player = room.players.find((player) => player.id === userId);

      player.ready = !player.ready;

      io.to(room.id).emit("harryPotterRoom", room);
    });

    // Send message
    socket.on("sendMessage", (actualRoom, message) => {
      const newMessage = { ...message, createdAt: new Date() };

      const updatedRoom =
        rooms.find((room) => room.id === actualRoom.id) || actualRoom;

      updatedRoom.messages.push(newMessage);

      rooms.map((room) => {
        if (room.id === actualRoom.id) {
          room.messages = updatedRoom.messages;
        }
      });

      io.to(actualRoom.id).emit("messageSent", updatedRoom.messages);
    });

    // Leave room
    socket.on("leaveHarryPotterGame", (roomId, userId) => {
      const room = rooms.find((room) => room.id === roomId);

      if (!room) return;

      room.players = room.players.filter((player) => player.id !== userId);
      room.characters = room.characters.filter(
        (character) => character.id !== userId
      );
      socket.leave(room.id);

      if (room.players.length === 0) {
        // If no players left, delete the room
        rooms = rooms.filter((r) => r.id !== roomId);
      } else {
        // Otherwise, notify the remaining players
        io.to(room.id).emit("harryPotterRoom", room);
        io.emit("harryPotterRooms", rooms);
      }

      console.log(`User ${userId} left room: ${roomId}`);
    });

    socket.on("resetHarryPotterGame", (gameId) => {
      const room = rooms.find((room) => room.id === gameId);

      room.started = false;
      room.finished = false;
      const characters = [];

      room.players.map((character) => {
        const newCharacter = createCharacter(character);
        characters.push(newCharacter);
      });

      room.characters = characters;
      room.game = new Game(characters, room.id);
      room.logs = [];
      room.winner = {
        user: null,
      };
      room.draw = false;
      room.players.map((player) => (player.ready = false));

      io.to(room.id).emit("harryPotterRoom", room);
    });

    // Disconnect
    socket.on("disconnect", () => {
      socket.disconnect();
    });
  });
};
