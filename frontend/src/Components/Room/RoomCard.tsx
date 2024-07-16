import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Room, RpsRoom, TttRoom } from "../../Interfaces/Rooms";
import { RootState } from "../../Redux/store";
import { socket } from "../../socket";
import { Button } from "../Button/Button";
import { ModalBox } from "../ModalBox/ModalBox";
import { Input } from "../Input/Input";
import { toast } from "react-toastify";

interface RoomCardProps {
  room: Room;
  name: string;
}

export const RoomCard = (props: RoomCardProps) => {
  const { room, name } = props;

  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [show, setShow] = useState(true);
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (room.players.length > 1) {
      setShow(false);
    }
  }, [room]);

  const joinRoom = () => {
    switch (name) {
      case "tic-tac-toe":
        socket.emit("joinTicTacToeGame", room.id, user);

        socket.on("ticTacToeRoom", (room: TttRoom) => {
          toast.success(`Vous avez rejoint la partie ${room.name}`);
          navigate(`/tic-tac-toe/${room.id}`);
        });
        break;

      case "rock-paper-scissors":
        socket.emit("joinRpsGame", room.id, user);

        socket.on("rpsRoom", (room: RpsRoom) => {
          toast.success(`Vous avez rejoint la partie ${room.name}`);
          navigate(`/rock-paper-scissors/${room.id}`);
        });
        break;

      default:
        break;
    }
  };

  const handlePrivateRoom = () => {
    if (room.privateRoom) {
      setOpen(true);
    } else {
      joinRoom();
    }
  };

  const handleCheckPassword = () => {
    if (password === room.password) {
      setOpen(false);
      joinRoom();
    } else {
      toast.error("Mauvais mot de passe");
    }
  };

  return (
    <>
      {show && (
        <div className="flex bg-darkBlue-gray px-5 py-2 flex-col w-auto rounded text-white">
          <h2 className="font-bold text-2xl">{room.name}</h2>
          {room.players.length > 0 && (
            <p className="mt-3">
              {room.players.length}/{room.maxPlayers} joueurs
            </p>
          )}
          {room.privateRoom ? (
            <p className="mt-5">Partie privée</p>
          ) : (
            <p className="mt-5">Partie publique</p>
          )}
          <Button
            onClick={handlePrivateRoom}
            text="Join"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-full mt-4 text-sm border-none"
          />
        </div>
      )}
      <ModalBox open={open} setOpen={setOpen} className="bg-darkBlue-dark">
        <div>
          <h2 className="font-bold text-3xl">
            Rejoignez la partie {room.name}
          </h2>

          <div>
            <Input
              type="password"
              placeholder="Mot de passe de la partie"
              value={password}
              onChange={(e) => setPassword(e)}
            />
          </div>
          <button
            className="cursor-pointer bg-darkBlue-gray hover:bg-darkBlue hover:text-white transition duration-200 text-whitebg-darkBlue-gray py-2 px-4 rounded-3xl mt-8"
            onClick={handleCheckPassword}
          >
            Rejoindre la partie
          </button>
        </div>
      </ModalBox>
    </>
  );
};
