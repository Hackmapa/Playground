import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Game } from "../../Interfaces/Game";
import { RootState } from "../../Redux/store";
import { get } from "../../utils/requests/get";
import { RpsRoom } from "../../Interfaces/Rooms";
import { Loader } from "../../Components/Loader/Loader";
import { Box, Typography, Slider } from "@mui/material";
import { RpsRoundCircles } from "./Components/RpsRoundCircles";
import { ReplayHeader } from "../../Components/Game/ReplayHeader";
import { dateToString, dateToTimeString } from "../../utils/utils";
import { getGameName } from "../../utils/gameInfos";

export const RpsReplay = () => {
  const navigate = useNavigate();

  const token = useSelector((state: RootState) => state.token);
  const user = useSelector((state: RootState) => state.user);

  const { gameId } = useParams();

  const [currentTurn, setCurrentTurn] = useState(0);
  const [game, setGame] = useState<Game>();
  const [players, setPlayers] = useState<any[]>([]);
  const [moves, setMoves] = useState<any[]>([]);

  const handleSliderChange = (event: any, newValue: any) => {
    setCurrentTurn(newValue);
  };

  const fetchGame = async () => {
    const game = await get(`games/${gameId}`, token);

    const moves = game.turns[0].state.moves as RpsRoom[];
    setMoves(moves);

    setGame(game);
  };

  const isActualUser = (friendId: number) => {
    return user.id === friendId;
  };

  const getPlayers = () => {
    const firstTurn = game?.turns[0].state as RpsRoom;
    const players = firstTurn.players;

    setPlayers(players);
  };

  const getWinner = (winnerId: number) => {
    const winner = players.find((player) => player.id === winnerId);

    return winner.username;
  };

  useEffect(() => {
    document.title = `${gameId} Replay`;

    fetchGame();
  }, []);

  useEffect(() => {
    setMoves(game?.turns[currentTurn].state.moves as []);
  }, [game, currentTurn]);

  useEffect(() => {
    if (game) {
      getPlayers();
    }
  }, [game]);

  return (
    <div className="flex bg-darkBlue-dark text-white w-full justify-between">
      {game ? (
        <>
          <div className="text-center p-5 w-4/5 mx-auto">
            <ReplayHeader
              game={game}
              description="Rejouez une partie de pierre, papier, ciseaux !"
            />
            <div className="flex justify-between w-full mx-auto mt-10">
              {moves[currentTurn].map((move: any) => {
                return (
                  <>
                    {move.user && (
                      <div className="flex flex-col items-center mx-auto">
                        <div>
                          <img
                            src={`${process.env.REACT_APP_PUBLIC_URL}/images/${move.move}.png`}
                            alt="image"
                            className="w-52 h-52 bg-white rounded-full p-5"
                          />
                        </div>
                        <div
                          className="flex items-center gap-4 mt-5"
                          onClick={() => navigate(`/profile/${move.user.id}`)}
                        >
                          <img
                            src={`${move.user.profile_picture}`}
                            alt="image"
                            className="w-16 h-16 rounded-full"
                          />
                          <p className="font-bold text-xl">
                            {isActualUser(move.user.id)
                              ? "Vous"
                              : move.user.username}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                );
              })}
            </div>
            <RpsRoundCircles room={game.turns[currentTurn].state as RpsRoom} />

            <div className="flex justify-center mt-10">
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
                      <div
                        className="flex gap-4 cursor-pointer"
                        onClick={() => navigate(`/profile/${player.id}`)}
                      >
                        <img
                          src={player.profile_picture}
                          alt="avatar"
                          className="w-8 h-8 rounded-full"
                        />
                        <p className="text-lg" key={player.id}>
                          {isActualUser(player.id) ? "Vous" : player.username}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <h2 className="mt-10 text-xl font-bold">
                  Gagnant:
                  {game.winner && players.length > 0
                    ? isActualUser(game.winner?.id)
                      ? " Vous"
                      : ` ${getWinner(game.winner.id)}`
                    : " Pas de gagnant"}
                </h2>
                <p className="text-lg mt-4 text-left">
                  Partie jouée le {dateToString(game.createdAt)} à{" "}
                  {dateToTimeString(game.createdAt)}
                </p>
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
