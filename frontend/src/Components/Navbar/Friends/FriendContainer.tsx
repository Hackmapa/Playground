import { useState } from "react";
import { User } from "../../../Interfaces/User";
import { FriendCard } from "./FriendCard";
import { useAppSelector } from "../../../hooks/hooks";
import { get } from "../../../utils/requests/get";
import { Loader } from "../../Loader/Loader";
import { AddFriendCard } from "./AddFriendCard";

interface FriendContainerProps {
  friends: User[];
}

export const FriendContainer = (props: FriendContainerProps) => {
  const { friends } = props;

  const token = useAppSelector((state) => state.token);
  const user = useAppSelector((state) => state.user);

  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearchUser = async (e: any) => {
    setLoading(true);

    if (e.target.value.length === 0) {
      setSearched(false);
      setLoading(false);
    } else {
      setSearched(true);
    }

    const username = e.target.value;

    const response = await get(
      `users/user/search/?username=${username}`,
      token
    );

    console.log(response);

    setSearchedUsers(response);
    setLoading(false);
  };

  const isActualUser = (friendId: number) => {
    return user.id === friendId;
  };

  return (
    <div className="absolute mt-8 top-3 right-0 w-52 h-96 border-darkBlue bg-white text-darkBlue rounded-md shadow-lg overflow-auto trasnform translate-x-1/2 flex flex-col">
      <p className="border-b py-2 font-semibold">Amis ({friends.length})</p>

      <div className="flex flex-col border-b">
        <input
          type="text"
          placeholder="Rechercher un utilisateur ..."
          className="px-2 py-1 text-sm"
          onChange={handleSearchUser}
        />
      </div>

      {loading ? (
        <div className="flex justify-center mt-5">
          <Loader />
        </div>
      ) : !searched ? (
        <>
          {friends.length === 0 && <p>No friends</p>}

          {friends.map((friend, index) => (
            <FriendCard key={index} friend={friend} />
          ))}
        </>
      ) : (
        <>
          {searchedUsers.length === 0 && <p>No users found</p>}

          {searchedUsers.map(
            (user, index) =>
              !isActualUser(user.id) && (
                <AddFriendCard key={index} friend={user} />
              )
          )}
        </>
      )}
    </div>
  );
};
