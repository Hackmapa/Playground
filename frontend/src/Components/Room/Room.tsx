import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";
import { TicTacToeBoard } from "../../Games/TicTacToe/Components/TicTacToeBoard";
import { useAppDispatch } from "../../hooks/hooks";
import { Room, RpsRoom, TttRoom } from "../../Interfaces/Rooms";
import { User } from "../../Interfaces/User";
import { updateTttRoom } from "../../Redux/rooms/tttRoomSlice";
import { RootState } from "../../Redux/store";
import { socket } from "../../socket";
import { checkIfUserHasBadge, addBadge } from "../../utils/badge";
import { GameStartingButton } from "./GameStartingButton";
import { RoomInformations } from "./RoomInformations";
import { toast } from "react-toastify";
import { RPS } from "../../Games/RPS/RPS";
import { updateRpsRoom } from "../../Redux/rooms/rpsRoomSlice";

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

      default:
        return state.tttRoom;
    }
  };

  const room = useSelector((state: RootState) => selectRoomState(state));

  const [canStart, setCanStart] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOwner, setGameOwner] = useState(false);
  const [gameId, setGameId] = useState<number>();

  const resetGame = () => {
    switch (gameTag) {
      case "tic-tac-toe":
        socket.emit("resetTicTacToeGame", room.id);

        break;

      case "rock-paper-scissors":
        socket.emit("resetRpsGame", room.id);

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
            navigate("/tic-tac-toe");

            socket.off("ticTacToeRoom");
          }
        });

        break;

      case "rock-paper-scissors":
        socket.emit("getRpsGame", id);

        socket.on("rpsRoom", (r: RpsRoom) => {
          if (!r) {
            navigate("/rock-paper-scissors");

            socket.off("rpsRoom");
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
        return <RPS />;
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
    }

    room.started ? setGameStarted(true) : setGameStarted(false);

    if (room.finished) {
      if (room.winner && room.winner.user?.id === user.id) {
        toast.success("You won!");

        if (
          user.winnedGames?.length === 0 &&
          !checkIfUserHasBadge(user, "first_win")
        ) {
          addBadge("first_win", user.id, token);
        }

        if (
          user.winnedGames?.length === 4 &&
          !checkIfUserHasBadge(user, "5_wins")
        ) {
          addBadge("5_wins", user.id, token);
        }
      } else if (room.draw) {
        toast.info("It's a draw!");
      } else {
        if (
          user.winnedGames?.length === user.games?.length &&
          !checkIfUserHasBadge(user, "first_loss")
        ) {
          addBadge("first_loss", user.id, token);
        }

        if (
          user.games &&
          user.winnedGames &&
          user.games?.length - user.winnedGames?.length === 4 &&
          !checkIfUserHasBadge(user, "5_losses")
        ) {
          addBadge("5_losses", user.id, token);
        }

        toast.error("You lost!");
      }

      if (
        user.games?.length === 0 &&
        !checkIfUserHasBadge(user, "first_game")
      ) {
        addBadge("first_game", user.id, token);
      }

      if (user.games?.length === 4 && !checkIfUserHasBadge(user, "5_games")) {
        addBadge("5_games", user.id, token);
      }
    }
  }, [room]);

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
          socket.emit("leaveTicTacToeGame", room.id, user.id);
        };

      case "rock-paper-scissors":
        socket.on("rpsRoom", (r: TttRoom, id: number) => {
          dispatch(updateRpsRoom(r));

          if (id) {
            setGameId(id);
          }
        });

        return () => {
          socket.emit("leaveRpsGame", room.id, user.id);
        };

      default:
        break;
    }
  }, []);

  return (
    <>
      {room && (
        <div className="flex bg-darkBlue-dark text-white w-full justify-between">
          <div className="text-center p-5 w-4/5">
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

          <RoomInformations
            user={user}
            room={room}
            readyPlayers={getReadyPlayers() ?? 0}
          />
        </div>
      )}
    </>
  );
};
