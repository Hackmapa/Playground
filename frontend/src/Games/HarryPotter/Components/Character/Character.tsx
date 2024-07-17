import { useEffect, useState } from "react";

import HealthBar from "../HealthBar/HealthBar";
import ManaBar from "../ManaBar/ManaBar";
import { StatusBar } from "./StatusBar/StatusBar";
import { User } from "../../../../Interfaces/User";
import { Character } from "../../../../Interfaces/HarryPotter/Character";

interface CharacterProps {
  character: Character;
  flip?: boolean;
  isAttacking?: boolean;
  user?: User;
}

const CharacterComponent = (props: CharacterProps) => {
  const { character, flip, isAttacking, user } = props;

  const [image, setImage] = useState<string>("/hr-debout.gif");

  const handleAttack = () => {
    setImage("/hr-sort.gif");
    setTimeout(() => {
      setImage("/hr-debout.gif");
    }, 1000);
  };

  useEffect(() => {
    if (isAttacking) {
      handleAttack();
    }
  }, [isAttacking]);

  return (
    <div className="w-full text-left">
      <div className="px-5">
        <div className="flex justify-center">
          <h2 className="font-bold text-xl text-white text-center py-2">
            {character.username} {user?.id === character.id && "(You)"}
          </h2>
        </div>
        <div
          className="bg-cover bg-bottom w-full rounded-lg overflow-hidden flex flex-col items-center justify-center"
          style={{ backgroundImage: "url('/wall-dungeon.jpg')" }}
        >
          <img
            className={`h-52 w-52 my-4 ${flip ? "transform scale-x-[-1]" : ""}`}
            src={image}
            alt={""}
          />
          <div className="flex flex-col w-full p-2">
            <StatusBar status={character.status} />
            <div className="flex justify-between items-end w-full h-full">
              <HealthBar
                health={character.health}
                maxHealth={character.maxHealth}
              />
              <ManaBar mana={character.mana} maxMana={character.maxMana} />
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default CharacterComponent;
