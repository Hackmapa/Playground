import { current } from "@reduxjs/toolkit";
import { Game } from "../../../Interfaces/Game";
import { TicTacToeBoard } from "./TicTacToeBoard";
import { useEffect, useState } from "react";
import { TttRoom } from "../../../Interfaces/Rooms";
import { get } from "../../../utils/requests/get";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { useParams } from "react-router-dom";

export const TicTacToeReplay = () => {
  const token = useSelector((state: RootState) => state.token);

  const { gameId } = useParams();

  const [currentTurn, setCurrentTurn] = useState(0);
  const [game, setGame] = useState<Game>();

  const fetchGame = async () => {
    const game = await get(`games/${gameId}`, token);
    setGame(game);
  };

  useEffect(() => {
    document.title = `Tic Tac Toe - Game ${gameId} Replay`;

    fetchGame();
  }, []);

  return (
    <div>
      {game ? (
        <div>
          <h1>Game {game.id}</h1>
          <TicTacToeBoard room={game.turns[currentTurn].state as TttRoom} />
          <div className="flex justify-center">
            <button
              onClick={() =>
                currentTurn > 0 && setCurrentTurn((prev) => prev - 1)
              }
            >
              {"<"}
            </button>
            <button
              onClick={() =>
                currentTurn < game.turns.length - 1 &&
                setCurrentTurn((prev) => prev + 1)
              }
            >
              {">"}
            </button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
