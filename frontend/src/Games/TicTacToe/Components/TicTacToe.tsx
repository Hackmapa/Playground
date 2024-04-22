import React, { useEffect, useState } from "react";

import CircleIcon from "../Assets/circle.png";
import CrossIcon from "../Assets/cross.png";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../../socket";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { TttRoom } from "../../../Interfaces/Rooms";
import { User } from "../../../Interfaces/User";
import { useAppDispatch } from "../../../hooks/hooks";
import { updateTttRoom } from "../../../Redux/rooms/tttRoomSlice";

type CellValue = "" | "X" | "O";

const initialBoardState: CellValue[] = Array(9).fill("");

export const TicTacToe: React.FC = () => {
  const room = useSelector((state: RootState) => state.tttRoom);
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const [board, setBoard] = useState<CellValue[]>(initialBoardState);
  const [currentPlayer, setCurrentPlayer] = useState<CellValue>("X");
  const [isGameLocked, setGameLocked] = useState(false);
  const [title, setTitle] = useState("");

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
        <Cell
          key={startIndex + index}
          value={cell}
          onClick={() => handleClick(startIndex + index)}
        />
      ))}
    </div>
  );

  const getActualRoom = () => {
    socket.emit("getTicTacToeGame", id);

    socket.on("ticTacToeRoom", (r: TttRoom) => {
      if (!r) {
        navigate("/tic-tac-toe");

        socket.off("ticTacToeRoom");
      }
    });
  };

  useEffect(() => {
    room && setTitle(`Room ${room.id}: ${room.name}`);
  }, [room]);

  useEffect(() => {
    getActualRoom();

    socket.on("ticTacToeRoom", (r: TttRoom) => {
      dispatch(updateTttRoom(r));
    });

    return () => {
      socket.emit("leaveTicTacToeGame", room.id, user.id);
    };
  }, []);

  return (
    <div className="flex bg-[#0F1B21] text-white w-full justify-between">
      <div className="text-center p-5 h-screen w-[80%]">
        <h1 className="text-white text-2xl flex justify-center items-center gap-3">
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

      <div className="w-[20%] border-l-2">
        <div>
          {room &&
            room.players.map((player: User) => (
              <p key={player.id}>{player.username}</p>
            ))}
        </div>
      </div>
    </div>
  );
};

interface CellProps {
  value: CellValue;
  onClick: () => void;
}

const Cell = (props: CellProps) => {
  const { value, onClick } = props;

  return (
    <div
      className="w-32 h-32 bg-[#1F3540] border-4 border-[#0F1B21] rounded-lg cursor-pointer flex justify-center items-center"
      onClick={onClick}
    >
      {value && (
        <img
          src={value === "X" ? CrossIcon : CircleIcon}
          className="w-24 h-24"
          alt={`${value} icon`}
        />
      )}
    </div>
  );
};
