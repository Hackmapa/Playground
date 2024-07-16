import { useState } from "react";
import { ConnectFourRoom, Room } from "../../../Interfaces/Rooms";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { socket } from "../../../socket";

const ROWS = 6;
const COLUMNS = 7;

interface ConnectFourBoardProps {
  gameId: number | string | undefined;
  room: ConnectFourRoom;
}

export const ConnectFourBoard = (props: ConnectFourBoardProps) => {
  const { gameId, room } = props;

  const user = useSelector((state: RootState) => state.user);
  const token = useSelector((state: RootState) => state.token);

  const [hoverColumn, setHoverColumn] = useState<number | null>(null);

  const handleClick = (column: any) => {
    room.currentPlayer.user?.id === user.id &&
      socket.emit(
        "makeConnectFourMove",
        room.id,
        room.currentPlayer.user?.id,
        column,
        token,
        gameId
      );
  };

  const canClick = () => {
    return room.currentPlayer.user?.id === user.id;
  };

  return (
    <div className="flex flex-col items-center mt-10">
      {room &&
        room.currentBoard.map((row, rowIndex) => (
          <div key={rowIndex} className="flex border border-gray-600">
            {row.map((cell: any, columnIndex: number) => (
              <div
                className={
                  (canClick() ? "cursor-pointer" : "cursor-not-allowed") +
                  ` border-x border-x-gray-600`
                }
              >
                <div
                  key={columnIndex}
                  className={`w-20 h-20 border-2 border-gray-700 flex items-center justify-center rounded-full ${
                    hoverColumn === columnIndex && canClick()
                      ? "bg-gray-500 cursor-pointer"
                      : "bg-darkBlue-dark cursor-not-allowed"
                  }`}
                  onClick={() => handleClick(columnIndex)}
                  onMouseEnter={() => setHoverColumn(columnIndex)}
                  onMouseLeave={() => setHoverColumn(null)}
                  style={{ backgroundColor: cell ?? "" }}
                />
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};
