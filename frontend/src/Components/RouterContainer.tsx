import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "../Redux/store";
import { Overlay } from "./Overlay";
import { Home } from "../Pages/Home";
import { Login } from "../Pages/Login";
import { Register } from "../Pages/Register";
import { RPS } from "../Games/RPS/RPS";
import { socket } from "../socket";
import { useEffect } from "react";
import { Profile } from "../Pages/Profile/Profile";
import { TicTacToeReplay } from "../Games/TicTacToe/Components/TicTacToeReplay";
import { Rooms } from "./Room/Rooms";
import { useAppDispatch } from "../hooks/hooks";
import { getUser } from "../utils/getUser";
import { GameRoom } from "./Room/Room";
import { RpsReplay } from "../Games/RPS/RpsReplay";

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
            <Route path="/rooms/:name" element={<Rooms />} />
            <Route path="/:gameTag/:id" element={<GameRoom />} />
            <Route
              path="/tic-tac-toe/replay/:gameId"
              element={<TicTacToeReplay />}
            />
            <Route
              path="/rock-paper-scissors/replay/:gameId"
              element={<RpsReplay />}
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
