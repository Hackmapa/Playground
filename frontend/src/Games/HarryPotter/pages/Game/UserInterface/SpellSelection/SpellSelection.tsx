import { Character } from "../../../../../../Interfaces/HarryPotter/Character";
import { Spell } from "../../../../../../Interfaces/HarryPotter/Spell";
import { socket } from "../../../../../../socket";
import Button from "../../../../Components/Button/Button";

import { useState } from "react";
import { useSelector } from "react-redux";

interface SpellSelectionProps {
  gameId: number | undefined;
  characters: Character[];
  isGameStarted: boolean;
  hasChosenSpell: boolean;
  setHasChosenSpell: (hasChosenSpell: boolean) => void;
}

export const SpellSelection = (props: SpellSelectionProps) => {
  const user = useSelector((state: any) => state.user);
  const room = useSelector((state: any) => state.harryPotterRoom);
  const token = useSelector((state: any) => state.token);

  const {
    gameId,
    characters,
    isGameStarted,
    hasChosenSpell,
    setHasChosenSpell,
  } = props;

  const [isChoosingTarget, setIsChoosingTarget] = useState<boolean>(false);
  const [selectedSpell, setSelectedSpell] = useState<Spell>();

  const handleCastSpell = (spellId: number | undefined, target: Character) => {
    setHasChosenSpell(true);
    socket.emit(
      "castHarryPotterSpell",
      room,
      user,
      target,
      spellId,
      token,
      gameId
    );
    setIsChoosingTarget(false);
  };

  const handleChoseSpell = (spell: Spell) => {
    setIsChoosingTarget(true);
    setSelectedSpell(spell);
  };

  const getOpponent = (character: Character) => {
    return characters.find((c) => c.id !== character.id);
  };

  return (
    <div className="w-full flex flex-col">
      {!isChoosingTarget ? (
        <>
          <div className="flex flex-col justify-between items-center w-full flex-1">
            {isGameStarted &&
              characters.map((character: Character) => {
                if (character.id === user.id)
                  return (
                    <div key={character.id}>
                      {!hasChosenSpell ? (
                        <div className="flex items-center justify-around">
                          <h2 className="my-4 font-bold text-2xl">
                            Choisissez un sort !
                          </h2>
                        </div>
                      ) : (
                        <div className="flex items-center justify-around">
                          <h2 className="my-4 font-bold text-2xl">
                            Attends que {getOpponent(character)?.username}{" "}
                            choisisse ... !
                          </h2>
                        </div>
                      )}

                      {!hasChosenSpell && (
                        <div
                          key={character.id}
                          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5 mt-5"
                        >
                          {character.spells.map((spell: Spell) => {
                            return (
                              <Button
                                key={spell.id}
                                onClick={() => handleChoseSpell(spell)}
                                label={spell.name}
                                spell={spell}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                return null;
              })}
          </div>
        </>
      ) : (
        isChoosingTarget && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5 mt-5">
            {room &&
              characters.map((character: Character) => {
                return (
                  <Button
                    key={character.id}
                    label={
                      character.id === user.id
                        ? `${character.firstname} (You)`
                        : character.firstname
                    }
                    onClick={() => {
                      handleCastSpell(selectedSpell?.id, character);
                    }}
                  />
                );
              })}
          </div>
        )
      )}
    </div>
  );
};
