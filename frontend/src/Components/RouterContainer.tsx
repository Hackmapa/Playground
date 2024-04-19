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
import { useAppDispatch } from "../hooks/hooks";
import { addUser } from "../Redux/user/userSlice";
import { useEffect } from "react";

export const RouterContainer = () => {
  const dispatch = useAppDispatch();
  const token = useSelector((state: RootState) => state.token);
  const user = useSelector((state: RootState) => state.user);
  const isLogged = token !== "";

  useEffect(() => {
    if (isLogged && !user.id) {
      socket.connect();

      console.log("user", user);

      socket.emit("login", user);

      dispatch(addUser(user));
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
            <Route path="/tic-tac-toe/{id}" element={<TicTacToe />} />
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
