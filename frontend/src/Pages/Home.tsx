import { GameCard } from "../Components/Game/GameCard";
import g from "../Games/games.json";
import { Game } from "../Interfaces/Game";

export const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <div className="flex flex-wrap gap-2 px-10 justify-center">
        {g.games.map((game: Game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};
