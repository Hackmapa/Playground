import Spell from "../spell.js";

export default class PetrificusTotalus extends Spell {
  constructor() {
    super(4, "Petrificus Totalus", "Etourdit la cible", "status", 20, 1);
  }

  cast(character) {
    return this.sendMessage(character.setStunned(this.power));
  }
}
