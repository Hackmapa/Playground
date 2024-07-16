import { useEffect, useState } from "react";
import g from "../../Games/games.json";
import { GameInfos } from "../../Interfaces/Game";

interface HowToPlayProps {
  gameTag: string;
}

export const HowToPlay = (props: HowToPlayProps) => {
  const { gameTag } = props;

  const [game, setGame] = useState<GameInfos>();

  const getGame = () => {
    const games = g.games;
    const game = games.find((g) => g.tag === gameTag);

    setGame(game);
  };

  useEffect(() => {
    getGame();
  }, []);

  return (
    <div className="mt-4 mb-10 w-1/2 flex flex-col items-center mx-auto">
      <h2 className="text-2xl font-bold">Comment jouer ?</h2>
      <p className="mt-4">{game?.howToPlay}</p>
    </div>
  );
};
