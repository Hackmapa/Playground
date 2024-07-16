import Character from "./classes/character.js";
import Game from "./classes/game.js";
import spells from "./constants/spells.js";

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

const createLog = (room, message) => {
  const newLog = {
    id: room.logs.length + 1,
    message: message,
    createdAt: new Date(),
  };

  return newLog;
};

export default (io, rooms) => {
  // Socket connection
  io.on("connection", (socket) => {
    // Update rooms
    socket.on("getHarryPotterGames", () => {
      io.emit("harryPotterRooms", rooms);
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
        winner: null,
        draw: false,
        privateRoom: privateRoom,
        password: password,
        gameTag: "harry-potter",
      };

      user.ready = false;
      user.owner = true;

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
      socket.join(roomId);

      io.to(room.id).emit("harryPotterRoom", room);
      io.emit("harryPotterRooms", rooms);
    });

    // Start game
    socket.on("startHarryPotterGame", (characters, actualRoom) => {
      const newCharacters = characters.map((character) => {
        return createCharacter(character);
      });

      const game = new Game(newCharacters, actualRoom.id);

      game.startGame();
      actualRoom.game = game;

      const actualRoomIndex = rooms.findIndex(
        (room) => room.id === actualRoom.id
      );

      rooms[actualRoomIndex] = actualRoom;

      actualRoom.logs = game.logs;

      io.to(actualRoom.id).emit("gameStarted", game, actualRoom);
    });

    // Cast spell
    socket.on("castSpell", (actualRoom, character, target, castedSpell) => {
      const updatedRoom = rooms.find((room) => room.id === actualRoom.id);
      const thisSpell = spells.find((spell) => spell.id === castedSpell);
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
        if (!game.isGameOver()) game.endTurn();
      } else {
        return;
      }

      const updatedGame = updatedRoom.game;

      updatedRoom.characters = updatedGame.characters;
      updatedRoom.logs = updatedGame.logs;

      io.to(actualRoom.id).emit("harryPotterRoom", updatedGame, updatedRoom);
    });

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
    socket.on("leaveRoom", (actualRoom, actualUser) => {
      rooms.map((room) => {
        if (room.id === actualRoom.id) {
          room.players = room.players.filter(
            (user) => user.id !== actualUser.id
          );
          room.characters = room.characters.filter(
            (character) => character.id !== actualUser.id
          );

          return room;
        }
      });

      const updatedRoom = rooms.find((room) => room.id === actualRoom.id);

      socket.leave(actualRoom.id);
      io.to(actualRoom.id).emit("roomLeft", updatedRoom);
    });

    // End game
    socket.on("endGame", (actualRoom, results) => {
      const { winner, loser } = results;

      io.to(actualRoom.id).emit("gameEnded", results);
    });

    // Disconnect
    socket.on("disconnect", () => {
      socket.disconnect();
    });
  });
};
