import { useEffect, useState } from "react";
import { GameCard } from "../Components/Game/GameCard";
import g from "../Games/games.json";
import { GameInfos } from "../Interfaces/Game";
import { useSelector } from "react-redux";
import { useAppSelector } from "../hooks/hooks";
import { get } from "../utils/requests/get";
import { Loader } from "../Components/Loader/Loader";

export const Home = () => {
  const user = useSelector((state: any) => state.user);
  const token = useAppSelector((state) => state.token);

  const gamesCards = [...g.games];

  const [maxLength, setMaxLength] = useState(18);
  const [games, setGames] = useState([]);
  const [preferedGames, setPreferedGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGames = async () => {
    const response = await get(`games/user/${user.id}`, token);

    setGames(response);
  };

  useEffect(() => {
    document.title = "Hackamapa - Home";

    const fetchData = async () => {
      setLoading(true);
      await fetchGames();
      await getPreferedGames();

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    getPreferedGames();
  }, [games]);

  const generateId = () => {
    return Math.floor(Math.random() * 1000000);
  };

  for (let i = preferedGames.length + 1; i <= 6; i++) {
    preferedGames.push({
      id: generateId(),
      name: "Game",
      description: "Description",
      image: "none",
      link: "/",
    });
  }

  for (let i = gamesCards.length + 1; i <= maxLength; i++) {
    gamesCards.push({
      id: generateId(),
      name: "Game",
      description: "Description",
      image: "none",
      link: "/",
      tag: "none",
      difficulty: "none",
      players: 0,
      howToPlay: "none",
    });
  }

  const getPreferedGames = async () => {
    const gamesIds = games.map((game: any) => game.game_id);

    const gamesCount = gamesIds.reduce((acc: any, curr: any) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});

    const sortedGames = Object.entries(gamesCount).sort(
      ([, a], [, b]) => (b as any) - (a as any)
    );

    const preferedGames = sortedGames.slice(0, 5).map((game) => game[0]);

    const preferedGamesInfos = gamesCards.filter((game) =>
      preferedGames.includes(game.id.toString())
    );

    setPreferedGames(preferedGamesInfos);
  };

  useEffect(() => {
    for (let i = gamesCards.length + 1; i <= maxLength; i++) {
      gamesCards.push({
        id: i,
        name: "Game",
        description: "Description",
        image: "none",
        link: "/",
        tag: "none",
        difficulty: "none",
        players: 0,
        howToPlay: "none",
      });
    }
  }, [maxLength]);

  return (
    <div className="container m-auto py-5">
      {loading ? (
        <div className="h-screen flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <>
          <h2 className="text-left text-2xl font-bold">Vos jeux préférés : </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5 mt-5">
            {preferedGames.map((game: GameInfos) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
          <h2 className="text-left text-2xl font-bold mt-6">
            Notre sélection :
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5 mt-5">
            {gamesCards.map((game: GameInfos) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
