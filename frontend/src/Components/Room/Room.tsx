import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";
import { TicTacToeBoard } from "../../Games/TicTacToe/Components/TicTacToeBoard";
import { useAppDispatch } from "../../hooks/hooks";
import {
  ConnectFourRoom,
  HarryPotterRoom,
  Room,
  RpsRoom,
  TttRoom,
} from "../../Interfaces/Rooms";
import { User } from "../../Interfaces/User";
import { removeTttRoom, updateTttRoom } from "../../Redux/rooms/tttRoomSlice";
import { RootState } from "../../Redux/store";
import { socket } from "../../socket";
import { checkIfUserHasBadge, addBadge } from "../../utils/badge";
import { GameStartingButton } from "./GameStartingButton";
import { RoomInformations } from "./RoomInformations";
import { toast } from "react-toastify";
import { RPS } from "../../Games/RPS/RPS";
import { updateRpsRoom } from "../../Redux/rooms/rpsRoomSlice";
import { HowToPlay } from "./HowToPlay";
import { ConnectFourBoard } from "../../Games/ConnectFour/Components/ConnectFourBoard";
import {
  removeConnectFourRoom,
  updateConnectFourRoom,
} from "../../Redux/rooms/connectFourSlice";
import {
  removeHarryPotterRoom,
  setHarryPotterRoom,
} from "../../Redux/rooms/harryPotterRoomSlice";
import { HarryPotter } from "../../Games/HarryPotter/pages/Game/HarryPotter";

