import Spell from "../spell.js";

export default class Reparo extends Spell {
  constructor() {
    super(2, "Reparo", "Lance un sort de soin", "utility", 10, 10);
  }

  cast(character) {
    return this.sendMessage(character.heal(this.power));
  }
}
