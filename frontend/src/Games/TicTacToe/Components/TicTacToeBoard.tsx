import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { socket } from "../../../socket";
import CircleIcon from "../Assets/circle.png";
import CrossIcon from "../Assets/cross.png";
import { TttRoom } from "../../../Interfaces/Rooms";

interface TicTacToeBoardProps {
  gameId?: number | undefined;
  room: TttRoom;
}

type CellValue = "" | "X" | "O";

export const TicTacToeBoard = (props: TicTacToeBoardProps) => {
  const { gameId, room } = props;

  const user = useSelector((state: RootState) => state.user);
  const token = useSelector((state: RootState) => state.token);

  const handleClick = (index: number) => {
    room.currentPlayer.user?.id === user.id &&
      socket.emit(
        "makeMove",
        room.id,
        room.currentPlayer.user?.id,
        index,
        token,
        gameId
      );
  };

  const canClick = (index: number) => {
    return (
      room.currentPlayer.user?.id === user.id && room.currentBoard[index] === ""
    );
  };

  const renderRow = (startIndex: number) =>
    room && (
      <div className="flex justify-between">
        {room.currentBoard
          .slice(startIndex, startIndex + 3)
          .map((cell, index) => (
            <Cell
              key={startIndex + index}
              value={cell}
              canClick={canClick(startIndex + index)}
              onClick={() => handleClick(startIndex + index)}
            />
          ))}
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center py-10 m-auto">
      {renderRow(0)}
      {renderRow(3)}
      {renderRow(6)}
    </div>
  );
};

interface CellProps {
  value: CellValue;
  canClick: boolean;
  onClick: () => void;
}

const Cell = (props: CellProps) => {
  const { value, canClick, onClick } = props;

  return (
    <div
      className={
        (canClick ? "cursor-pointer " : "cursor-not-allowed") +
        " w-40 h-40 bg-[#1F3540] border-4 border-[#0F1B21] rounded-lg flex justify-center items-center"
      }
      onClick={canClick ? onClick : undefined}
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
