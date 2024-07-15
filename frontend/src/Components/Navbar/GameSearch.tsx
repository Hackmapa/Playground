import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import gamesData from "../../Games/games.json";
import { useNavigate } from "react-router-dom";

interface Game {
  id: number;
  name: string;
  description: string;
  link: string;
}

export const GameSearch = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredGames([]);
      setShowDropdown(false);
    } else {
      const filtered = gamesData.games.filter((game) =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGames(filtered);
      setShowDropdown(true);
    }
  }, [searchTerm]);

  const handleInputChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleClick = (game: Game) => {
    navigate(`rooms${game.link}`);
    setSearchTerm("");
  };

  return (
    <div className="relative w-1/4">
      <div className="flex items-center bg-darkBlue rounded-3xl">
        <input
          type="text"
          placeholder="Recherchez un jeu ..."
          className="flex-grow bg-darkBlue font-bold px-5 py-2 text-gray-400 focus:outline-none focus:ring-0 rounded-3xl"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <FaSearch className="text-gray-400 mr-4" />
      </div>
      {showDropdown && filteredGames.length > 0 && (
        <ul className="absolute mt-1 w-full bg-darkBlue rounded-xl shadow-lg z-10">
          {filteredGames.map((game, index) => (
            <li
              key={index}
              className="px-4 py-2 border border-darkBlue hover:bg-darkBlue-gray cursor-pointer rounded-xl transition duration-200 font-bold"
              onClick={() => handleClick(game)}
            >
              {game.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
