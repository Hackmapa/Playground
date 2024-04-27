import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";

export const Profile = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    document.title = "Hackmapa - Profile";
  }, []);

  return (
    <div>
      <h1>Profile</h1>
    </div>
  );
};
