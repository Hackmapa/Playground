import { OverlayTrigger, Popover } from "react-bootstrap";
import { translate } from "../../utils/translateType";
import { Spell } from "../../../../Interfaces/HarryPotter/Spell";

interface ButtonProps {
  onClick: () => void;
  label: string;
  spell?: Spell;
  disabled?: boolean;
}

function Button(props: ButtonProps) {
  const { onClick, label, spell, disabled } = props;

  const getSpellColor = (spell: Spell) => {
    switch (spell.type) {
      case "damage":
        return "bg-red-500";
      case "utility":
        return "bg-green-500";
      case "status":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const popover = (
    <Popover
      id="popover-basic"
      className="bg-darkBlue px-4 py-2 text-white rounded-xl"
    >
      <Popover.Header as="h3" className="text-center font-bold text-xl">
        {spell?.name} - {translate(spell?.type)}
      </Popover.Header>
      <Popover.Body className="mt-4">
        <ul>
          <li>
            <p className="text-base">{spell?.description}</p>
          </li>
          <li>
            <p className="spell-cost mt-4">
              <span className="font-bold text-base">Coût : </span>
              <span className="font-bold text-blue-400">
                {spell?.cost} mana
              </span>
            </p>
          </li>
          <li>
            <p className="spell-power mt-4">
              <span className="font-bold">Puissance : </span>
              <span className="font-bold">{spell?.power}</span>
            </p>
          </li>
        </ul>
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="relative w-full">
      <OverlayTrigger placement="top" overlay={spell ? popover : <></>}>
        {spell ? (
          <button
            onClick={onClick}
            className={`${
              spell && getSpellColor(spell)
            }  border-none text-white p-4 text-center text-lg rounded cursor-pointer w-full hover:transform hover:scale-105 transition duration-200 ${
              disabled ? "bg-gray-400 cursor-not-allowed" : ""
            }`}
            disabled={disabled ? disabled : false}
          >
            {label}
          </button>
        ) : (
          <button
            onClick={onClick}
            className={`bg-darkBlue border-none text-white p-4 text-center text-lg rounded cursor-pointer w-full hover:transform hover:scale-105 transition duration-200 ${
              disabled ? "bg-gray-400 cursor-not-allowed" : ""
            }`}
            disabled={disabled ? disabled : false}
          >
            {label}
          </button>
        )}
      </OverlayTrigger>
    </div>
  );
}

export default Button;
