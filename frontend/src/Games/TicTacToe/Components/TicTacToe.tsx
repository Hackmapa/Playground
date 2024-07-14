import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../../socket";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { TttRoom } from "../../../Interfaces/Rooms";
import { User } from "../../../Interfaces/User";
import { useAppDispatch } from "../../../hooks/hooks";
import { updateTttRoom } from "../../../Redux/rooms/tttRoomSlice";
import { Button } from "../../../Components/Button/Button";
import { TicTacToeBoard } from "./TicTacToeBoard";
import { addBadge, checkIfUserHasBadge } from "../../../utils/badge";

export const TicTacToe: React.FC = () => {
  const token = useSelector((state: RootState) => state.token);
  const room = useSelector((state: RootState) => state.tttRoom);
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [canStart, setCanStart] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOwner, setGameOwner] = useState(false);
  const [gameId, setGameId] = useState<number>();

  const resetGame = () => {
    socket.emit("resetTicTacToeGame", room.id);
    room && setTitle(`Room ${room.id}: ${room.name}`);
  };

  const getActualRoom = () => {
    socket.emit("getTicTacToeGame", id);

    socket.on("ticTacToeRoom", (r: TttRoom) => {
      if (!r) {
        navigate("/tic-tac-toe");

        socket.off("ticTacToeRoom");
      }
    });
  };

  const setReady = () => {
    socket.emit("setReady", room.id, user.id);
  };

  const startGame = () => {
    socket.emit("startTicTacToeGame", room.id, token);
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

  useEffect(() => {
    if (!room) {
      return;
    }
    setTitle(`Room ${room.id}: ${room.name}`);
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
        setTitle("You won!");

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
        setTitle("It's a draw!");
      } else {
        if (
          user.winnedGames?.length !== user.games?.length &&
          !checkIfUserHasBadge(user, "first_loss")
        ) {
          addBadge("first_loss", user.id, token);
        }

        if (
          user.games?.length === 4 &&
          !checkIfUserHasBadge(user, "5_losses")
        ) {
          addBadge("5_losses", user.id, token);
        }

        setTitle("You lost!");
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

    socket.on("ticTacToeRoom", (r: TttRoom, id: number) => {
      dispatch(updateTttRoom(r));

      if (id) {
        setGameId(id);
      }
    });

    return () => {
      socket.emit("leaveTicTacToeGame", room.id, user.id);
    };
  }, []);

  return (
    <>
      {room && (
        <div className="flex bg-[#0F1B21] text-white w-full justify-between">
          <div className="text-center p-5 h-screen w-[80%]">
            <h1 className="flex items-center justify-center gap-3 text-2xl text-white">
              {title}
            </h1>

            <TicTacToeBoard gameId={gameId} room={room} />

            {room && !gameStarted ? (
              !canStart ? (
                <Button
                  className="w-64 h-24 bg-[#1F3540] text-white text-2xl rounded-full mt-2 mb-12"
                  disabled
                  text={`${getReadyPlayers()}/${room.maxPlayers} players ready`}
                />
              ) : gameOwner ? (
                <Button
                  className="w-64 h-24 bg-[#1F3540] text-white text-2xl rounded-full mt-2 mb-12 cursor-pointer"
                  onClick={startGame}
                  text="Start Game !"
                />
              ) : (
                <Button
                  className="w-64 h-24 bg-[#1F3540] text-white text-2xl rounded-full mt-2 mb-12"
                  disabled
                  text="Waiting for owner to start game ..."
                />
              )
            ) : (
              <div>
                {!room.finished ? (
                  <div>
                    <p className="text-2xl">
                      {room && room.currentPlayer.user?.id === user.id
                        ? "Your turn"
                        : "Opponent's turn"}
                    </p>
                  </div>
                ) : gameOwner ? (
                  <Button
                    className="w-64 h-24 bg-[#1F3540] text-[#26FFCB] text-2xl rounded-full mt-2 mb-12 cursor-pointer"
                    onClick={resetGame}
                    text="Reset Game"
                  />
                ) : (
                  <Button
                    className="w-64 h-24 bg-[#1F3540] text-[#26FFCB] text-2xl rounded-full mt-2 mb-12"
                    disabled
                    text="Game finished, waiting for owner to reset game ..."
                  />
                )}
              </div>
            )}
          </div>

          <div className="w-[20%] border-l-2">
            <div className="mt-5 text-xl text-center">
              <h1>
                Players ({room.players.length}/{room.maxPlayers})
              </h1>
            </div>
            <div>
              {room &&
                room.players.map((player: User) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between w-full mt-4"
                  >
                    <p className="mx-2 text-xl cursor-pointer" key={player.id}>
                      {player.username}
                    </p>
                    {player.id === user.id ? (
                      <div className="w-full mx-2 text-right">
                        <Button
                          text="Ready"
                          className={
                            (player.ready ? "bg-green-400" : "bg-red-400") +
                            " w-32"
                          }
                          onClick={setReady}
                        />
                      </div>
                    ) : (
                      <div className="w-32 mx-2 text-right">
                        <p className="text-center">
                          ({player.ready ? "Ready" : "Not Ready"})
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
