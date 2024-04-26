import React from "react";
import { Game } from "../../Interfaces/Game";
import "./GameCard.css";

interface GameCardProps {
  game: Game;
  index: number;
}

export const GameCard: React.FC<GameCardProps> = ({ game, index }) => {
  const colors = ["#a65a7f", "#5d7a9c", "#950495"];
  const color = colors[index % colors.length];

  return (
    <div
      className="card-container w-[25%] bg-[#271d34] h-[300px] rounded-lg shadow-lg relative overflow-hidden transform transition duration-300 ease-in-out"
      style={{
        perspective: "1000px",
        border: `2px solid ${color}`,
        boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
      }}
    >
      <div className="card w-full h-full absolute">
        <div className="card-front w-full h-full absolute backface-hidden">
          <div className="h-[80%]">
            <img
              className="w-full h-full object-cover rounded-t-lg"
              src={game.image}
              alt={game.name}
            />
          </div>
          <div className="h-[20%] flex justify-center items-center bg-transparent">
            <p className="text-white text-lg">{game.name}</p>
          </div>
        </div>
        <div className="card-back w-full h-full absolute backface-hidden">
          <div className="overlay p-4">{game.description}</div>
        </div>
      </div>
    </div>
  );
};
