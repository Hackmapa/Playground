import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { get } from "../../utils/requests/get";
import { User } from "../../Interfaces/User";
import { Game } from "../../Interfaces/Game";
import { updateProfilePicture } from "../../Redux/user/userSlice";
import { FaRegPenToSquare } from "react-icons/fa6";
import { toast } from "react-toastify";
import { IoMdCalendar } from "react-icons/io";
import { LuMedal } from "react-icons/lu";
import { Loader } from "../../Components/Loader/Loader";
import { dateToString } from "../../utils/utils";
import { GameHistory } from "./GameHistory";
import { ModalBox } from "../../Components/ModalBox/ModalBox";
import { UpdateUserModal } from "./UpdateUserModal";

export const Profile = () => {
  const actualUser = useAppSelector((state) => state.user);
  const token = useAppSelector((state) => state.token);

  const dispatch = useAppDispatch();

  const [user, setUser] = useState<User>();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

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
                src={user?.profile_picture}
                alt="user_profile"
                className="w-52 h-52 rounded-full transition duration-200 ease-in-out transform hover:cursor-pointer"
              />
              <input
                type="file"
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <div className="text-left">
                <h1 className="text-2xl font-bold">@{user.username}</h1>
                <p className="text- font-light">
                  {user.firstname} {user.lastname}
                </p>
              </div>
            </div>
            <div>
              <button
                className="bg-darkBlue-dark text-white py-2 px-4 flex border-2 rounded-3xl items-center gap-2 hover:bg-white hover:text-darkBlue-dark hover:border-darkBlue-dark transition duration-200"
                onClick={() => setOpenModal(true)}
              >
                <FaRegPenToSquare />
                Modifier le profil
              </button>
            </div>
          </div>
          <div className="flex mt-8 gap-8">
            <div className="w-1/4">
              <div className="flex items-center justify-between bg-darkBlue-gray rounded-xl px-3 py-4">
                <p className="text-2xl font-bold">Amis</p>
                <p className="text-2xl font-bold">
                  {user?.notificationFriends?.length}
                </p>
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
                <div className="mt-3">
                  {user.badges.length > 0 ? (
                    user.badges.map((badge) => (
                      <div className="flex items-center gap-2 mt-4">
                        <img
                          src="badge.svg"
                          alt="badge"
                          className="w-10 h-10"
                        />
                        <p>{badge}</p>
                      </div>
                    ))
                  ) : (
                    <div>
                      <p>Jouez pour gagner des badges</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-3/4 flex flex-col text-left bg-darkBlue-gray rounded-xl px-3 py-4">
              <p className="text-2xl font-bold">Historique des parties</p>
              <GameHistory games={games} />
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};
