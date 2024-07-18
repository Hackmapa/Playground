import { Character } from "./Character";
import { Log } from "../Log";

export interface HarryPotterGame {
  characters: Character[];
  currentTurn: number;
  currentPlayer?: Character;
  opponentPlayer?: Character;
  started: boolean;
  finished: boolean;
  results?: {
    winner: Character;
    loser: Character;
  };
  logs: Log[];
}
