import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { get } from "../utils/requests/get";
import { User } from "../Interfaces/User";
import { Game } from "../Interfaces/Game";
import g from "../Games/games.json";

export const Profile = () => {
  const dispatch = useAppDispatch();
  const actualUser = useAppSelector((state) => state.user);
  const token = useAppSelector((state) => state.token);

  const [user, setUser] = useState<User>();
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    document.title = "Hackmapa - Profile";

    const fetchUser = async () => {
      const user = await get(`users/${actualUser.id}`, token);
      setUser(user);
    };

    const fetchGames = async () => {
      const games = await get(`games/user/${actualUser.id}`, token);
      setGames(games);

      console.log(games);
    };

    fetchUser();
    fetchGames();
  }, []);

  return (
    <div className="w-full">
      <h1>Profile</h1>

      <div className="flex items-center flex-col">
        <div className="flex w-full justify-center">
          <img
            src={`/images/${user?.profilePicture}`}
            alt="profile"
            className="w-20 h-20 rounded-full"
          />
        </div>
        <div className="flex justify-around w-full">
          <div className="w-1/3">
            <p>Firstname: {user?.firstname}</p>
          </div>

          <div className="w-1/3">
            <p>Lastname: {user?.lastname}</p>
          </div>
        </div>

        <div className="flex justify-around w-full">
          <div className="w-1/3">
            <p>Email: {user?.email}</p>
          </div>

          <div className="w-1/3">
            <p>Username: {user?.username}</p>
          </div>
        </div>
      </div>

      <GameHistory games={games} />
    </div>
  );
};

interface GameHistoryProps {
  games: Game[];
}

const GameHistory = (props: GameHistoryProps) => {
  const { games } = props;

  return (
    <div className="flex flex-col items-center">
      <h1>Game History</h1>

      <div className="flex flex-col gap-2 px-10 justify-center w-1/3">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};

interface GameCardProps {
  game: Game;
}

const GameCard = (props: GameCardProps) => {
  const { game } = props;

  const getGameName = (gameId: number) => {
    let name = "";

    g.games.forEach((g) => {
      if (g.id === gameId) {
        name = g.name;
      }
    });

    return name;
  };

  return (
    <div className="bg-white p-2 mt-2 border rounded-xl">
      <div className="text-black">
        <h2>{getGameName(game.gameId)}</h2>
        {game.draw && !game.winner ? (
          <p>Draw</p>
        ) : game.winner ? (
          <p>{game.winner.username} won</p>
        ) : (
          <p>Game not finished</p>
        )}

        {!game.winner && !game.draw && <p>Game not finished</p>}
        <div className="flex justify-between">
          <div>
            <img
              src={`/images/${game.players[0].profilePicture}`}
              alt="profile"
              className="w-10 h-10 rounded-full"
            />
            <p>{game.players[0].username}</p>
          </div>
          <div>
            <p>VS</p>
          </div>

          <div>
            <img
              src={`/images/${game.players[1].profilePicture}`}
              alt="profile"
              className="w-10 h-10 rounded-full"
            />
            <p>{game.players[1].username}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
