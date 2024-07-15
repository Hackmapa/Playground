import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "../Redux/store";
import { Overlay } from "./Overlay";
import { Home } from "../Pages/Home";
import { Login } from "../Pages/Login";
import { Register } from "../Pages/Register";
import { RPS } from "../Games/RPS/RPS";
import { socket } from "../socket";
import { TicTacToe } from "../Games/TicTacToe/Components/TicTacToe";
import { useEffect } from "react";
import { Profile } from "../Pages/Profile/Profile";
import { TicTacToeReplay } from "../Games/TicTacToe/Components/TicTacToeReplay";
import { Rooms } from "./Room/Rooms";
import { toast } from "react-toastify";
import { addUser } from "../Redux/user/userSlice";
import { get } from "../utils/requests/get";
import { useAppDispatch } from "../hooks/hooks";
import { getUser } from "../utils/getUser";

export const RouterContainer = () => {
  const dispatch = useAppDispatch();

  const token = useSelector((state: RootState) => state.token);
  const user = useSelector((state: RootState) => state.user);
  const isLogged = token !== "";

  useEffect(() => {
    if (isLogged) {
      socket.connect();

      getUser(dispatch, token);

      socket.emit("login", user);
    }
  }, []);

  return (
    <BrowserRouter>
      {isLogged ? (
        <Overlay>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/rock-paper-scissors" element={<RPS />} />
            <Route path="/rooms/:name" element={<Rooms />} />
            <Route path="/tic-tac-toe/:id" element={<TicTacToe />} />
            <Route
              path="/tic-tac-toe/replay/:gameId"
              element={<TicTacToeReplay />}
            />
            <Route path="/profile/:id" element={<Profile />} />
          </Routes>
        </Overlay>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};
