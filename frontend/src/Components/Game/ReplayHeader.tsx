import { Game } from "../../Interfaces/Game";
import { getGameName } from "../../utils/gameInfos";

interface ReplayHeaderProps {
  game: Game;
  description: string;
}

export const ReplayHeader = (props: ReplayHeaderProps) => {
  const { game, description } = props;

  return (
    <div className="flex flex-col items-center mb-8">
      <h1 className="text-4xl font-bold">{getGameName(game.game_id)}</h1>
      <p className="text-xl mt-4">{description}</p>
    </div>
  );
};
