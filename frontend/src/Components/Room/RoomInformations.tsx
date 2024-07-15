import { useNavigate } from "react-router-dom";
import { Room, TttRoom } from "../../Interfaces/Rooms";
import { User } from "../../Interfaces/User";

interface RoomInformationsProps {
  user: User;
  room: Room;
  readyPlayers: number;
}

export const RoomInformations = (props: RoomInformationsProps) => {
  const { user, room, readyPlayers } = props;

  const navigate = useNavigate();

  const getGameStatus = () => {
    if (room.started) {
      if (room.finished) {
        return "Partie terminée";
      } else {
        return "Partie en cours";
      }
    }

    return "Partie non commencée";
  };

  const checkIfActualPlayer = (player: User) => {
    return player.id === user.id;
  };

  return (
    <div className="w-1/6 bg-darkBlue-gray border-t-2 border-t-darkBlue-dark h-screen">
      <div className="w-3/4 mx-auto">
        <div className="mt-5 text-xl">
          <h2 className="flex items-center gap-3 text-2l text-white font-bold justify-center">
            Partie: {room.name}
          </h2>
          {room.players.length !== room.maxPlayers && (
            <h3 className="mt-6">
              En attente de joueurs ... ({room.players.length}/{room.maxPlayers}
              )
            </h3>
          )}

          {room.players.length === room.maxPlayers && (
            <h2 className="flex items-center gap-3 text-2l text-white font-bold justify-center mt-10">
              Joueurs ({readyPlayers}/{room.players.length} prêts)
            </h2>
          )}
        </div>
        <div>
          {room &&
            room.players.map((player: User) => (
              <div
                key={player.id}
                className="flex items-center justify-between mx-auto mt-4 w-full hover:cursor-pointer"
                onClick={() => navigate(`/profile/${player.id}`)}
              >
                <div className="flex gap-4">
                  <img
                    src={player.profile_picture}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="text-lg cursor-pointer" key={player.id}>
                    {player.username}
                  </p>
                </div>

                <div className="mx-2 text-right">
                  <p className="text-center">
                    ({player.ready ? "Prêt" : "Pas prêt"})
                  </p>
                </div>
              </div>
            ))}
        </div>
        <div className="mt-10">
          <h3 className="text-xl font-bold">Informations sur la partie : </h3>
          <div className="text-left flex flex-col gap-4 mt-4">
            {room && room.name && (
              <p>
                {" "}
                <span className="font-bold"> Nom: </span>
                {room.name}
              </p>
            )}
            <p className="mr-2">
              <span className="font-bold"> Statut: </span>
              {room && getGameStatus()}
            </p>
            <p>
              {room && room.finished
                ? room.winner
                  ? `Gagnant: ${room.winner.user?.username}`
                  : "Match nul"
                : ""}
            </p>
            <p>
              {room &&
              room.moves &&
              room.moves.length > 0 && (
                <span className="font-bold"> Nombre de coups: </span>
              )
                ? `Nombre de coups: ${room.moves.length - 1}`
                : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
