import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { get } from "../../utils/requests/get";
import { User } from "../../Interfaces/User";
import { Game } from "../../Interfaces/Game";
import { updateProfilePicture } from "../../Redux/user/userSlice";
import { FaRegPenToSquare } from "react-icons/fa6";
import { toast } from "react-toastify";
import { IoMdAdd, IoMdCalendar } from "react-icons/io";
import { LuMedal } from "react-icons/lu";
import { Loader } from "../../Components/Loader/Loader";
import { dateToString } from "../../utils/utils";
import { GameHistory } from "./GameHistory";
import { ModalBox } from "../../Components/ModalBox/ModalBox";
import { UpdateUserModal } from "./UpdateUserModal";
import { Badge } from "../../Interfaces/Badges";
import { checkIfUserHasBadge } from "../../utils/badge";
import { useParams } from "react-router-dom";
import { socket } from "../../socket";
import { addFriends } from "../../Redux/friends/friendSlice";

export const Profile = () => {
  const { id } = useParams<{ id: string }>();

  const token = useAppSelector((state) => state.token);
  const actualUser = useAppSelector((state) => state.user);
  const users = useAppSelector((state) => state.users);

  const dispatch = useAppDispatch();

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [user, setUser] = useState<User>();
  const [friends, setFriends] = useState<User[]>([]);
  const [hover, setHover] = useState(false);

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      handleSubmit(event, selectedFile);
    }
  };

  const handleSubmit = async (event: any, file: any) => {
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

  const isActualUser = () => {
    if (id) {
      return actualUser.id === parseInt(id);
    }

    return false;
  };

  const handleAddFriend = async () => {
    socket.emit("sendFriendRequest", actualUser.id, user?.id, users, token);
  };

  const fetchUser = async () => {
    const user = await get(`users/${id}`, token);
    setUser(user);
  };

  const fetchGames = async () => {
    const games = await get(`games/user/${id}`, token);
    setGames(games);
  };

  const fetchBadges = async () => {
    const badges = await get(`badges`, token);
    setBadges(badges);
  };

  const fetchFriends = async () => {
    const friends = await get(`friends/${actualUser?.id}`, token);
    setFriends(friends);
    dispatch(addFriends(friends));
  };

  const isAlreadyFriend = () => {
    if (friends) {
      return friends.find((friend: any) => friend.friend.id === actualUser.id);
    }
    return false;
  };

  const handleRemoveFriend = async () => {
    socket.emit("removeFriend", actualUser.id, user?.id, users, token);

    fetchFriends();
  };

  useEffect(() => {
    document.title = "Hackmapa - Profile";

    const fetchData = async () => {
      setLoading(true);
      await fetchUser();
      await fetchGames();
      await fetchBadges();
      await fetchFriends();
      setLoading(false);
    };
    fetchData();
  }, [id, actualUser]);

  return (
    <>
      {user && (
        <ModalBox
          open={openModal}
          setOpen={setOpenModal}
          className="bg-darkBlue-dark"
        >
          <UpdateUserModal user={user} />
        </ModalBox>
      )}
      {user && !loading ? (
        <div className="w-1/2 mx-auto pt-6">
          <div className="flex justify-between items-end">
            <div className="relative flex gap-5 items-end">
              <img
                src={user.profile_picture}
                alt="user_profile"
                className={
                  "w-52 h-52 rounded-full transition duration-200 ease-in-out transform object-cover " +
                  (hover ? "filter brightness-50 " : "") +
                  (isActualUser() ? "hover:cursor-pointer" : "")
                  // i need to darken the image on hover
                }
              />
              {isActualUser() && (
                <input
                  type="file"
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                />
              )}
              <div className="text-left">
                <h1 className="text-2xl font-bold">@{user.username}</h1>
                <p className="text- font-light">
                  {user.firstname} {user.lastname}
                </p>
              </div>
            </div>
            {isActualUser() && (
              <div>
                <button
                  className="bg-darkBlue text-white py-2 px-4 flex rounded-3xl items-center gap-2 hover:bg-white hover:text-darkBlue-dark transition duration-200"
                  onClick={() => setOpenModal(true)}
                >
                  <FaRegPenToSquare />
                  Modifier le profil
                </button>
              </div>
            )}
          </div>
          <div className="flex mt-8 gap-8">
            <div className="w-1/4">
              <div
                className={
                  "flex items-center bg-darkBlue-gray rounded-xl px-3 py-4 " +
                  (isActualUser() ? "justify-between" : "justify-center")
                }
              >
                {!isActualUser() ? (
                  <div className="flex justify-center">
                    {isAlreadyFriend() ? (
                      <div>
                        <button
                          className="w-full bg-red-500 text-white py-2 px-4 flex border-2 border-red-500 rounded-3xl items-center hover:bg-white hover:text-red-500 hover:border-red-500 transition duration-200"
                          onClick={handleRemoveFriend}
                        >
                          Retirer des amis
                        </button>
                      </div>
                    ) : (
                      <button
                        className="w-full bg-darkBlue-dark text-white py-2 px-4 flex border-2 rounded-3xl items-center hover:bg-white hover:text-darkBlue-dark hover:border-darkBlue-dark transition duration-200"
                        onClick={handleAddFriend}
                      >
                        <IoMdAdd />
                        Ajouter en ami
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="text-2xl font-bold">Amis</p>
                    <p className="text-2xl font-bold">{friends.length}</p>
                  </>
                )}
              </div>
              <div className="flex flex-col justify-center text-left bg-darkBlue-gray rounded-xl px-3 py-4 mt-4">
                <p className="text-2xl font-bold">Stats</p>
                <div className="flex items-center gap-2 mt-4">
                  <IoMdCalendar size={40} color="gray" />
                  <div>
                    <p className="text-gray-400">Membre depuis</p>
                    <p className="text-xl">{dateToString(user.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <LuMedal size={40} color="gray" />
                  <div>
                    <p className="text-gray-400">Parties gagnées</p>
                    <p className="text-xl">{user.winnedGames?.length}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center text-left bg-darkBlue-gray rounded-xl px-3 py-4 mt-4">
                <p className="text-2xl font-bold">Badges</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 justify-between mt-2">
                  {id &&
                    badges.map((badge) => (
                      <BadgeMedal
                        id={id}
                        user={user}
                        badge={badge}
                        key={badge.id}
                      />
                    ))}
                </div>
              </div>
            </div>
            <div className="w-3/4 flex flex-col text-left bg-darkBlue-gray rounded-xl px-3 py-4">
              <p className="text-2xl font-bold">Historique des parties</p>
              <GameHistory user={user} games={games} />
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen flex justify-center items-center">
          <Loader />
        </div>
      )}
    </>
  );
};

interface BadgeMedalProps {
  id: string;
  user: User;
  badge: Badge;
}

const BadgeMedal = (props: BadgeMedalProps) => {
  const { id, user, badge } = props;

  const actualUser = useAppSelector((state) => state.user);

  const [showInfo, setShowInfo] = useState(false);

  const isActualUser = () => {
    if (id) {
      return actualUser.id === parseInt(id);
    }

    return false;
  };

  return (
    <div
      className="relative flex justify-center cursor-pointer mt-2"
      onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
    >
      {checkIfUserHasBadge(user, badge.tag) ? (
        <div>
          <img
            src={`${process.env.REACT_APP_PUBLIC_URL}${badge.logo}`}
            alt={badge.name}
            className="w-8 h-8"
          />
          {showInfo && (
            <div className="absolute bg-white rounded-xl bottom-9 text-darkBlue-dark p-3 min-w-72">
              <h3 className="text-center font-bold text-xl">{badge.name}</h3>
              <p className="mt-2">{badge.description}</p>
              <p className="text-green-600 text-xs italic mt-2">
                {isActualUser()
                  ? "Vous avez obtenu ce badge"
                  : "L'utilisateur a obtenu ce badge"}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="w-8 h-8 bg-darkBlue rounded-full"></div>
          {showInfo && (
            <div className="absolute bg-white rounded-xl bottom-9 text-darkBlue-dark p-3 min-w-72">
              <h3 className="text-center font-bold text-xl">{badge.name}</h3>
              <p className="mt-2">{badge.description}</p>
              <p className="text-red-600 text-xs italic mt-2">
                {isActualUser()
                  ? "Vous n'avez pas encore obtenu ce badge"
                  : "L'utilisateur n'a pas encore obtenu ce badge"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
