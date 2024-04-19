import { useEffect, useState } from "react";
import { socket } from "../../../socket";
import { TttRoom } from "../../../Interfaces/Rooms";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { useNavigate } from "react-router-dom";

export const TttRooms: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const [rooms, setRooms] = useState<TttRoom[]>([]);
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    socket.emit("createTicTacToeGame", roomName, user);

    socket.on("ticTacToeRoom", (room: TttRoom) => {
      navigate(`/tic-tac-toe/${room.id}`);
    });
  };

  useEffect(() => {
    socket.emit("getTicTacToeGames");

    socket.on("ticTacToeRooms", (rooms: TttRoom[]) => {
      setRooms(rooms);
    });
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

      {rooms.map((room) => (
        <TttRoomCard key={room.id} room={room} />
      ))}
    </div>
  );
};

const TttRoomCard: React.FC<{ room: TttRoom }> = ({ room }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (room.players.length > 1) {
      setShow(false);
    }
  }, [room]);

  return (
    <>
      {show && (
        <div className="flex">
          <h2>{room.name}</h2>
          {room.players.length > 0 && <p>{room.players.length}/2</p>}
        </div>
      )}
    </>
  );
};
