export const difficulty = (level: string) => {
  switch (level) {
    case "easy":
      return "Facile";
    case "medium":
      return "Moyenne";
    case "hard":
      return "Difficile";
    default:
      return "Aucune";
  }
};
