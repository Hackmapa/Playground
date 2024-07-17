import { useEffect, useState } from "react";
import "./game.css";

import CharacterComponent from "../../Components/Character/Character";
import { isOdd } from "../../utils/numberOddEven";
import { UserInterface } from "./UserInterface/UserInterface";
import { useSelector } from "react-redux";
import { Character } from "../../../../Interfaces/HarryPotter/Character";
import { HarryPotterRoom } from "../../../../Interfaces/Rooms";
import { socket } from "../../../../socket";
import { RootState } from "../../../../Redux/store";
import { HarryPotterGame } from "../../../../Interfaces/HarryPotter/HarryPotterGame";

interface HarryPotterProps {
  room: HarryPotterRoom;
  gameId: number | undefined;
}

export const HarryPotter = (props: HarryPotterProps) => {
  const { room, gameId } = props;

  const user = useSelector((state: RootState) => state.user);

  const [characters, setCharacters] = useState<Character[]>([]);
  const [hasChosenSpell, setHasChosenSpell] = useState<boolean>(false);
  const [game, setGame] = useState<HarryPotterGame>();

  const organizeCharacters = (characters: Character[]) => {
    const updatedCharacters = characters.filter((c) => c.id !== user?.id);
    updatedCharacters.unshift(characters.find((c) => c.id === user?.id)!);

    return updatedCharacters;
  };

  useEffect(() => {
    if (room) {
      const updatedCharacters = organizeCharacters(room.characters);
      setCharacters(updatedCharacters);

      setGame(room.game);
      setHasChosenSpell(false);
    }
  }, [room]);

  return (
    <div className="game-container">
      <div className="game-characters-container">
        {room &&
          characters.map((character: Character, index: number) => (
            <CharacterComponent
              key={character.id}
              character={character}
              flip={isOdd(index) ? true : false}
              user={user}
            />
          ))}
      </div>

      {room && (
        <UserInterface
          gameId={gameId}
          characters={characters}
          game={game}
          socket={socket}
          hasChosenSpell={hasChosenSpell}
          setHasChosenSpell={setHasChosenSpell}
        />
      )}
    </div>
  );
};
