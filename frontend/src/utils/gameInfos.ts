import g from "../Games/games.json";

export const getGameName = (gameId: number) => {
  let name = "";

  g.games.forEach((g) => {
    if (g.id === gameId) {
      name = g.name;
    }
  });

  return name;
};

export const getGameLink = (gameId: number) => {
  let link = "";

  g.games.forEach((g) => {
    if (g.id === gameId) {
      console.log(g.link);
      link = g.link;
    }
  });

  return link;
};
