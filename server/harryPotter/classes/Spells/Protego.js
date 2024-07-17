import Spell from "../spell.js";

export default class Protego extends Spell {
  constructor() {
    super(3, "Protego", "Vous protège du prochain sort", "status", 20, 2);
  }

  cast(character) {
    character.setProtected(this.power);
    return this.sendMessage(character.setProtected(this.power));
  }
}
