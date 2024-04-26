import { Navbar } from "./Navbar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { socket } from "../socket";
import { useEffect, useState } from "react";
import { ChatBox } from "./ChatBox/ChatBox";
import { useAppDispatch } from "../hooks/hooks";

interface OverlayProps {
  children: React.ReactNode;
}

export const Overlay = (props: OverlayProps) => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    socket.on("users", (data: any) => {
      dispatch({ type: "users/setUsers", payload: data });
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const { children } = props;
  return (
    <div>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      <ChatBox />
      <ToastContainer />
      <div className="bg-darkBlue-light min-h-screen text-white">
        {children}
      </div>
    </div>
  );
};
