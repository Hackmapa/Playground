import { MdOutlineReplay } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/hooks";
import { Game } from "../../Interfaces/Game";
import { User } from "../../Interfaces/User";
import { getGameLink, getGameName } from "../../utils/gameInfos";

interface GameCardProps {
  user: User;
  game: Game;
}

export const GameCard = (props: GameCardProps) => {
  const { user, game } = props;

  const navigate = useNavigate();

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

        {game.draw && (
          <p className="text-xl text-blue-500 text-center font-bold uppercase">
            Match nul
          </p>
        )}

        {!game.winner && game.canceled && (
          <p className="text-xl text-yellow-500 text-center font-bold uppercase">
            Partie non terminée
          </p>
        )}
        <div className="flex justify-between mt-5">
          <UserGameCard user={game.players[0]} />

          <div className="flex items-center flex-col justify-between">
            <p className="font-bold text-3xl">VS</p>
            {(game.winner || game.draw) && (
              <MdOutlineReplay
                color="white"
                className="h-6 w-6 cursor-pointer self-end hover:scale-125 transform transition duration-200"
                onClick={() =>
                  navigate(`${getGameLink(game.game_id)}/replay/${game.id}`)
                }
              />
            )}
          </div>

          <UserGameCard user={game.players[1]} />
        </div>
      </div>
    </div>
  );
};

interface UserGameCardProps {
  user: User;
}

const UserGameCard = (props: UserGameCardProps) => {
  const { user } = props;

  const navigate = useNavigate();

  const actualUser = useAppSelector((state) => state.user);

  const isActualUser = () => {
    if (actualUser.id === user.id) {
      return true;
    }

    return false;
  };

  return (
    <div className="flex justify-center flex-col items-center hover:cursor-pointer">
      <img
        src={user.profile_picture}
        alt="profile"
        className="w-16 h-16 rounded-full"
        onClick={() => navigate(`/profile/${user.id}`)}
      />
      <p className="text-center mt-2 font-bold">
        {isActualUser() ? "Vous" : user.username}
      </p>
    </div>
  );
};
