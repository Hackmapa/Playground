import { useState, useRef, useEffect } from "react";
import { GoPeople } from "react-icons/go";
import { User } from "../../../Interfaces/User";
import { FriendContainer } from "./FriendContainer";

interface FriendDropdownProps {
  friends: User[];
}

export const FriendDropdown = (props: FriendDropdownProps) => {
  const { friends } = props;

  const [openFriends, setOpenFriends] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setOpenFriends(false);
    }
  };

  useEffect(() => {
    if (openFriends) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openFriends]);

  return (
    <div className="relative" ref={containerRef}>
      <div
        className="w-10 h-10 bg-darkBlue flex items-center justify-center rounded-full p-2 hover:text-darkBlue hover:bg-white hover:border-white transition duration-200"
        onClick={() => setOpenFriends(!openFriends)}
      >
        <GoPeople size={28} className="cursor-pointer" />
      </div>
      {openFriends && <FriendContainer friends={friends} />}
    </div>
  );
};
