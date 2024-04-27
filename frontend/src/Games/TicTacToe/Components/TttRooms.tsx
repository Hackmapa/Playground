import { useEffect, useState } from "react";
import { socket } from "../../../socket";
import { TttRoom } from "../../../Interfaces/Rooms";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../Components/Button/Button";
import { useAppDispatch } from "../../../hooks/hooks";
import { addTttRoom } from "../../../Redux/rooms/tttRoomSlice";

export const TttRooms: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const [rooms, setRooms] = useState<TttRoom[]>([]);
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const createRoom = () => {
    socket.emit("createTicTacToeGame", roomName, user);

    socket.on("ticTacToeRoom", (room: TttRoom) => {
      dispatch(addTttRoom(room));

      navigate(`/tic-tac-toe/${room.id}`);
    });
  };

  useEffect(() => {
    document.title = "Hackmapa - Tic Tac Toe Rooms";

    socket.emit("getTicTacToeGames");

    socket.on("ticTacToeRooms", (rooms: TttRoom[]) => {
      setRooms(rooms);
    });

    return () => {
      socket.off("ticTacToeRooms");
      socket.off("ticTacToeRoom");
    };
  }, []);

  return (
    <div>
      <h1>Rooms</h1>

      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="text-black bg-white border-2 border-black rounded-md"
      />

      <button onClick={createRoom}>Create Room</button>

      <div className="flex justify-between mx-auto px-5">
        {rooms.map((room) => (
          <TttRoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

const TttRoomCard: React.FC<{ room: TttRoom }> = ({ room }) => {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [show, setShow] = useState(true);

  useEffect(() => {
    if (room.players.length > 1) {
      setShow(false);
    }
  }, [room]);

  const joinRoom = () => {
    socket.emit("joinTicTacToeGame", room.id, user);

    socket.on("ticTacToeRoom", (room: TttRoom) => {
      navigate(`/tic-tac-toe/${room.id}`);
    });
  };

  return (
    <>
      {show && (
        <div className="flex bg-white px-5 py-2 text-black flex-col w-auto rounded">
          <h2>{room.name}</h2>
          {room.players.length > 0 && <p>{room.players.length}/2 players</p>}
          <Button
            onClick={joinRoom}
            text="Join"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mt-4"
          />
        </div>
      )}
    </>
  );
};
