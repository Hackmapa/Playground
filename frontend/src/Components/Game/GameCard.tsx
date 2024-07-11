import { useNavigate } from "react-router-dom";
import { GameInfos } from "../../Interfaces/Game";
import { Button } from "../Button/Button";

interface GameCardProps {
  game: GameInfos;
}

export const GameCard = (props: GameCardProps) => {
  const { game } = props;
  const navigate = useNavigate();

  return (
    <div className="bg-darkBlue p-4 m-4 rounded-lg shadow-lg w-1/5">
      <div className="flex flex-col">
        <img
          src={`${game.image}`}
          alt={`${game.image}`}
          className="h-40 object-cover rounded-lg"
        />
      </div>
      <div className="mt-2 flex flex-col justify-between ">
        <h3>{game.name}</h3>
        <p>
          {game.description.length > 100
            ? `${game.description.slice(0, 100)}...`
            : game.description}
        </p>
        <Button
          text="Play"
          onClick={() => {
            navigate(game.link);
          }}
          className="bg-green-500 hover:bg-green-600 w-full mt-2"
        />
      </div>
    </div>
  );
};
