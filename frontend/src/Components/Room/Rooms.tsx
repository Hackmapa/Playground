import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/hooks";
import { TttRoom } from "../../Interfaces/Rooms";
import { addTttRoom } from "../../Redux/rooms/tttRoomSlice";
import { RootState } from "../../Redux/store";
import { socket } from "../../socket";
import gamesObj from "../../Games/games.json";
import { difficulty } from "../../utils/difficulty";
import { RoomCard } from "./RoomCard";
import { ModalBox } from "../ModalBox/ModalBox";
import { Input } from "../Input/Input";

export const Rooms: React.FC = () => {
  const { name } = useParams();

  const games = gamesObj.games;

  const user = useSelector((state: RootState) => state.user);
  const [rooms, setRooms] = useState<TttRoom[]>([]);
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [privateRoom, setPrivateRoom] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const createRoom = () => {
    switch (name) {
      case "tic-tac-toe":
        socket.emit(
          "createTicTacToeGame",
          roomName,
          user,
          privateRoom,
          password
        );

        socket.on("ticTacToeRoom", (room: TttRoom) => {
          dispatch(addTttRoom(room));

          navigate(`/tic-tac-toe/${room.id}`);
        });
        break;
      default:
        break;
    }
  };

  const findGame = games.find((game) => name === `${game.tag}`);

  useEffect(() => {
    document.title = "Hackmapa - Tic Tac Toe Rooms";

    switch (name) {
      case "tic-tac-toe":
        socket.emit("getTicTacToeGames");
        socket.on("ticTacToeRooms", (rooms: TttRoom[]) => {
          setRooms(rooms);
        });

        return () => {
          socket.off("ticTacToeRooms");
          socket.off("ticTacToeRoom");
        };
    }
  }, [name]);

  return (
    <div className="w-1/2 mx-auto pt-6 text-white">
      {findGame && (
        <div className="flex gap-8">
          <img src={findGame.image} alt="" className="w-52 h-52 rounded-sm" />
          <div className="flex flex-col justify-between text-left">
            <div>
              <h2 className="text-4xl font-bold">{findGame?.name}</h2>
              <p className="mt-4">{findGame.description}</p>
            </div>
            <div>
              <p>Difficulté: {difficulty(findGame.difficulty)}</p>
              <p>Joueurs: {findGame?.players}</p>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between mt-20">
        <h3 className="text-left font-bold text-3xl">
          Parties disponibles ({rooms.length})
        </h3>
        <button
          onClick={() => setOpen(true)}
          className="bg-darkBlue text-white py-2 px-4 flex rounded-3xl items-center gap-2 hover:bg-white hover:text-darkBlue-dark transition duration-200"
        >
          Créer une partie
        </button>
      </div>
      <div>
        {name && rooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-5 mt-10">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} name={name} />
            ))}
          </div>
        ) : (
          <div className="h-96 flex justify-center items-center">
            <p className="text-3xl">Pas de parties disponibles</p>
          </div>
        )}
      </div>

      <ModalBox open={open} setOpen={setOpen} className="bg-darkBlue-dark">
        <div>
          <h2 className="font-bold text-3xl">Créez votre partie</h2>

          <div>
            <Input
              type="text"
              placeholder="Nom de la partie"
              value={roomName}
              onChange={(e) => setRoomName(e)}
            />

            <div className="w-full mt-5 flex justify-start gap-2">
              <input
                type="checkbox"
                id="private"
                onChange={() => setPrivateRoom(!privateRoom)}
              />
              <label htmlFor="private">Privée</label>
            </div>
            {privateRoom && (
              <div className="pt-4">
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e)}
                />
              </div>
            )}
          </div>
          <button
            className={
              (roomName.length < 3 && roomName.length > 16
                ? "cursor-not-allowed text-gray-500"
                : "cursor-pointer hover:bg-darkBlue hover:text-white transition duration-200 text-white") +
              " bg-darkBlue-gray  py-2 px-4 rounded-3xl mt-8"
            }
            disabled={roomName.length < 3 && roomName.length > 16}
            onClick={createRoom}
          >
            Créer la partie
          </button>
        </div>
      </ModalBox>
    </div>
  );
};
