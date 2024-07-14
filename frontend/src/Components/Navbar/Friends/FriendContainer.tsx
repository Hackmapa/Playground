import { User } from "../../../Interfaces/User";
import { FriendCard } from "./FriendCard";

interface FriendContainerProps {
  friends: User[];
}

export const FriendContainer = (props: FriendContainerProps) => {
  const { friends } = props;

  return (
    <div className="absolute mt-8 top-3 right-0 w-52 h-96 border-darkBlue bg-white text-darkBlue rounded-md shadow-lg overflow-auto trasnform translate-x-1/2 flex flex-col">
      <p className="border-b py-2 font-semibold">Amis ({friends.length})</p>

      {friends.length === 0 && <p>No friends</p>}

      {friends.map((friend, index) => (
        <FriendCard key={index} friend={friend} />
      ))}
    </div>
  );
};
