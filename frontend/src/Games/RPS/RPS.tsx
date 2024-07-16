import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { RpsRoom } from "../../Interfaces/Rooms";
import { socket } from "../../socket";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { User } from "../../Interfaces/User";
import { RpsRoundCircles } from "./Components/RpsRoundCircles";

interface RPSProps {
  gameId: number | undefined;
  room: RpsRoom;
}

export const RPS = (props: RPSProps) => {
  const { gameId, room } = props;

  const user = useSelector((state: RootState) => state.user);
  const token = useSelector((state: RootState) => state.token);

  const [hasAlreadyPlayed, setHasAlreadyPlayed] = useState(false);
  const [gameWinner, setGameWinner] = useState<any>();

  const sendMove = (move: string) => {
    if (!room.started) {
      return;
    }

    if (hasAlreadyPlayed) {
      return;
    }
    socket.emit("makeRpsMove", room.id, user.id, token, gameId, move);
  };

  const checkIfUserHasPlayed = () => {
    if (!room.moves[room.turn]) {
      return;
    }

    if (room.moves[room.turn].length === 0) {
      setHasAlreadyPlayed(false);
      return;
    }

    const userPlayed = room.moves[room.turn].find(
      (move: any) => move.user.id === user.id
    );

    if (userPlayed) {
      setHasAlreadyPlayed(true);
    }
  };

  useEffect(() => {
    checkIfUserHasPlayed();
  }, [room]);

  return (
    <div className="flex flex-col mb-8 w-1/2 mx-auto">
      <div className="flex justify-between w-full">
        <img
          className={
            (hasAlreadyPlayed
              ? ""
              : "cursor-pointer hover:transform hover:scale-110 transition duration-200") +
            " w-52 h-52 bg-white rounded-full p-5"
          }
          src={`${process.env.REACT_APP_PUBLIC_URL}/rock.png`}
          alt=""
          onClick={() => sendMove("rock")}
        />
        <img
          className={
            (hasAlreadyPlayed
              ? ""
              : "cursor-pointer hover:transform hover:scale-110 transition duration-200") +
            " w-52 h-52 bg-white rounded-full p-5"
          }
          src={`${process.env.REACT_APP_PUBLIC_URL}/paper.png`}
          alt=""
          onClick={() => sendMove("paper")}
        />
        <img
          className={
            (hasAlreadyPlayed
              ? ""
              : "cursor-pointer hover:transform hover:scale-110 transition duration-200") +
            " w-52 h-52 bg-white rounded-full p-5"
          }
          src={`${process.env.REACT_APP_PUBLIC_URL}/scissors.png`}
          alt=""
          onClick={() => sendMove("scissors")}
        />
      </div>

      <RpsRoundCircles room={room} />

      {room.started &&
        (hasAlreadyPlayed ? (
          <p className="text-center text-xl mt-8">Vous avez déjà joué</p>
        ) : (
          <p className="text-center text-xl mt-8">Vous pouvez jouer</p>
        ))}
    </div>
  );
};
