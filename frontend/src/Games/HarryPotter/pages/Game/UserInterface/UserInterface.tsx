import { SpellSelection } from "./SpellSelection/SpellSelection";
import { Character } from "../../../../../Interfaces/HarryPotter/Character";
import { HarryPotterGame } from "../../../../../Interfaces/HarryPotter/HarryPotterGame";

interface UserInterfaceProps {
  gameId: number | undefined;
  characters: Character[];
  game: HarryPotterGame | undefined;
  socket: any;
  hasChosenSpell: boolean;
  setHasChosenSpell: (hasChosenSpell: boolean) => void;
}

export const UserInterface = (props: UserInterfaceProps) => {
  const {
    gameId,
    characters,
    game,
    socket,
    hasChosenSpell,
    setHasChosenSpell,
  } = props;

  return (
    <div className="user-interface">
      {game && game.started && !game.finished && (
        <SpellSelection
          gameId={gameId}
          characters={characters}
          isGameStarted={game.started}
          hasChosenSpell={hasChosenSpell}
          setHasChosenSpell={setHasChosenSpell}
        />
      )}
    </div>
  );
};
