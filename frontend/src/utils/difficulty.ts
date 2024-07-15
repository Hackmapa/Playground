export const difficulty = (level: string) => {
  switch (level) {
    case "easy":
      return "Facile";
    case "medium":
      return "Moyen";
    case "hard":
      return "Difficile";
    default:
      return "Aucune";
  }
};
