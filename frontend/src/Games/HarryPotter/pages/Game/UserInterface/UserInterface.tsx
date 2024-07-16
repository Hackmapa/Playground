import { SpellSelection } from "./SpellSelection/SpellSelection";
import "./UserInterface.css";
import { WaitingRoom } from "../Rooms/WaitingRoom/WaitingRoom";
import { Game } from "../../../../../Interfaces/Game";
import { Character } from "../../../../../Interfaces/HarryPotter/Character";
import { HarryPotterRoom } from "../../../../../Interfaces/Rooms";

interface UserInterfaceProps {
  characters: Character[];
  game: HarryPotterRoom | undefined;
  socket: any;
  hasChosenSpell: boolean;
  setHasChosenSpell: (hasChosenSpell: boolean) => void;
  handleSetReady: () => void;
  handleStartGame: () => void;
}

export const UserInterface = (props: UserInterfaceProps) => {
  const {
    characters,
    game,
    socket,
    hasChosenSpell,
    handleSetReady,
    handleStartGame,
    setHasChosenSpell,
  } = props;

  return (
    <div className="user-interface">
      {game && game.started ? (
        <SpellSelection
          characters={characters}
          isGameStarted={game.started}
          socket={socket}
          hasChosenSpell={hasChosenSpell}
          setHasChosenSpell={setHasChosenSpell}
        />
      ) : (
        <WaitingRoom
          handleSetReady={handleSetReady}
          handleStartGame={handleStartGame}
        />
      )}
    </div>
  );
};
