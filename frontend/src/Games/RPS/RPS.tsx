export const RPS = () => {
  const sendMove = (move: string) => {};

  return (
    <div className="App">
      <h1>Rock Paper Scissors</h1>
      <button onClick={() => sendMove("rock")}>Rock</button>
      <button onClick={() => sendMove("paper")}>Paper</button>
      <button onClick={() => sendMove("scissors")}>Scissors</button>
    </div>
  );
};
