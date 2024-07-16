import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "../../../../Components/Button/Button";

import "./WaitingRoom.css";
import { User } from "../../../../../../Interfaces/User";

interface WaitingRoomProps {
  handleSetReady: () => void;
  handleStartGame: () => void;
}

export const WaitingRoom = (props: WaitingRoomProps) => {
  const actualRoom = useSelector((state: any) => state.ActualRoom);
  const actualUser = useSelector((state: any) => state.User);

  const { handleSetReady, handleStartGame } = props;
  const [hasEnoughPlayers, setHasEnoughPlayers] = useState<boolean>(false);
  const [usersInRoom, setUsersInRoom] = useState<number>(0);
  const [usersReady, setUsersReady] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(-1);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (actualRoom?.users.length === 2) {
      setHasEnoughPlayers(true);
    } else {
      setHasEnoughPlayers(false);
    }

    actualRoom && setUsersInRoom(actualRoom?.users.length);

    getUsersReady();
  }, [actualRoom]);

  useEffect(() => {
    if (countdown > 0 && countdown !== -1) {
      setShowModal(true);
      const interval = setInterval(() => {
        setCountdown((countdown) => countdown - 1);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    } else {
      setShowModal(false);
      countdown !== -1 && handleStartGame();
    }
  }, [countdown]);

  const getUsersReady = () => {
    let usersReady = 0;
    actualRoom?.users.forEach((user: User) => {
      if (user.ready) {
        usersReady++;
      }
    });
    setUsersReady(usersReady);

    if (usersReady === 2) {
      startGame();
    }
  };

  const startGame = () => {
    setCountdown(1);
  };

  return (
    <div className="waiting-room">
      <div className={showModal ? "modal-overlay" : ""}>
        {showModal && (
          <div className="modal-box">
            <p>Game starting in {countdown}...</p>
          </div>
        )}
      </div>
      <Button
        className={
          actualUser?.isReadyToPlay ? "not-ready-button" : "ready-button"
        }
        onClick={handleSetReady}
        label={
          !hasEnoughPlayers
            ? `Minimum 2 joueurs, il manque ${usersInRoom} joueurs`
            : actualUser?.isReadyToPlay
            ? "Pas prêt"
            : "Prêt"
        }
        disabled={!hasEnoughPlayers}
      />
      <div className="users-ready">
        <p>
          {usersReady}/{usersInRoom} joueurs prêts
        </p>
      </div>
    </div>
  );
};
