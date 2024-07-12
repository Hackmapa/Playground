import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { get } from "../utils/requests/get";
import { User } from "../Interfaces/User";
import { Game } from "../Interfaces/Game";
import g from "../Games/games.json";
import { Button } from "../Components/Button/Button";
import { useNavigate } from "react-router-dom";
import { updateProfilePicture } from "../Redux/user/userSlice";
import { Loader } from "../Components/Loader/Loader";
import { Input } from "../Components/Input/Input";
import { ModalBox } from "../Components/ModalBox/ModalBox";
import { toast } from "react-toastify";

export const Profile = () => {
  const actualUser = useAppSelector((state) => state.user);
  const token = useAppSelector((state) => state.token);

  const [user, setUser] = useState<User>();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Hackmapa - Profile";

    const fetchData = async () => {
      setLoading(true);
      await fetchUser();
      await fetchGames();
      setLoading(false);
    };

    const fetchUser = async () => {
      setLoading(true);
      const user = await get(`users/${actualUser.id}`, token);
      setUser(user);
      setLoading(false);
    };

    const fetchGames = async () => {
      setLoading(true);
      const games = await get(`games/user/${actualUser.id}`, token);
      setGames(games);
      setLoading(false);
    };

    fetchData();
  }, [actualUser]);

  return (
    <div className="w-full">
      {loading || !user ? (
        <Loader />
      ) : (
        <div className="container mx-auto pt-6">
          <h1 className="text-3xl text-center">Profile</h1>
          <div className="flex items-center mb-6">
            <div className="w-1/3">
              <div className="flex flex-col items-center">
                <img
                  src={user?.profilePicture}
                  alt="Profile"
                  className="rounded-full w-52 h-52 object-cover"
                />

                <ProfilePictureUpload user={user} token={token} />
              </div>
            </div>
            <div className="w-2/3 ml-6 flex flex-col h-full justify-between">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>Username:</p>
                  <p>{user.username}</p>
                </div>

                <div>
                  <p>Firstname:</p>
                  <p>{user.firstname}</p>
                </div>

                <div>
                  <p>Lastname:</p>
                  <p>{user.lastname}</p>
                </div>

                <div>
                  <p>Email:</p>
                  <p>{user.email}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  text="Update"
                  className="bg-[#1F3540] text-white rounded-lg"
                />
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-1/3">
              <GameHistory games={games} />
            </div>
            <div className="w-2/3">
              <Statistics />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface GameHistoryProps {
  games: Game[];
}

const GameHistory = (props: GameHistoryProps) => {
  const { games } = props;

  return (
    <div className="flex flex-col items-center w-full mt-4">
      <h1>Game History</h1>

      <div className="flex flex-col gap-2 px-10 justify-center w-full">
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

  const navigate = useNavigate();

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
              src={game.players[0].profilePicture}
              alt="profile"
              className="w-10 h-10 rounded-full"
            />
            <p>{game.players[0].username}</p>
          </div>
          <div>
            <p>VS</p>
            <Button
              text="Replay"
              className="bg-[#1F3540] text-white rounded-lg"
              onClick={() => navigate(`/tic-tac-toe/replay/${game.id}`)}
            />
          </div>

          <div>
            <img
              src={game.players[1].profilePicture}
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

interface ProfilePictureUploadProps {
  user: User | undefined;
  token: string;
}

const ProfilePictureUpload = (props: ProfilePictureUploadProps) => {
  const { user, token } = props;

  const dispatch = useAppDispatch();

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Choose a file");

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", file);

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/users/${user?.id}/profile-picture`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    dispatch(updateProfilePicture(data.profile_picture_url));

    toast.success("Profile picture updated");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center space-y-4 w-full mt-4"
    >
      <div className="flex gap-2 w-full justify-center">
        <div className="relative max-w-sm">
          <input
            type="file"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <button
            type="button"
            className="bg-[#1F3540] text-white rounded-lg py-2 px-4 flex justify-between items-center"
          >
            <span>{fileName}</span>
            <span className="ml-4 text-sm">+</span>
          </button>
        </div>
        <button
          type="submit"
          className="bg-[#1F3540] text-white rounded-lg py-2 px-4 max-w-sm"
        >
          Upload
        </button>
      </div>
    </form>
  );
};

const Statistics = () => {
  return (
    <div className="flex flex-col items-center w-full mt-4">
      <h1>Statistics</h1>
    </div>
  );
};
