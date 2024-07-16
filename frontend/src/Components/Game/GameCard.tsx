import { useNavigate } from "react-router-dom";
import { GameInfos } from "../../Interfaces/Game";
import { useEffect, useState } from "react";

interface GameCardProps {
  game: GameInfos;
}

export const GameCard = (props: GameCardProps) => {
  const { game } = props;
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {}, []);

  return (
    <div
      className="bg-darkBlue-gray rounded-lg shadow-lg h-72 hover:scale-105 transition-transform duration-200 overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full justify-between">
        {game.image !== "none" && (
          <>
            <img
              src={`${process.env.REACT_APP_PUBLIC_URL}${game.image}`}
              alt={game.name}
              className={`h-full w-full object-cover absolute top-0 left-0 transition-opacity duration-400 ${
                isHovered ? "opacity-0" : "opacity-100"
              }`}
            />
            <img
              src={`${process.env.REACT_APP_PUBLIC_URL}${game.video}`}
              alt={`${game.name} GIF`}
              className={`h-full w-full object-cover absolute top-0 left-0 transition-opacity duration-400 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`flex flex-col justify-between h-full p-4 absolute top-0 left-0 w-full transition-opacity duration-400 cursor-pointer ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => navigate(`/rooms${game.link}`)}
            >
              <div className="h-full flex-col justify-between">
                <h1 className="text-2xl font-bold text-darkBlue-gray">
                  {game.name}
                </h1>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
