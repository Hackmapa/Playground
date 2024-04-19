import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "../Redux/store";
import { Overlay } from "./Overlay";
import { Home } from "../Pages/Home";
import { Login } from "../Pages/Login";
import { Register } from "../Pages/Register";
import { RPS } from "../Games/RPS/RPS";
import SnakeGame from "../Games/Snake/SnakeGame";
import { TttRooms } from "../Games/TicTacToe/Components/TttRooms";
import { socket } from "../socket";

export const RouterContainer = () => {
  const token = useSelector((state: RootState) => state.token);
  const user = useSelector((state: RootState) => state.user);
  const isLogged = token !== "";

  if (isLogged) {
    socket.connect();

    socket.emit("login", user);
  }

  return (
    <BrowserRouter>
      {isLogged ? (
        <Overlay>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/rock-paper-scissors" element={<RPS />} />
            <Route path="/snake" element={<SnakeGame />} />
            <Route path="/tic-tac-toe" element={<TttRooms />} />
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
