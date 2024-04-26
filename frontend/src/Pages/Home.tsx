import { useState } from "react";
import { GameCard } from "../Components/Game/GameCard";
import { Game } from "../Interfaces/Game";

export const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const games: Game[] = [
    {
      id: 1,
      name: "Tic Tac Toe",
      image: "/tictactoe.jpeg",
      description:
        "Play the classic game of Tic Tac Toe with a friend or against the computer !",
      link: "/tictactoe",
    },
    {
      id: 2,
      name: "Rock Paper Scissors",
      image: "/rockpaperscissors.jpg",
      description:
        "Test your luck and strategy in this classic game of Rock Paper Scissors !",
      link: "/rockpaperscissors",
    },
    {
      id: 3,
      name: "Neon Snake",
      image: "/neonsnake.png",
      description:
        "Eat the food and grow your snake in this modern twist on the classic Snake game !",
      link: "/neonsnake",
    },
  ];

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div
        className="flex flex-wrap justify-around bg-[#281E35] bg-[url('/public/texture.png')] bg-no-repeat bg-cover h-screen gap-2"
        style={{ backgroundBlendMode: "overlay" }}
      >
        {filteredGames.map((game, index) => (
          <GameCard game={game} index={index} />
        ))}
      </div>
    </div>
  );
};
