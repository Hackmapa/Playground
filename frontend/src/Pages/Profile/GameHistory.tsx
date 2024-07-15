import { GameCard } from "./GameCard";
import { Game } from "../../Interfaces/Game";
import { User } from "../../Interfaces/User";

interface GameHistoryProps {
  user: User;
  games: Game[];
}

export const GameHistory = (props: GameHistoryProps) => {
  const { user, games } = props;

  return (
    <div className="flex flex-col items-center w-full h-full mt-4">
      <div className="flex flex-col gap-2 px-10 w-full h-full overflow-auto max-h-80">
        {games.length === 0 ? (
          <div className="flex flex-col items-center text-center justify-center">
            Pas de parties enregistrées. Jouez pour enregistrer vos parties
          </div>
        ) : (
          games.map((game) => (
            <GameCard key={game.id} user={user} game={game} />
          ))
        )}
      </div>
    </div>
  );
};
