import { useEffect, useState } from "react";
import "./game.css";

import { io } from "socket.io-client";
import { RoomList } from "./Rooms/RoomsList/RoomList";
import CharacterComponent from "../../Components/Character/Character";
import { isOdd } from "../../utils/numberOddEven";
import Button from "../../Components/Button/Button";
import { UserInterface } from "./UserInterface/UserInterface";
import { useSelector, useDispatch } from "react-redux";
import { Game } from "../../../../Interfaces/Game";
import { Character } from "../../../../Interfaces/HarryPotter/Character";
import { HarryPotterRoom, Room } from "../../../../Interfaces/Rooms";
import { User } from "../../../../Interfaces/User";
import { setHarryPotterRoom } from "../../../../Redux/rooms/harryPotterRoomSlice";
import { updateUser } from "../../../../Redux/user/userSlice";

const socket = io("http://localhost:3001", {
  transports: ["websocket", "polling", "flashsocket"],
});

interface Results {
  winner: Character | null;
  loser: Character | null;
}

export const GamePage = () => {
  const actualUser = useSelector((state: any) => state.user);
  const actualRoom = useSelector((state: any) => state.harryPotterRoom);

  const dispatch = useDispatch();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [hasChosenSpell, setHasChosenSpell] = useState<boolean>(false);
  const [results, setResults] = useState<Results>();
  const [game, setGame] = useState<HarryPotterRoom>();

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    handleSocket();
  }, [actualUser, game, rooms, actualRoom, characters]);

  const handleSocket = () => {
    socket.on("roomCreated", (rooms: Room[]) => {
      setRooms(rooms);
    });

    socket.on("roomJoined", (room: Room) => {
      const actualRoom = room;
      const actualRooms = rooms.map((r) =>
        r.id === actualRoom.id ? actualRoom : r
      );
      setRooms(actualRooms);
      dispatch(setHarryPotterRoom(actualRoom));
    });

    socket.on("roomsUpdated", (rooms: Room[]) => {
      setRooms(rooms);
    });

    socket.on("roomLeft", (room: Room) => {
      dispatch(setHarryPotterRoom(room));
      actualUser &&
        dispatch(updateUser({ ...actualUser, isReadyToPlay: false }));
    });

    socket.on("readySet", (room: Room, user: User) => {
      dispatch(setHarryPotterRoom(room));

      if (actualUser?.id === user.id) {
        dispatch(updateUser(user));
      }
    });

    socket.on("gameStarted", (game: HarryPotterRoom, actualRoom: Room) => {
      setGame(game);
      dispatch(setHarryPotterRoom(actualRoom));
    });

    socket.on("gameUpdated", (game: HarryPotterRoom, actualRoom: Room) => {
      setHasChosenSpell(false);
      setGame(game);
      dispatch(
        setHarryPotterRoom({ ...actualRoom, characters: game.characters })
      );
    });
  };

  const fetchRooms = () => {
    fetch("http://localhost:3001/rooms")
      .then((res) => res.json())
      .then((data) => {
        setRooms(data.rooms);
      });
  };

  const createRoom = (name: string) => {
    socket.emit("createRoom", name);
  };

  const joinRoom = (room: Room) => {
    socket.emit("joinRoom", room, actualUser);
    socket.emit("updateRooms");
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom", actualRoom, actualUser);
    socket.emit("updateRooms");
    dispatch(setHarryPotterRoom(undefined));
  };

  const setReady = () => {
    socket.emit("setReady", actualRoom, actualUser);
    socket.emit("updateRooms");
  };

  const startGame = () => {
    socket.emit("startGame", characters, actualRoom);
    socket.emit("updateRooms");
  };

  const organizeCharacters = (characters: Character[]) => {
    const updatedCharacters = characters.filter((c) => c.id !== actualUser?.id);
    updatedCharacters.unshift(characters.find((c) => c.id === actualUser?.id)!);

    return updatedCharacters;
  };

  useEffect(() => {
    if (actualRoom) {
      const updatedCharacters = organizeCharacters(actualRoom.characters);

      setCharacters(updatedCharacters);
    }
  }, [actualRoom]);

  useEffect(() => {
    if (game?.finished) {
      setResults(game.results);
    }
  }, [game]);

  return (
    <div className="game-container">
      {actualUser && !actualRoom ? (
        <RoomList
          rooms={rooms}
          handleCreateRoom={createRoom}
          onRoomClick={joinRoom}
        />
      ) : (
        <div>
          <Button
            className="cancel-button"
            label="Leave room"
            onClick={leaveRoom}
          />
        </div>
      )}

      {results?.winner && (
        <div className="results-modal">
          <div className="results-modal-content">
            <h1>Results: </h1>
            <p>
              Gagnant: <span>{results?.winner?.firstname}</span>
            </p>
            <p>
              Perdant: <span>{results?.loser?.firstname}</span>
            </p>
            <p>
              Nombre de tours: <span>{game?.currentTurn}</span>
            </p>
            <Button
              className="cancel-button"
              label="Close"
              onClick={() => {
                setResults(undefined);
                // handleLeaveRoom();
              }}
            />
          </div>
        </div>
      )}

      <div className="game-characters-container">
        {actualRoom &&
          characters.map((character: Character, index: number) => (
            <CharacterComponent
              key={character.id}
              character={character}
              flip={isOdd(index) ? true : false}
              actualUser={actualUser}
            />
          ))}
      </div>

      {actualRoom && (
        <UserInterface
          characters={characters}
          game={game}
          handleSetReady={setReady}
          handleStartGame={startGame}
          socket={socket}
          hasChosenSpell={hasChosenSpell}
          setHasChosenSpell={setHasChosenSpell}
        />
      )}
    </div>
  );
};
