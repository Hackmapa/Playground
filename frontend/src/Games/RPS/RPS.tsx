import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { RpsRoom } from "../../Interfaces/Rooms";
import { socket } from "../../socket";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { User } from "../../Interfaces/User";

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
      console.log("You have already played");
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
              : "hover:transform hover:scale-110 transition duration-200") +
            " cursor-pointer w-52 h-52 bg-white rounded-full p-5"
          }
          src={`${process.env.REACT_APP_PUBLIC_URL}/images/rock.png`}
          alt=""
          onClick={() => sendMove("rock")}
        />
        <img
          className={
            (hasAlreadyPlayed
              ? ""
              : "hover:transform hover:scale-110 transition duration-200") +
            " cursor-pointer w-52 h-52 bg-white rounded-full p-5"
          }
          src={`${process.env.REACT_APP_PUBLIC_URL}/images/paper.png`}
          alt=""
          onClick={() => sendMove("paper")}
        />
        <img
          className={
            (hasAlreadyPlayed
              ? ""
              : "hover:transform hover:scale-110 transition duration-200") +
            " cursor-pointer w-52 h-52 bg-white rounded-full p-5"
          }
          src={`${process.env.REACT_APP_PUBLIC_URL}/images/scissors.png`}
          alt=""
          onClick={() => sendMove("scissors")}
        />
      </div>

      <div className="flex flex-col items-center mt-8">
        <p className="text-left text-xl font-bold">Manches : </p>
        <div className="flex w-1/2 justify-between mt-4">
          {room.roundWinners &&
            room.roundWinners.map((winner: any) => (
              <>
                {winner && winner.id && (
                  <div className="flex items-center gap-3 w-24 h-24 bg-darkBlue rounded-full">
                    <div className="flex justify-center items-center w-full">
                      <img
                        className="w-20 h-20 rounded-full"
                        src={winner.profile_picture}
                        alt=""
                      />
                    </div>
                  </div>
                )}

                {!winner && (
                  <div className="flex items-center gap-3 w-24 h-24 bg-darkBlue rounded-full"></div>
                )}

                {winner && winner === "draw" && (
                  <div className="flex items-center gap-3 w-24 h-24 bg-darkBlue rounded-full">
                    <div className="flex justify-center items-center w-full">
                      <p className="text-2xl">X</p>
                    </div>
                  </div>
                )}
              </>
            ))}
        </div>
      </div>

      {room.started &&
        (hasAlreadyPlayed ? (
          <p className="text-center text-xl mt-8">Vous avez déjà joué</p>
        ) : (
          <p className="text-center text-xl mt-8">Vous pouvez jouer</p>
        ))}
    </div>
  );
};
