import React from "react";
import { Data, CardInterface } from "./Data";
import Card from "./Card";

const Memory = () => {
  const [cardsArray, setCardsArray] = React.useState<CardInterface[]>([]);
  const [moves, setMoves] = React.useState(0);
  const [firstCard, setFirstCard] = React.useState<CardInterface | null>(null);
  const [secondCard, setSecondCard] = React.useState<CardInterface | null>(
    null
  );
  const [stopFlip, setStopFlip] = React.useState(false);
  const [won, setWon] = React.useState(0);

  //this function start new Game
  function NewGame() {
    setTimeout(() => {
      const randomOrderArray = Data.sort(() => 0.5 - Math.random());
      setCardsArray(randomOrderArray);
      setMoves(0);
      setFirstCard(null);
      setSecondCard(null);
      setWon(0);
    }, 1200);
  }

  //this function helps in storing the firstCard and secondCard value
  function handleSelectedCards(item: CardInterface) {
    console.log(typeof item);
    if (firstCard !== null && firstCard.id !== item.id) {
      setSecondCard(item);
    } else {
      setFirstCard(item);
    }
  }

  // if two have been selected then we check if the images are same or not,
  //if they are same then we stop the flipping ability
  // else we turn them back
  React.useEffect(() => {
    if (firstCard && secondCard) {
      setStopFlip(true);
      if (firstCard.name === secondCard.name) {
        setCardsArray((prevArray) => {
          return prevArray.map((unit) => {
            if (unit.name === firstCard.name) {
              return { ...unit, matched: true };
            } else {
              return unit;
            }
          });
        });
        setWon((preVal) => preVal + 1);
        removeSelection();
      } else {
        setTimeout(() => {
          removeSelection();
        }, 1000);
      }
    }
  }, [firstCard, secondCard]);

  //after the slected images have been checked for
  //equivalency we empty the firstCard and secondCard component
  function removeSelection() {
    setFirstCard(null);
    setSecondCard(null);
    setStopFlip(false);
    setMoves((prevValue) => prevValue + 1);
  }

  //starts the game for the first time.
  React.useEffect(() => {
    NewGame();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row p-2 justify-center items-center">
        <h1 className="text-white text-4xl">Memory Game</h1>
      </div>
      <div className="grid grid-cols-[repeat(4,9rem)] place-items-center gap-y-8 mt-12 m-auto">
        {
          // cards component help in coverting the
          // data from array to visible data for screen
          cardsArray.map((item) => (
            <Card
              item={item}
              key={item.id}
              handleSelectedCards={handleSelectedCards}
              toggled={
                item === firstCard ||
                item === secondCard ||
                item.matched === true
              }
              stopflip={stopFlip}
            />
          ))
        }
      </div>

      {won !== 6 ? (
        <div className="bg-[black] text-center mt-10 m-auto px-4 py-1 rounded-[2rem]">
          Moves : {moves}
        </div>
      ) : (
        <div className="bg-[black] text-center mt-10 m-auto px-4 py-1 rounded-[2rem]">
          ???????? You Won in {moves} moves ????????
        </div>
      )}
      <button
        className="flex items-center justify-center w-[200px] text-[1.2rem] font-[bolder] bg-[red] text-[white] ml-[55%] mt-1 px-[0.8rem] py-2 rounded-[0.7rem] border-none hover:cursor-pointer hover:border-2 hover:border-solid hover:border-[black]"
        onClick={NewGame}
      >
        New Game
      </button>
    </div>
  );
};

export default Memory;
