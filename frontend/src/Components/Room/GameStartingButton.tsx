import { useEffect, useState } from "react";
import { Room, TttRoom } from "../../Interfaces/Rooms";
import { User } from "../../Interfaces/User";

interface GameStartingButtonProps {
  user: User;
  room: Room;
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

  const returnButton = () => {
    if (room) {
      if (!gameStarted) {
        if (!canStart) {
          return (
            <button
              className="bg-darkBlue text-white py-2 px-4 flex rounded-3xl items-center gap-2 hover:bg-white hover:text-darkBlue-dark transition duration-200"
              onClick={setReady}
            >
              {userRoom?.ready ? "Annuler" : "Prêt"}
            </button>
          );
        }

        if (canStart && gameOwner) {
          return (
            <button
              className="bg-darkBlue text-white py-2 px-4 flex rounded-3xl items-center gap-2 hover:bg-white hover:text-darkBlue-dark transition duration-200"
              onClick={startGame}
            >
              Lancer la partie
            </button>
          );
        }

        if (canStart && !gameOwner) {
          return (
            <button className="bg-darkBlue text-white py-2 px-4 flex rounded-3xl items-center gap-2">
              En attente du lancement ...
            </button>
          );
        }
      }

      if (
        gameStarted &&
        !room.finished &&
        (!room.currentPlayer || !room.currentPlayer.user)
      ) {
        return <></>;
      }

      if (gameStarted && !room.finished && room.currentPlayer.user) {
        return (
          <div>
            <p className="text-2xl">
              {room && room.currentPlayer.user?.id === user.id
                ? "A vous de jouer !"
                : "En attente de votre tour ..."}
            </p>
          </div>
        );
      }

      if (gameOwner && room.finished) {
        return (
          <button
            className="bg-darkBlue text-white py-2 px-4 flex rounded-3xl items-center gap-2 hover:bg-white hover:text-darkBlue-dark transition duration-200"
            onClick={resetGame}
          >
            Reset la partie
          </button>
        );
      }

      if (!gameOwner && room.finished) {
        return (
          <button className="bg-darkBlue text-white py-2 px-4 flex rounded-3xl items-center gap-2 hover:bg-white hover:text-darkBlue-dark transition duration-200">
            En attente du reset
          </button>
        );
      }

      return <div>a</div>;
    }
  };

  useEffect(() => {
    if (room) {
      const userRoom = room.players.find((p) => p.id === user.id);
      setUserRoom(userRoom);
    }
  }, [room]);

  return (
    <div className="w-full flex justify-center mt-6">{returnButton()}</div>
  );
};
