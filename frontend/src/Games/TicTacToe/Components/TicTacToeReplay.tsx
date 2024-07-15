import { Game } from "../../../Interfaces/Game";
import { TicTacToeBoard } from "./TicTacToeBoard";
import { useEffect, useState } from "react";
import { TttRoom } from "../../../Interfaces/Rooms";
import { get } from "../../../utils/requests/get";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { useParams } from "react-router-dom";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Loader } from "../../../Components/Loader/Loader";
import CircleIcon from "../Assets/circle.png";
import CrossIcon from "../Assets/cross.png";

export const TicTacToeReplay = () => {
  const token = useSelector((state: RootState) => state.token);
  const user = useSelector((state: RootState) => state.user);

  const { gameId } = useParams();

  const [currentTurn, setCurrentTurn] = useState(0);
  const [game, setGame] = useState<Game>();
  const [players, setPlayers] = useState<any[]>([]);

  const getPlayers = () => {
    const firstTurn = game?.turns[0].state as TttRoom;
    const players = firstTurn.players;

    setPlayers(players);

    const player1Symbol = firstTurn.currentPlayer.symbol;
    const player2Symbol = player1Symbol === "X" ? "O" : "X";

    players[0].symbol = player1Symbol;
    players[1].symbol = player2Symbol;

    setPlayers(players);
  };

  const handleSliderChange = (event: any, newValue: any) => {
    setCurrentTurn(newValue);
  };

  const fetchGame = async () => {
    const game = await get(`games/${gameId}`, token);
    setGame(game);
  };

  const isActualUser = (friendId: number) => {
    return user.id === friendId;
  };

  useEffect(() => {
    document.title = `Tic Tac Toe - Game ${gameId} Replay`;

    fetchGame();
  }, []);

  useEffect(() => {
    if (game) {
      getPlayers();
    }
  }, [game]);

  return (
    <div className="flex bg-darkBlue-dark text-white w-full justify-between">
      {game ? (
        <>
          <div className="text-center p-5 w-4/5">
            <TicTacToeBoard room={game.turns[currentTurn].state as TttRoom} />
            <div className="flex justify-center">
              <Box sx={{ width: 300, margin: "auto", textAlign: "center" }}>
                <Typography variant="h6" gutterBottom>
                  Game Replay
                </Typography>
                <Slider
                  value={currentTurn}
                  onChange={handleSliderChange}
                  aria-labelledby="continuous-slider"
                  step={1}
                  marks
                  min={0}
                  max={game.turns.length - 1}
                />
                <Typography variant="body1" gutterBottom>
                  Tour: {currentTurn + 1}
                </Typography>
              </Box>
            </div>
          </div>
          <div className="w-1/6 bg-darkBlue-gray border-t-2 border-t-darkBlue-dark h-screen">
            <div className="w-3/4 mx-auto">
              <div className="mt-5 text-xl">
                <h2 className="text-xl font-bold">Joueurs :</h2>
                <div>
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between mx-auto mt-4 w-full"
                    >
                      <div className="flex gap-4">
                        <img
                          src={player.profile_picture}
                          alt="avatar"
                          className="w-8 h-8 rounded-full"
                        />
                        <p className="text-lg cursor-pointer" key={player.id}>
                          {isActualUser(player.id) ? "Vous" : player.username}
                        </p>
                      </div>
                      <div className="mx-2 text-right">
                        <img
                          src={player.symbol === "X" ? CrossIcon : CircleIcon}
                          className="w-8 h-8"
                          alt={`${player.symbol} icon`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <h2 className="mt-10 text-xl font-bold">
                  Gagnant :
                  {game.winner
                    ? isActualUser(game.winner.id)
                      ? " Vous"
                      : game.winner.username
                    : " Pas de gagnant"}
                </h2>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="h-screen w-full flex justify-center items-center">
          <Loader />
        </div>
      )}
    </div>
  );
};
