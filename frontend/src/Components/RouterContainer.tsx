import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "../Redux/store";
import { Overlay } from "./Overlay";
import { Home } from "../Pages/Home";
import { Login } from "../Pages/Login";
import { Register } from "../Pages/Register";
import { RPS } from "../Games/RPS/RPS";
import { TttRooms } from "../Games/TicTacToe/Components/TttRooms";
import { socket } from "../socket";
import { TicTacToe } from "../Games/TicTacToe/Components/TicTacToe";
import { useEffect } from "react";
import { Profile } from "../Pages/Profile/Profile";
import { TicTacToeReplay } from "../Games/TicTacToe/Components/TicTacToeReplay";

export const RouterContainer = () => {
  const token = useSelector((state: RootState) => state.token);
  const user = useSelector((state: RootState) => state.user);
  const isLogged = token !== "";

  useEffect(() => {
    if (isLogged) {
      socket.connect();

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
            <Route path="/tic-tac-toe" element={<TttRooms />} />
            <Route path="/tic-tac-toe/:id" element={<TicTacToe />} />
            <Route
              path="/tic-tac-toe/replay/:gameId"
              element={<TicTacToeReplay />}
            />
            <Route path="/profile" element={<Profile />} />
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
