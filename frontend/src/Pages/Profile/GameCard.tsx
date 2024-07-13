import { MdOutlineReplay } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/hooks";
import { Game } from "../../Interfaces/Game";
import g from "../../Games/games.json";

interface GameCardProps {
  game: Game;
}

export const GameCard = (props: GameCardProps) => {
  const user = useAppSelector((state) => state.user);
  const { game } = props;

  const navigate = useNavigate();

  const getGameName = (gameId: number) => {
    let name = "";

    g.games.forEach((g) => {
      if (g.id === gameId) {
        name = g.name;
      }
    });

    return name;
  };

  const checkIfUserIsWinner = (game: Game) => {
    let winner = false;

    if (game.winner?.id === user.id) {
      winner = true;
    }

    return winner;
  };

  return (
    <div className="bg-darkBlue py-2 px-4 mt-2 rounded-xl">
      <div className="text-white">
        <p className="text-center font-bold">{getGameName(game.game_id)}</p>

        {game.winner && checkIfUserIsWinner(game) && (
          <p className="text-xl text-green-800 text-center font-bold uppercase">
            Victoire
          </p>
        )}

        {game.winner && !checkIfUserIsWinner(game) && (
          <p className="text-xl text-red-800 text-center font-bold uppercase">
            Défaite
          </p>
        )}

        {game.draw && <p>Game is a draw</p>}

        {!game.winner && !game.draw && <p>Game not finished</p>}
        <div className="flex justify-between mt-5">
          <div className="flex justify-center flex-col items-center">
            <img
              src={game.players[0].profile_picture}
              alt="profile"
              className="w-16 h-16 rounded-full"
            />
            <p className="text-center mt-2 font-bold">
              {game.players[0].username}
            </p>
          </div>
          <div className="flex items-center flex-col justify-between">
            <p className="font-bold text-3xl">VS</p>
            <MdOutlineReplay
              color="white"
              className="h-6 w-6 cursor-pointer self-end hover:scale-125 transform transition duration-200"
              onClick={() => navigate(`/tic-tac-toe/replay/${game.id}`)}
            />
          </div>

          <div className="flex justify-center flex-col items-center">
            <img
              src={game.players[1].profile_picture}
              alt="profile"
              className="w-16 h-16 rounded-full"
            />
            <p className="text-center mt-2 font-bold">
              {game.players[1].username}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
