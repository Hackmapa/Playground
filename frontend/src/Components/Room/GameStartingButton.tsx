import { useEffect, useState } from "react";
import { TttRoom } from "../../Interfaces/Rooms";
import { User } from "../../Interfaces/User";

interface GameStartingButtonProps {
  user: User;
  room: TttRoom;
  canStart: boolean;
  gameStarted: boolean;
  setReady: () => void;
  startGame: () => void;
  resetGame: () => void;
  gameOwner: boolean;
}

export const GameStartingButton = (props: GameStartingButtonProps) => {
  const {
    user,
    room,
    canStart,
    gameStarted,
    startGame,
    setReady,
    resetGame,
    gameOwner,
  } = props;

  const [userRoom, setUserRoom] = useState<User>();

  useEffect(() => {
    if (room) {
      const userRoom = room.players.find((p) => p.id === user.id);
      setUserRoom(userRoom);
    }
  }, [room]);

  return (
    <div className="w-full flex justify-center">
      {room && !gameStarted ? (
        !canStart ? (
          <button
            className="bg-darkBlue text-white py-2 px-4 flex rounded-3xl items-center gap-2 hover:bg-white hover:text-darkBlue-dark transition duration-200"
            onClick={setReady}
          >
            {userRoom?.ready ? "Annuler" : "Prêt"}
          </button>
        ) : gameOwner ? (
          <button
            className="bg-darkBlue text-white py-2 px-4 flex rounded-3xl items-center gap-2 hover:bg-white hover:text-darkBlue-dark transition duration-200"
            onClick={startGame}
          >
            Commencer la partie
          </button>
        ) : (
          <button className="bg-darkBlue text-white py-2 px-4 flex rounded-3xl items-center gap-2 hover:bg-white hover:text-darkBlue-dark transition duration-200">
            En attente du propriétaire pour démarrer la partie ...
          </button>
        )
      ) : (
        <div>
          {!room.finished ? (
            <div>
              <p className="text-2xl">
                {room && room.currentPlayer.user?.id === user.id
                  ? "A vous de jouer !"
                  : "En attente de votre tour ..."}
              </p>
            </div>
          ) : gameOwner ? (
            <button
              className="bg-darkBlue text-white py-2 px-4 flex rounded-3xl items-center gap-2 hover:bg-white hover:text-darkBlue-dark transition duration-200"
              onClick={resetGame}
            >
              Reset la partie
            </button>
          ) : (
            <button className="bg-darkBlue text-white py-2 px-4 flex rounded-3xl items-center gap-2 hover:bg-white hover:text-darkBlue-dark transition duration-200">
              En attente du reset
            </button>
          )}
        </div>
      )}
    </div>
  );
};
