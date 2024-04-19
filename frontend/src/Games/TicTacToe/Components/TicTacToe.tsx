import React, { useState } from "react";

import CircleIcon from "../Assets/circle.png";
import CrossIcon from "../Assets/cross.png";

// Define a type for the game cell value
type CellValue = "" | "X" | "O";

// Initialize the game board with empty strings
const initialBoardState: CellValue[] = Array(9).fill("");

export const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<CellValue[]>(initialBoardState);
  const [currentPlayer, setCurrentPlayer] = useState<CellValue>("X");
  const [isGameLocked, setGameLocked] = useState(false);
  const [title, setTitle] = useState("Tic Tac Toe Game in React");

  const checkWin = (updatedBoard: CellValue[]): boolean => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let condition of winConditions) {
      const [a, b, c] = condition;
      if (
        updatedBoard[a] &&
        updatedBoard[a] === updatedBoard[b] &&
        updatedBoard[a] === updatedBoard[c]
      ) {
        return true;
      }
    }
    return false;
  };

  const handleClick = (index: number) => {
    if (isGameLocked || board[index]) return;

    const updatedBoard = [...board];
    updatedBoard[index] = currentPlayer;

    setBoard(updatedBoard);

    if (checkWin(updatedBoard)) {
      setGameLocked(true);
      setTitle(`Congratulations: Player ${currentPlayer} is the winner!`);
      return;
    }

    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const resetGame = () => {
    setBoard(initialBoardState);
    setCurrentPlayer("X");
    setGameLocked(false);
    setTitle("Tic Tac Toe Game in React");
  };

  const renderRow = (startIndex: number) => (
    <div className="flex justify-between">
      {board.slice(startIndex, startIndex + 3).map((cell, index) => (
        <div
          key={startIndex + index}
          className="w-44 h-44 bg-[#1F3540] border-4 border-[#0F1B21] rounded-lg cursor-pointer flex justify-center items-center"
          onClick={() => handleClick(startIndex + index)}
        >
          {cell && (
            <img
              src={cell === "X" ? CrossIcon : CircleIcon}
              className="w-24 h-24"
              alt={`${cell}}} icon`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-[#0F1B21] text-white text-center p-5">
      <h1 className="text-white text-6xl flex justify-center items-center gap-3">
        {title}
      </h1>

      <div className="flex flex-col justify-center items-center m-auto py-10">
        {renderRow(0)}
        {renderRow(3)}
        {renderRow(6)}
      </div>

      <button
        className="w-64 h-24 bg-[#1F3540] text-[#26FFCB] text-2xl rounded-full mt-2 mb-12 cursor-pointer"
        onClick={resetGame}
      >
        Reset
      </button>
    </div>
  );
};