export const GameRoom: React.FC = () => {
  const token = useSelector((state: RootState) => state.token);
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { gameTag, id } = useParams();

  const selectRoomState = (state: RootState): Room => {
    switch (gameTag) {
      case "tic-tac-toe":
        return state.tttRoom;

      case "rock-paper-scissors":
        return state.rpsRoom;

      case "connect-four":
        return state.connectFourRoom;

      case "harry-potter":
        return state.harryPotterRoom;

      default:
        return state.tttRoom;
    }
  };

  const room = useSelector((state: RootState) => selectRoomState(state));

  const roomRef = useRef(room);
  const userRef = useRef(user);

  const [canStart, setCanStart] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOwner, setGameOwner] = useState(false);
  const [gameId, setGameId] = useState<number>();
  const [alreadySetBadge, setAlreadySetBadge] = useState(false);

  const resetGame = () => {
    switch (gameTag) {
      case "tic-tac-toe":
        socket.emit("resetTicTacToeGame", room.id);
        break;

      case "rock-paper-scissors":
        socket.emit("resetRpsGame", room.id);
        break;

      case "connect-four":
        socket.emit("resetConnectFourGame", room.id);
        break;

      case "harry-potter":
        socket.emit("resetHarryPotterGame", room.id);
        break;

      default:
        break;
    }
  };

  const getActualRoom = () => {
    switch (gameTag) {
      case "tic-tac-toe":
        socket.emit("getTicTacToeGame", id);

        socket.on("ticTacToeRoom", (r: TttRoom) => {
          if (!r) {
            navigate("/rooms/tic-tac-toe");

            socket.off("ticTacToeRoom");
          }
        });

        break;

      case "rock-paper-scissors":
        socket.emit("getRpsGame", id);

        socket.on("rpsRoom", (r: RpsRoom) => {
          if (!r) {
            navigate("/rooms/rock-paper-scissors");

            socket.off("rpsRoom");
          }
        });

        break;

      case "connect-four":
        socket.emit("getConnectFourGame", id);

        socket.on("connectFourRoom", (r: ConnectFourRoom) => {
          if (!r) {
            navigate("/rooms/connect-four");

            socket.off("connectFourRoom");
          }
        });

        break;

      case "harry-potter":
        socket.emit("getHarryPotterGame", id);

        socket.on("harryPotterRoom", (r: Room) => {
          if (!r) {
            navigate("/rooms/harry-potter");

            socket.off("harryPotterRoom");
          }
        });
        break;
      default:
        break;
    }
  };

  const setReady = () => {
    switch (gameTag) {
      case "tic-tac-toe":
        socket.emit("setReadyTicTacToe", room.id, user.id);

        break;

      case "rock-paper-scissors":
        socket.emit("setReadyRps", room.id, user.id);

        break;

      case "connect-four":
        socket.emit("setReadyConnectFour", room.id, user.id);

        break;

      case "harry-potter":
        socket.emit("setReadyHarryPotter", room.id, user.id);

        break;
      default:
        break;
    }
  };

  const startGame = () => {
    switch (gameTag) {
      case "tic-tac-toe":
        socket.emit("startTicTacToeGame", room.id, token);
        break;

      case "rock-paper-scissors":
        socket.emit("startRpsGame", room.id, token);
        break;

      case "connect-four":
        socket.emit("startConnectFourGame", room.id, token);
        break;

      case "harry-potter":
        socket.emit("startHarryPotterGame", room.id, token);
        break;

      default:
        break;
    }
  };

  const getReadyPlayers = () => {
    return room.players.filter((player: User) => player.ready).length;
  };

  const checkOwner = () => {
    room.players.forEach((player: User) => {
      if (player.id === user.id && player.owner) {
        setGameOwner(true);
      }
    });
  };

  const returnGame = () => {
    switch (gameTag) {
      case "tic-tac-toe":
        return <TicTacToeBoard gameId={gameId} room={room as TttRoom} />;

      case "rock-paper-scissors":
        return <RPS gameId={gameId} room={room as RpsRoom} />;

      case "connect-four":
        return (
          <ConnectFourBoard gameId={gameId} room={room as ConnectFourRoom} />
        );

      case "harry-potter":
        return <HarryPotter gameId={gameId} room={room as HarryPotterRoom} />;

      default:
        return <div></div>;
    }
  };

  useEffect(() => {
    if (!room) {
      return;
    }
    checkOwner();

    if (room && room.players.length === room.maxPlayers) {
      if (getReadyPlayers() === room.maxPlayers) {
        setCanStart(true);
      } else {
        setCanStart(false);
      }
    } else {
      setCanStart(false);
    }

    room.started ? setGameStarted(true) : setGameStarted(false);

    if (room.finished) {
      if (room.winner && room.winner.user?.id === user.id) {
        toast.success("Vous avez gagné !");

        if (
          user.winnedGames?.length === 0 &&
          !checkIfUserHasBadge(user, "first_win") &&
          !alreadySetBadge
        ) {
          addBadge("first_win", user.id, token);
        }

        if (
          user.winnedGames?.length === 4 &&
          !checkIfUserHasBadge(user, "5_wins") &&
          !alreadySetBadge
        ) {
          addBadge("5_wins", user.id, token);
        }
      } else if (room.draw) {
        toast.info("Egalité !");
      } else {
        if (
          user.winnedGames?.length === user.games?.length &&
          !checkIfUserHasBadge(user, "first_loss") &&
          !alreadySetBadge
        ) {
          addBadge("first_loss", user.id, token);
        }

        if (
          user.games &&
          user.winnedGames &&
          user.games?.length - user.winnedGames?.length === 4 &&
          !checkIfUserHasBadge(user, "5_losses") &&
          !alreadySetBadge
        ) {
          addBadge("5_losses", user.id, token);
        }

        toast.error("Vous avez perdu !");
      }

      if (
        user.games?.length === 0 &&
        !checkIfUserHasBadge(user, "first_game") &&
        !alreadySetBadge
      ) {
        addBadge("first_game", user.id, token);
      }

      if (
        user.games?.length === 4 &&
        !checkIfUserHasBadge(user, "5_games") &&
        !alreadySetBadge
      ) {
        addBadge("5_games", user.id, token);
      }

      setAlreadySetBadge(true);
    }
  }, [room]);

  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    getActualRoom();

    switch (gameTag) {
      case "tic-tac-toe":
        socket.on("ticTacToeRoom", (r: TttRoom, id: number) => {
          dispatch(updateTttRoom(r));

          if (id) {
            setGameId(id);
          }
        });

        return () => {
          socket.emit(
            "leaveTicTacToeGame",
            roomRef.current.id,
            userRef.current.id,
            token
          );
          dispatch(removeTttRoom());
        };

      case "rock-paper-scissors":
        socket.on("rpsRoom", (r: RpsRoom, id: number) => {
          dispatch(updateRpsRoom(r));

          if (id) {
            setGameId(id);
          }
        });

        return () => {
          socket.emit(
            "leaveRpsGame",
            roomRef.current.id,
            userRef.current.id,
            token
          );
          dispatch(removeConnectFourRoom());
        };

      case "connect-four":
        socket.on("connectFourRoom", (r: ConnectFourRoom, id: number) => {
          dispatch(updateConnectFourRoom(r));

          if (id) {
            setGameId(id);
          }
        });

        return () => {
          socket.emit(
            "leaveConnectFourGame",
            roomRef.current.id,
            userRef.current.id,
            token
          );
          dispatch(removeConnectFourRoom());
        };

      case "harry-potter":
        socket.on("harryPotterRoom", (r: HarryPotterRoom, id: number) => {
          dispatch(setHarryPotterRoom(r));

          if (id) {
            setGameId(id);
          }
        });

        return () => {
          socket.emit(
            "leaveHarryPotterGame",
            roomRef.current.id,
            userRef.current.id,
            token
          );
          dispatch(removeHarryPotterRoom());
        };

      default:
        break;
    }
  }, []);

  return (
    <>
      {room && gameTag && id && (
        <div className="flex bg-darkBlue-dark text-white w-full justify-between">
          <div className="text-center p-5 w-4/5">
            <HowToPlay gameTag={gameTag} />

            {returnGame()}

            <GameStartingButton
              user={user}
              room={room}
              canStart={canStart}
              gameStarted={gameStarted}
              setReady={setReady}
              startGame={startGame}
              resetGame={resetGame}
              gameOwner={gameOwner}
            />
          </div>

          <RoomInformations room={room} readyPlayers={getReadyPlayers() ?? 0} />
        </div>
      )}
    </>
  );
};
